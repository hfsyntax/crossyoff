"use server"
import type { HighscoreFormResult } from "@/types"
import { revalidatePath, revalidateTag } from "next/cache"
import { compare } from "bcryptjs"
import { encrypt, getSession } from "@/lib/session"
import { cookies, headers } from "next/headers"
import { redirect } from "next/navigation"
import supabase from "@/lib/supabase"

const validateRecaptcha = async (token: string): Promise<boolean> => {
  try {
    if (!process.env.RECAPTCHA_SECRET_KEY)
      throw new Error(
        "RECAPTCHA_SECRET_KEY environment variable is not defined!",
      )
    const recaptchaResponse = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
    )
    const responseBody = await recaptchaResponse.json()
    return responseBody?.success && responseBody?.score > 0.5
  } catch (error) {
    console.error(error)
    return false
  }
}

async function getDiscordUserById(id: string) {
  const discordUserResponse = await fetch(
    `https://discord.com/api/v10/users/${id}`,
    {
      headers: {
        Authorization: `Bot ${process.env.BOT_TOKEN}`,
      },
    },
  ).catch((error: Error) => {
    console.error(error)
    return null
  })

  if (!discordUserResponse) return null

  if (!discordUserResponse.ok) return null

  const discordUser = await discordUserResponse.json().catch((error: Error) => {
    console.error(error)
    return null
  })

  return discordUser
}

async function getDiscordUserByUsername(username: string) {
  const discordUserResponse = await fetch(
    `https://discord.com/api/v10/guilds/600865413890310155/members/search?query=${username}`,
    {
      headers: {
        Authorization: `Bot ${process.env.BOT_TOKEN}`,
      },
    },
  ).catch((error: Error) => {
    console.error(error)
    return null
  })

  if (!discordUserResponse) return null

  if (!discordUserResponse.ok) return null

  const discordUsers = await discordUserResponse
    .json()
    .catch((error: Error) => {
      console.error(error)
      return null
    })

  return discordUsers.find((x: any) => x.user.username === username)
}

export async function handleSubmitRun(
  prevState: any,
  formData: FormData,
): Promise<HighscoreFormResult> {
  const formInputs = ["name", "country", "score", "video_url", "platform"]
  const validURLRegex =
    /^(?:(?:https?):\/\/)?(?:www\.)?[a-z0-9-]+(?:\.[a-z0-9-]{2,5})+(?:\/[^\s]*)?$/i

  for (let input of formInputs) {
    if (!formData.get(input)) {
      revalidatePath("/submit_run")
      return { error: `${input} cannot be empty` }
    }
  }

  const name = String(formData.get("name"))
  const country = String(formData.get("country"))
  const score = String(formData.get("score"))
  const videoUrl = String(formData.get("video_url"))
  const platform = String(formData.get("platform"))
  const recaptchaToken = String(formData.get("g-recaptcha-response"))

  if (name.length > 64) {
    revalidatePath("/submit_run")
    return { error: "name too long" }
  }

  if (country.length < 4 || country.length > 64) {
    revalidatePath("/submit_run")
    return { error: "invalid country" }
  }

  if (isNaN(parseInt(score)) || score.length > 4) {
    revalidatePath("/submit_run")
    return { error: "score must be a number and 4 digits or less." }
  }

  if (videoUrl.length > 2083 || !validURLRegex.test(videoUrl)) {
    revalidatePath("/submit_run")
    return { error: "invalid video url" }
  }

  if (platform !== "mobile" && platform !== "PC") {
    revalidatePath("/submit_run")
    return { error: "platform must be Mobile or PC" }
  }

  if (!recaptchaToken) {
    revalidatePath("/submit_run")
    return { error: "no reCAPTCHA token set." }
  }

  const recaptchaValidated = await validateRecaptcha(recaptchaToken)

  if (!recaptchaValidated) {
    revalidatePath("/submit_run")
    return { error: "reCAPTCHA validation failed" }
  }

  const { data, error } = await supabase
    .from("crossy_road_records")
    .select("score")
    .eq("platform", platform)
    .lt("score", score)

  if (error) {
    console.error(error)
    revalidatePath("/submit_run")
    return { error: "Internal server error" }
  }

  if (data.length === 0) {
    revalidatePath("/submit_run")
    return { error: `score is less than the top 5 ${platform} highscores` }
  }

  // discord webhook embed with form data
  const webhookID = process.env.WEBHOOK_ID
  const webhookToken = process.env.WEBHOOK_TOKEN
  const webhookURL = `https://discord.com/api/webhooks/${webhookID}/${webhookToken}`
  const discordEmbed = {
    embeds: [
      {
        title: "CrossyOff Run Submission",
        type: "rich",
        timestamp: new Date().toISOString(),
        color: 15548997,
        footer: {
          text: "Sent",
        },
        fields: [
          { name: "Name", value: name },
          { name: "Country", value: country },
          { name: "Score", value: score },
          { name: "Platform", value: platform },
          { name: "Video URL", value: videoUrl },
        ],
      },
    ],
  }

  await fetch(webhookURL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(discordEmbed),
  }).catch((error) => {
    console.error(error)
    return { error: "discord api error" }
  })

  revalidatePath("/submit_run")
  return { success: "success" }
}

