"use client"
import { useRef, useState, useEffect, FormEvent } from 'react'
import { useFormState } from 'react-dom'
import { HighscoreFormResult, handleSubmitRun } from '@/actions'
import ReCAPTCHA from 'react-google-recaptcha'

export default function SubmitRunHandler(): JSX.Element {
    const recaptcha = useRef<ReCAPTCHA | null>(null)
    const currentForm = useRef<HTMLFormElement>(null)
    const [formState, setFormState] = useState({
        error: "",
        disabled: false,
        text: "Submit"
    })
    const [formResponse, formAction] = useFormState<HighscoreFormResult | null, FormData>(handleSubmitRun, null)

    const setRecaptchaToken = async (event: FormEvent<HTMLFormElement>) => {
        try {
            event.preventDefault()
            await recaptcha?.current?.executeAsync()
            const formElement = event.target as HTMLFormElement
            const formData = new FormData(formElement)
            const formInputs = ["name", "country", "score", "video_url", "platform"]
            const validURLRegex = /^(?:(?:https?):\/\/)?(?:www\.)?[a-z0-9-]+(?:\.[a-z0-9-]{2,5})+(?:\/[^\s]*)?$/i

            for (let input of formInputs) {
                if (!formData.get(input)) {
                    return setFormState({...formState, error: `${input} cannot be empty`}) 
                }
            }

            const name = String(formData.get("name"))
            const country = String(formData.get("country"))
            const score = String(formData.get("score"))
            const videoURL = String(formData.get("video_url"))
            const platform = String(formData.get("platform"))
            
            if (name.length > 64) {
                return setFormState({...formState, error: "name too long"})
            }

            if (country.length < 4 || country.length > 64) {
                return setFormState({...formState, error: "invalid country"})
            }

            if (isNaN(parseInt(score)) || score.length > 4) {
                return setFormState({...formState, error: "score must be a number and 4 digits or less"})
            }

            if (videoURL.length > 2083 || !validURLRegex.test(videoURL)) {
                return setFormState({...formState, error: "invalid video url"})
            }

            if (platform !== "mobile" && platform !== "PC") {
                return setFormState({...formState, error: "platform must be Mobile or PC" })
            }

            formAction(formData)
            setFormState({
                ...formState,
                disabled: true,
                text: "Loading..."
            })
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        if (formResponse?.success) {
            currentForm?.current?.reset()
        }
        setFormState({ disabled: false, text: "Submit", error: "" })
    }, [formResponse])

    return (
        <form ref={currentForm} onSubmit={setRecaptchaToken}>
            <label htmlFor="name">Name</label>
            <input type="text" id="name" name="name" placeholder="Full Name" required /><br />
            <label htmlFor="country">Country</label>
            <input type="text" id="country" name="country" placeholder="Country" required /><br />
            <label htmlFor="score">Score</label>
            <input type="text" id="score" name="score" placeholder="Score" required /><br />
            <label htmlFor="video_url">Video URL</label>
            <input type="text" id="video_url" name="video_url" placeholder="Video URL" required />
            <label htmlFor="platform">Platform</label>
            <select id="platform" name="platform" required>
                <option value="">Platform:</option>
                <option value="mobile">mobile</option>
                <option value="PC">PC</option>
            </select>
            <input type="submit" className="btn" name="submit-btn" value={formState.text} style={{ width: "100%" }} disabled={formState.disabled} />
            <ReCAPTCHA ref={recaptcha} sitekey='6Leu4_UUAAAAAEmRqjfo2-g9z75Jc8JHAi7_D-LG' size='invisible' />
            {formState.error && <span style={{ color: "red" }}>{formState.error}</span>}
            {formResponse?.success && <span style={{ color: "green" }}>{formResponse?.success}</span>}
            {formResponse?.error && <span style={{ color: "red" }}>{formResponse?.error}</span>}
        </form>
    )
}