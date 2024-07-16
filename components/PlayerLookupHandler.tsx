"use client"
import { useEffect, useState, useRef, FormEvent } from 'react'
import { useFormState } from 'react-dom'
import { handlePlayerSearch, PlayerSearchResult } from '@/actions'
import Table from './Table'
import ReCAPTCHA from "react-google-recaptcha"

export default function PlayerLookupHandler(): JSX.Element {
    const recaptcha = useRef<ReCAPTCHA | null>(null)
    const [formState, setFormState] = useState({
        dataReceived: false,
        disabled: false,
        text: "Submit"
    })

    const [formResponse, formAction] = useFormState<PlayerSearchResult | null, FormData>(handlePlayerSearch, null)

    const setRecaptchaToken = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        await recaptcha?.current?.executeAsync()
        const formElement = event.target as HTMLFormElement
        const formData = new FormData(formElement)
        formAction(formData)
        setFormState({
            ...formState,
            disabled: true,
            text: "Loading..."
        })
    }

    const resetFormState = () => {
        if (formState.dataReceived)
            setFormState({ dataReceived: false, disabled: false, text: "Submit" })
    }

    useEffect(() => {
        if (formResponse?.data && formResponse?.records) {
            setFormState({ ...formState, dataReceived: true })
        } else {
            setFormState({ disabled: false, text: "Submit", dataReceived: false })
        }
    }, [formResponse])

    return (
        (formState?.dataReceived) ?
            <>
                <button onClick={resetFormState} className="btn" style={{ backgroundColor: "red", color: "white" }}>
                    New Search
                </button>
                {formResponse?.data && <Table
                data={formResponse.data }
                rowHeaders={["#", "Player", "Elo", "Games", "Games Won", "Average Score", "Average Place"]} 
                />}
                <h2>Recent Tournaments</h2>
                {formResponse?.records && formResponse?.records?.length > 0 ?
                    <Table data={formResponse?.records} rowHeaders={["#", "name", "place", "score", "change"]} /> :
                    <b>no tournaments found</b>
                }
            </>
            :
            <form onSubmit={setRecaptchaToken}>
                <input type='text' name='search' placeholder='Enter full name or Discord id' required></input><br />
                <input type="submit" className="btn" name="submit-btn" value={formState.text} style={{ width: "100%" }} disabled={formState.disabled} />
                <ReCAPTCHA ref={recaptcha} sitekey='6Leu4_UUAAAAAEmRqjfo2-g9z75Jc8JHAi7_D-LG' size='invisible' />
                {formResponse?.error && <span style={{ color: "red" }}>{formResponse.error}</span>}
            </form>
    )
}