export async function addPlayer(prevState: any, formData: FormData) {
  const requestHeaders = await headers()
  const referenceHeader = requestHeaders.get("referer")
  const referencePath = referenceHeader
    ? new URL(referenceHeader).pathname
    : undefined
  const tableName = referencePath
    ? referencePath.split("/").slice(-1).join("")
    : undefined

  if (
    !referencePath ||
    !referencePath.startsWith("/crossy-road-castle/leaderboard/") ||
    !tableName
  )
    return

  const session = await getSession()
  if (!session) return redirect("/")

  const discordUsername = String(formData.get("discord_username")).trim()
  const points = parseInt(String(formData.get("points")).trim())

  if (
    !discordUsername ||
    discordUsername.length < 2 ||
    discordUsername.length > 32
  )
    return { error: "Discord username must be between 2-32 characters." }

  if (isNaN(points) || points < 0 || points > 9999)
    return { error: "Points must be a number between 0 and 9999" }

  const { data: tableExists, error: tableExistsError } = await supabase
    .from("crossy_road_castle_tables")
    .select("table_id")
    .eq("table_name", tableName)
    .maybeSingle()

  if (tableExistsError) return { error: "Internal server error" }

  if (!tableExists) return { error: "The table has been deleted" }

  const { data: discordUserExists, error: discordUserExistsError } =
    await supabase
      .from("discord_users")
      .select("discord_id")
      .eq("username", discordUsername)
      .maybeSingle()

  if (discordUserExistsError) return { error: "Internal server error" }

  let discordID: string | undefined = discordUserExists
    ? discordUserExists.discord_id
    : undefined

  // store this id to be used to check if row exists in table
  if (!discordUserExists) {
    const discordUser = await getDiscordUserByUsername(discordUsername)
    if (!discordUser) return { error: "Discord username does not exist" }
    if (!discordUser.user.id) return { error: "Internal server error" }
    discordID = discordUser.user.id
    const avatarHash = discordUser?.user?.avatar ?? null
    const avatarURL = avatarHash
      ? `https://cdn.discordapp.com/avatars/${discordID}/${avatarHash}.png?size=1024`
      : null

    const { data: insertDiscordUser, error: insertDiscordUserError } = avatarURL
      ? await supabase.from("discord_users").upsert(
          {
            discord_id: discordID!,
            username: discordUsername,
            avatar_url: avatarURL,
          },
          { onConflict: "discord_id", ignoreDuplicates: true },
        )
      : await supabase.from("discord_users").upsert(
          {
            discord_id: discordID!,
            username: discordUsername,
          },
          {
            onConflict: "discord_id",
            ignoreDuplicates: true,
          },
        )

    if (!insertDiscordUser || insertDiscordUserError)
      return { error: "Internal server error" }
  }

  const { data: insertRow, error: insertRowError } = await supabase
    .from("crossy_road_castle_data")
    .upsert(
      {
        table_id: tableExists.table_id,
        points,
        discord_id: discordID!,
      },
      { onConflict: "table_id, discord_id", ignoreDuplicates: true },
    )
    .select("*")

  if (insertRowError) return { error: "Internal server error" }

  if (insertRow.length === 0)
    return { error: `${discordUsername} already exists` }

  const { data: updateRanks, error: updateRanksError } = await supabase.rpc(
    "update_castle_ranks",
    {
      p_table_id: tableExists.table_id,
    },
  )

  if (updateRanksError) return { error: "Internal server error" }

  revalidateTag(`crossy_road_castle_leaderboard_${tableName}`)

  await supabase.channel("leaderboard-updates").send({
    type: "broadcast",
    event: "refresh",
    payload: { leaderboard: tableName },
  })

  return { success: `Successfully inserted ${discordUsername}` }
}

