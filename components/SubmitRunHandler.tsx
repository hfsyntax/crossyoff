"use client"
import type { HighscoreFormResult } from "@/types"
import type { FormEvent } from "react"
import { useRef, useState, useEffect, useActionState } from "react"
import { handleSubmitRun } from "@/actions"
import ReCAPTCHA from "react-google-recaptcha"

export default function SubmitRunHandler() {
  const recaptcha = useRef<ReCAPTCHA | null>(null)
  const currentForm = useRef<HTMLFormElement>(null)
  const [formError, setFormError] = useState<string>()
  const [formResponse, formAction, isPending] = useActionState<
    HighscoreFormResult | null,
    FormData
  >(handleSubmitRun, null)

  const setRecaptchaToken = async (event: FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault()
      await recaptcha?.current?.executeAsync()
      const formElement = event.target as HTMLFormElement
      const formData = new FormData(formElement)
      const formInputs = ["name", "country", "score", "video_url", "platform"]
      const validURLRegex =
        /^(?:(?:https?):\/\/)?(?:www\.)?[a-z0-9-]+(?:\.[a-z0-9-]{2,5})+(?:\/[^\s]*)?$/i

      for (let input of formInputs) {
        if (!formData.get(input)) {
          return setFormError(`${input} cannot be empty`)
        }
      }

      const name = String(formData.get("name"))
      const country = String(formData.get("country"))
      const score = String(formData.get("score"))
      const videoURL = String(formData.get("video_url"))
      const platform = String(formData.get("platform"))

      if (name.length > 64) {
        return setFormError("name too long")
      }

      if (country.length < 4 || country.length > 64) {
        return setFormError("invalid country")
      }

      if (isNaN(parseInt(score)) || score.length > 4) {
        return setFormError("score must be a number and 4 digits or less")
      }

      if (videoURL.length > 2083 || !validURLRegex.test(videoURL)) {
        return setFormError("invalid video url")
      }

      if (platform !== "mobile" && platform !== "PC") {
        return setFormError("platform must be Mobile or PC")
      }

      formAction(formData)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (formResponse?.success) {
      currentForm?.current?.reset()
    }
    if (formResponse?.error) setFormError(formResponse.error)
    if (formError && !formResponse?.error) setFormError("")
  }, [formResponse])

  return (
    <form ref={currentForm} onSubmit={setRecaptchaToken}>
      <label className="ml-1 text-lg xl:ml-0" htmlFor="name">
        Name
      </label>
      <input
        type="text"
        id="name"
        name="name"
        placeholder="Full Name"
        autoComplete="name"
        required
        className="ml-1 mr-1 box-border h-10 w-[calc(100%_-_8px)] border border-black pb-0 pl-5 pr-5 pt-0 outline-none focus:border-red-500 xl:ml-0 xl:mr-0 xl:w-full"
      />
      <br />
      <label className="ml-1 text-lg xl:ml-0" htmlFor="country">
        Country
      </label>
      <input
        type="text"
        id="country"
        name="country"
        placeholder="Country"
        autoComplete="country"
        required
        className="ml-1 mr-1 box-border h-10 w-[calc(100%_-_8px)] border border-black pb-0 pl-5 pr-5 pt-0 outline-none focus:border-red-500 xl:ml-0 xl:mr-0 xl:w-full"
      />
      <br />
      <label className="ml-1 text-lg xl:ml-0" htmlFor="score">
        Score
      </label>
      <input
        type="number"
        id="score"
        name="score"
        placeholder="Score"
        autoComplete="off"
        required
        className="ml-1 mr-1 box-border h-10 w-[calc(100%_-_8px)] border border-black pb-0 pl-5 pr-5 pt-0 outline-none focus:border-red-500 xl:ml-0 xl:mr-0 xl:w-full"
      />
      <br />
      <label className="ml-1 text-lg xl:ml-0" htmlFor="video_url">
        Video URL
      </label>
      <input
        type="text"
        id="video_url"
        name="video_url"
        placeholder="Video URL"
        autoComplete="off"
        required
        className="ml-1 mr-1 box-border h-10 w-[calc(100%_-_8px)] border border-black pb-0 pl-5 pr-5 pt-0 outline-none focus:border-red-500 xl:ml-0 xl:mr-0 xl:w-full"
      />
      <label className="ml-1 text-lg xl:ml-0" htmlFor="platform">
        Platform
      </label>
      <select
        id="platform"
        name="platform"
        required
        defaultValue={""}
        className="ml-1 mr-1 box-border h-10 w-[calc(100%_-8px)] border border-black pb-0 pl-5 pr-5 pt-0 outline-none focus:border-red-500 xl:ml-0 xl:mr-0 xl:w-full"
      >
        <option value="" disabled>
          Platform:
        </option>
        <option value="mobile">mobile</option>
        <option value="PC">PC</option>
      </select>
      <input
        type="submit"
        className="relative ml-1 mt-2 w-fit border-none bg-red-500 pb-2 pl-4 pr-4 pt-2 text-white no-underline hover:rounded-xl hover:bg-slate-100 hover:text-red-500 enabled:cursor-pointer enabled:duration-500 enabled:ease-in-out md:pb-3 md:pl-5 md:pr-5 md:pt-3 lg:pb-4 lg:pl-9 lg:pr-9 lg:pt-4 xl:ml-0"
        name="submit-btn"
        value={isPending ? "Loading..." : "Submit"}
        disabled={isPending}
      />
      <ReCAPTCHA
        ref={recaptcha}
        sitekey="6Leu4_UUAAAAAEmRqjfo2-g9z75Jc8JHAi7_D-LG"
        size="invisible"
      />
      {formError && <span className="font-bold text-red-500">{formError}</span>}
      {formResponse?.success && (
        <span className="font-bold text-green-500">{formResponse.success}</span>
      )}
    </form>
  )
}
