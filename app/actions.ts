"use server"
import type { HighscoreFormResult } from "@/types"
import type { RowList, Row } from "postgres"
import { revalidatePath } from "next/cache"
import sql from "../sql"

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

  const scoreQueryResult: RowList<Row[]> | null =
    await sql`SELECT score FROM crossy_road_records WHERE platform = ${platform} AND score < ${score}`.catch(
      (error) => {
        console.error(error)
        return null
      },
    )

  if (!scoreQueryResult) {
    revalidatePath("/submit_run")
    return { error: "Internal server error." }
  }

  if (scoreQueryResult.length === 0) {
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

export { handleSubmitRun }