export async function removePlayers(prevState: any, rowIds: Set<number>) {
  const requestHeaders = await headers()
  const referenceHeader = requestHeaders.get("referer")
  const referencePath = referenceHeader
    ? new URL(referenceHeader).pathname
    : undefined
  const tableName = referencePath
    ? referencePath.split("/").slice(-1).join("")
    : undefined

  if (
    !referencePath ||
    !referencePath.startsWith("/crossy-road-castle/leaderboard/") ||
    !tableName
  )
    return

  const session = await getSession()
  if (!session) return redirect("/")

  if (rowIds.size === 0) return { error: "No players found to delete." }

  const { data: tableExists, error: tableExistsError } = await supabase
    .from("crossy_road_castle_tables")
    .select("table_id")
    .eq("table_name", tableName)
    .maybeSingle()

  if (tableExistsError) return { error: "Internal server error" }

  if (!tableExists) return { error: "The table has been deleted" }

  const { data: deletedRows, error: deletedRowsError } = await supabase
    .from("crossy_road_castle_data")
    .delete()
    .in("row_id", Array.from(rowIds))
    .eq("table_id", tableExists.table_id)
    .select("*")

  if (deletedRowsError) return { error: "Internal server error" }

  if (deletedRows.length === 0)
    return {
      error: `The ${rowIds.size > 1 ? "players have" : "player has"} already been deleted.`,
    }

  const updateRanks = await supabase.rpc("update_castle_ranks", {
    p_table_id: tableExists.table_id,
  })

  if (updateRanks.error) return { error: "Internal server error" }

  revalidateTag(`crossy_road_castle_leaderboard_${tableName}`)

  await supabase.channel("leaderboard-updates").send({
    type: "broadcast",
    event: "refresh",
    payload: { leaderboard: tableName },
  })

  return { success: "success" }
}

export async function updatePoints(
  prevState: any,
  { rowId, points }: { rowId: number; points: number },
) {
  const requestHeaders = await headers()
  const referenceHeader = requestHeaders.get("referer")
  const referencePath = referenceHeader
    ? new URL(referenceHeader).pathname
    : undefined
  const tableName = referencePath
    ? referencePath.split("/").slice(-1).join("")
    : undefined

  if (
    !referencePath ||
    !referencePath.startsWith("/crossy-road-castle/leaderboard/") ||
    !tableName
  )
    return

  const session = await getSession()
  if (!session) return redirect("/")

  if (points < 0 || points > 9999)
    return { error: "Points must be a number between 0-9999" }

  const { data: tableExists, error: tableExistsError } = await supabase
    .from("crossy_road_castle_tables")
    .select("table_id")
    .eq("table_name", tableName)
    .maybeSingle()

  if (tableExistsError) return { error: "Internal server error" }

  if (!tableExists?.table_id) return { error: "The table has been deleted" }

  const { data: updatedRow, error: updateRowError } = await supabase
    .from("crossy_road_castle_data")
    .update({ points })
    .eq("row_id", rowId)
    .select("*")

  if (updateRowError) return { error: "Internal server error" }

  if (updatedRow.length === 0)
    return { error: `Failed to update points, the player was deleted.` }

  const updateRanks = await supabase.rpc("update_castle_ranks", {
    p_table_id: tableExists.table_id,
  })

  if (updateRanks.error) return { error: "Internal server error" }

  revalidateTag(`crossy_road_castle_leaderboard_${tableName}`)

  await supabase.channel("leaderboard-updates").send({
    type: "broadcast",
    event: "refresh",
    payload: { leaderboard: tableName },
  })
}

export async function deleteLeaderboard(
  prevState: any,
  tableId: number,
): Promise<{ error?: string; success?: string } | undefined> {
  const requestHeaders = await headers()
  const referenceHeader = requestHeaders.get("referer")
  const referencePath = referenceHeader
    ? new URL(referenceHeader).pathname
    : undefined
  const tableName = referencePath
    ? referencePath.split("/").slice(-1).join("")
    : undefined

  if (
    !referencePath ||
    !referencePath.startsWith("/crossy-road-castle/leaderboard/") ||
    !tableName
  )
    return

  const session = await getSession()
  if (!session) return redirect("/")

  const { data: deletedTable, error: deleteTableError } = await supabase
    .from("crossy_road_castle_tables")
    .delete()
    .eq("table_id", tableId)
    .select("*")

  if (deleteTableError) return { error: "Internal server error" }

  if (deletedTable.length === 0)
    return { error: `${tableName} has already been deleted` }

  revalidateTag(`crossy_road_castle_leaderboard_${tableName}`)
  revalidateTag("crossy_road_castle_leaderboards")

  await supabase.channel("leaderboard-updates").send({
    type: "broadcast",
    event: "refresh",
    payload: { leaderboard: tableName },
  })

  return { success: "success" }
}

