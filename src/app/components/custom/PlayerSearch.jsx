"use client"
import { useEffect, useState, useRef } from 'react'
import { useFormState } from 'react-dom'
import { handlePlayerSearch } from '../../../utility_functions'
import Button from '../shared/Button'
import Table from '../shared/Table'
import ReCAPTCHA from 'react-google-recaptcha'
import ContentHeader from '../shared/ContentHeader'
const PlayerSearch = () => {
    const recaptcha = useRef()
    const [formData, setFormData] = useState()
    const [formState, formAction] = useFormState(handlePlayerSearch, null)

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

    const resetFormState = () => {
        if (formData && formData.data) {
            setFormData(undefined)
        }
    }

    useEffect(() => {
        if (formState && formState.data) {
            setFormData(formState)
        }
    }, [formState])

    return (
            (formData && formData.data[0] && formState.records) ? 
                <>
                    <Button onClick={resetFormState} style={{ backgroundColor: "red", color: "white" }}>New Search</Button>
                    <Table data={formState.data} rowHeaders={["#", "Player", "Elo", "Games", "Games Won", "Average Score", "Average Place"]}/>
                    <h2>Recent Tournaments</h2>
                    { formState?.records.length !== 0 ?
                        <Table data={formState.records} rowHeaders={["#", "name", "place", "score", "change"]}/> 
                         :
                        <b>no tournaments found</b>
                    }
                </>
            : 
            <form onSubmit={setRecaptchaToken}>
                <input type='text' name='search' placeholder='Enter full name or Discord id' required></input><br />
                <input type="submit" className="btn" name="submit-btn" value="Submit" style={{ width: "100%" }} />
                <ReCAPTCHA ref={recaptcha} sitekey='6Leu4_UUAAAAAEmRqjfo2-g9z75Jc8JHAi7_D-LG' size='invisible'></ReCAPTCHA>
                {(formState?.error ? <span style={{ color: "red" }}>{formState?.error}</span> : null)}
            </form>
    )
}

export default PlayerSearch