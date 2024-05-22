"use client"
import { useRef, useEffect } from 'react'
import { useFormState } from 'react-dom'
import { handleSubmitRun } from '../../../utility_functions'
import ReCAPTCHA from 'react-google-recaptcha'
const SubmitRun = () => {
    const recaptcha = useRef()
    const currentForm = useRef()
    const [formState, formAction] = useFormState(handleSubmitRun, null)

    const setRecaptchaToken = async (event) => {
        try {
            event.preventDefault()
            await recaptcha.current.executeAsync()
            const formData = new FormData(event.target)
            formAction(formData)
        } catch (error) {
            console.error(error)
        }  
    }

    useEffect(() => {
        if (formState?.success) {
            currentForm.current.reset()
        }
    }, [formState])

    return (
            <form ref={currentForm} onSubmit={setRecaptchaToken}>
                <label htmlFor="name">Name</label>
                <input type="text" id="name" name="name" placeholder="Full Name" required /><br/>
                <label htmlFor="country">Country</label>
                <input type="text" id="country" name="country" placeholder="Country" required /><br/>
                <label htmlFor="score">Score</label>
                <input type="text" id="score" name="score" placeholder="Score" required /><br/>
                <label htmlFor="video_url">Video URL</label>
                <input type="text" id="video_url" name="video_url" placeholder="Video URL" required />
                <label htmlFor="platform">Platform</label>
                <select id="platform" name="platform" defaultValue={"platform"}>
                    <option disabled value="platform">Platform:</option>
                    <option value="Mobile">mobile</option>
                    <option value="PC">PC</option>
                </select>
                <input type="submit" className="btn" name="submit-btn" value="Submit" style={{ width: "100%" }} />
                <ReCAPTCHA ref={recaptcha} sitekey='6Leu4_UUAAAAAEmRqjfo2-g9z75Jc8JHAi7_D-LG' size='invisible'/>
                {formState?.success ? <span style={{ color: "green" }}>{formState?.success}</span> : 
                (formState?.error ? <span style={{ color: "red" }}>{formState?.error}</span> :  null )}
            </form>
    )
}

export default SubmitRun