export async function login(prevState: any, formData: FormData) {
  const username = String(formData.get("username")).trim()
  const password = String(formData.get("password")).trim()
  const recaptchaResponse = String(formData.get("g-recaptcha-response"))

  if (!username || !password || username.length > 32 || password.length > 128)
    return { error: "incorrect username of password" }

  if (!recaptchaResponse) return { error: "invalid recapatcha response" }

  const recaptchaValidated = await validateRecaptcha(recaptchaResponse)

  if (!recaptchaValidated) return { error: "recaptcha validation failed" }

  const { data: loginCredentials, error: loginCredentialsError } =
    await supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .maybeSingle()

  if (loginCredentialsError) return { error: "Internal server error" }

  if (!loginCredentials) return { error: "incorrect username of password" }

  const hashedPassword = String(loginCredentials.password)
  const correctPassword = await compare(password, hashedPassword).catch(
    (error: Error) => {
      console.error(error)
      return null
    },
  )

  if (correctPassword === null) return { error: "Internal server error" }

  if (!correctPassword) return { error: "incorrect username of password" }

  const dbAuthID = String(loginCredentials.auth_id)
  const dbUsername = String(loginCredentials.username)
  const dbDiscordID = String(loginCredentials.discord_id)

  if (!dbAuthID || !dbUsername || !dbDiscordID)
    return { error: "Internal server error" }

  const discordUser = await getDiscordUserById(dbDiscordID)

  if (!discordUser) return { error: "Internal server error" }

  const avatarHash = "avatar" in discordUser ? discordUser.avatar : null
  const avatarURL = avatarHash
    ? `https://cdn.discordapp.com/avatars/${dbDiscordID}/${avatarHash}.png?size=1024`
    : null

  if (avatarURL) {
    const updateAvatarUrl = await supabase
      .from("discord_users")
      .update({ avatar_url: avatarURL })
      .eq("discord_id", dbDiscordID)
      .neq("avatar_url", avatarURL)
      .limit(1)

    if (updateAvatarUrl.error) console.error(updateAvatarUrl.error)
  }

  const user = {
    authID: dbAuthID,
    discordID: dbDiscordID,
    username: dbUsername,
    avatarURL: avatarURL,
  }

  const session = await encrypt({ user })

  if (!session) return { error: "Internal server error" }

  const { error: updateTokenError } = await supabase
    .from("users")
    .update({ session_token: session })
    .eq("username", dbUsername)

  if (updateTokenError) return { error: "Internal server error" }

  const cookieStore = await cookies()

  cookieStore.set("session", session, {
    httpOnly: true,
    path: "/",
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365 * 10),
  })

  const { data: tablesExist, error: tablesExistError } = await supabase
    .from("crossy_road_castle_tables")
    .select("table_name")
    .maybeSingle()

  if (tablesExistError) return { error: "Internal server error" }

  redirect(
    tablesExist
      ? `/crossy-road-castle/leaderboard/${tablesExist.table_name}`
      : "/crossy-road-castle",
  )
}

export async function logout() {
  const session = await getSession()
  if (!session || !session?.user.username) return

  const { error: removeTokenError } = await supabase
    .from("users")
    .update({ session_token: null })
    .eq("username", session.user.username)

  if (removeTokenError) return

  const cookieStore = await cookies()
  cookieStore.delete("session")

  redirect("/")
}

export async function createCRCTable(prevState: any, formData: FormData) {
  const session = await getSession()

  if (!session) return

  const tableName = String(formData.get("table_name"))

  if (!tableName) return { error: "Table name cannot be empty." }

  if (tableName.length > 50)
    return { error: "Table name cannot be more than 50 characters." }

  const noSpecialChars = /^[a-zA-Z0-9]+$/.test(tableName)

  if (!noSpecialChars)
    return { error: "Table name can only contain letters and numbers." }

  const { data: insertedTable, error: insertTableError } = await supabase
    .from("crossy_road_castle_tables")
    .upsert(
      { table_name: tableName },
      { onConflict: "table_name", ignoreDuplicates: true },
    )
    .select("*")

  if (insertTableError) return { error: "Internal server error" }

  if (insertedTable.length === 0) return { error: "Table name already exists." }

  revalidateTag("crossy_road_castle_leaderboards")
  revalidateTag(`crossy_road_castle_leaderboard_${tableName}`)

  await supabase.channel("leaderboard-updates").send({
    type: "broadcast",
    event: "refresh",
    payload: { leaderboard: tableName },
  })

  redirect(`/crossy-road-castle/leaderboard/${tableName}`)
}
