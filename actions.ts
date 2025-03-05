"use server"
import type { QueryResultRow } from "@vercel/postgres"
import { revalidatePath } from "next/cache"
import { cache } from "react"
import { sql } from "@vercel/postgres"

const capitalizeString = (str: string): string => {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

const getMembersCount = cache(async (): Promise<string | number> => {
  try {
    const endpoint = "https://discord.com/api/guilds/600865413890310155/preview"
    const token = process.env.BOT_TOKEN
    const response = await fetch(endpoint, {
      headers: { Authorization: `Bot ${token}` },
      method: "GET",
    })
    const responseBody = await response.json()
    return responseBody.approximate_member_count
      ? responseBody.approximate_member_count
      : "N/A"
  } catch (error) {
    console.error(error)
    return "N/A"
  }
})

const getTournamentCount = cache(async (): Promise<number> => {
  try {
    const queryResult =
      await sql`SELECT COUNT(*) AS count FROM crossy_road_tournaments`
    return queryResult?.rowCount && queryResult?.rowCount > 0
      ? queryResult?.rows?.[0].count
      : 0
  } catch (error) {
    console.error(error)
    return 0
  }
})

const getAllTournaments = cache(async (): Promise<QueryResultRow[]> => {
  try {
    const queryResult =
      await sql`SELECT tournament_number, date, tournament_logo,  name, status, winner_country, winner, bracket_url, bracket_url2 FROM crossy_road_tournaments ORDER BY tournament_number DESC`
    return queryResult?.rowCount && queryResult?.rowCount > 0
      ? queryResult?.rows
      : []
  } catch (error) {
    console.error(error)
    return []
  }
})

const getAllPlayerElo = cache(
  async (search: string = ""): Promise<QueryResultRow[]> => {
    try {
      const queryResult =
        await sql`SELECT rank, flag, name AS player_name, elo, games, id FROM crossy_road_elo_rankings WHERE name ILIKE '%' || ${search} || '%' ORDER BY rank ASC`
      return queryResult?.rowCount && queryResult?.rowCount > 0
        ? queryResult?.rows
        : []
    } catch (error) {
      console.error(error)
      return []
    }
  },
)

const getPlayerElo = async (id: string): Promise<QueryResultRow[]> => {
  try {
    const queryResult =
      await sql`SELECT id, rank, flag, name, elo, games, won FROM crossy_road_elo_rankings WHERE id = ${id}`
    return queryResult?.rowCount && queryResult?.rowCount > 0
      ? queryResult?.rows
      : []
  } catch (error) {
    console.error(error)
    return []
  }
}

const getPlayerTournaments = async (
  id: number | string,
): Promise<QueryResultRow[]> => {
  try {
    const queryResult =
      await sql`SELECT tournaments, tournament AS name, place, score, change, img AS tournament_logo  FROM crossy_road_games WHERE id = ${id} ORDER BY tournaments DESC`
    return queryResult?.rowCount && queryResult?.rowCount > 0
      ? queryResult?.rows
      : []
  } catch (error) {
    console.error(error)
    return []
  }
}

const getPlayerChallenges = async (
  id: number | string,
): Promise<QueryResultRow[]> => {
  try {
    const queryResult = await sql`SELECT
        challenge_id,
        CASE
            WHEN challenger_id = ${id} THEN challenger_id
            WHEN opponent_id = ${id} THEN opponent_id
        END AS player_id,
        CASE
            WHEN challenger_id = ${id} THEN challenger_score
            WHEN opponent_id = ${id} THEN opponent_score
        END AS player_score
        FROM
            crossy_road_challenges
        WHERE
            challenger_id = ${id} OR opponent_id = ${id}`
    return queryResult?.rowCount && queryResult?.rowCount > 0
      ? queryResult?.rows
      : []
  } catch (error) {
    console.error(error)
    return []
  }
}

const getPlatformTopPlayers = cache(
  async (platform: string): Promise<QueryResultRow[]> => {
    try {
      const queryResult =
        await sql`SELECT rank, flag, name, score, date, titles, video_url, id FROM crossy_road_records WHERE platform = ${platform} ORDER BY rank ASC`
      return queryResult?.rowCount && queryResult?.rowCount > 0
        ? queryResult?.rows
        : []
    } catch (error) {
      console.error(error)
      return []
    }
  },
)

const validateRecaptcha = async (token: string): Promise<boolean> => {
  try {
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

export type PlayerSearchResult =
  | {
      error: string
      data?: undefined
      records?: undefined
    }
  | {
      data: QueryResultRow[]
      records: QueryResultRow[]
      error?: undefined
    }

const handlePlayerSearch = async (id: string): Promise<PlayerSearchResult> => {
  if (!id || id.length > 20 || isNaN(parseInt(id))) {
    return { error: "player not found" }
  }

  const playerSearch = await getPlayerElo(id)

  if (playerSearch.length === 0) {
    return { error: "no results" }
  }

  // get tournaments
  const playerTournaments = await getPlayerTournaments(playerSearch?.[0]?.id)

  // get challenges
  const playerChallenges = await getPlayerChallenges(playerSearch?.[0]?.id)

  // calculate average score and place
  let totalPlace = 0
  let totalScore = 0
  let totalTournaments = 0
  let totalChallenges = 0

  for (let tournament of playerTournaments) {
    const tournamentName = tournament["name"]
    if (
      !tournamentName.includes("Worlds") &&
      tournamentName !== "King of Cross #1"
    ) {
      const tournamentPlace = tournament["place"]
      const tournamentScore = tournament["score"]
      totalPlace += tournamentPlace
      totalScore += tournamentScore
      totalTournaments++
    }
  }

  for (let challenge of playerChallenges) {
    totalScore += challenge["player_score"]
    totalChallenges++
  }

  const averageScore = Math.round(
    totalScore / (totalTournaments + totalChallenges),
  )
  // max in the case of a player who played challenges but no tournaments
  const averagePlace = Math.round(totalPlace / Math.max(totalTournaments, 1))
  playerSearch[0].averageScore = averageScore
  playerSearch[0].averagePlace = averagePlace
  return { data: playerSearch, records: playerTournaments }
}

export type HighscoreFormResult =
  | {
      error: string
      success?: undefined
    }
  | {
      success: string
      error?: undefined
    }

const handleSubmitRun = async (
  prevState: any,
  formData: FormData,
): Promise<HighscoreFormResult> => {
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

  const scoreQueryResult =
    await sql`SELECT score FROM crossy_road_records WHERE platform = ${platform} AND score < ${score}`

  if (scoreQueryResult.rowCount === 0) {
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

export {
  getMembersCount,
  getTournamentCount,
  getAllTournaments,
  getAllPlayerElo,
  getPlatformTopPlayers,
  handlePlayerSearch,
  handleSubmitRun,
}
