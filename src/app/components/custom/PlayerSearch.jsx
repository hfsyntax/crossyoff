"use client"
import { useEffect, useState, useRef } from 'react'
import { useFormState } from 'react-dom'
import { handlePlayerSearch } from '../../../utility_functions'
import Button from '../shared/Button'
import Table from '../shared/Table'
import ReCAPTCHA from 'react-google-recaptcha'
const PlayerSearch = () => {
    const recaptcha = useRef()
    const [formState, setFormState] = useState({
        dataReceived: false,
        disabled: false,
        text: "Submit"
    })
    const [formResponse, formAction] = useFormState(handlePlayerSearch, null) 

    const setRecaptchaToken = async (event) => {
        try {
            event.preventDefault()
            await recaptcha.current.executeAsync()
            const formData = new FormData(event.target)
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

    const resetFormState = () => {
        if (formState.dataReceived) {
            setFormState({dataReceived: false, disabled: false, text: "Submit"})
        }
    }

    useEffect(() => {
        if (formResponse?.data && formResponse?.records) {
            setFormState({...formState, dataReceived: true})
        } else {
            setFormState({disabled: false, text: "Submit", dataReceived: false})
        }
    }, [formResponse])

    return (
            (formState?.dataReceived) ? 
                <>
                    <Button onClick={resetFormState} style={{ backgroundColor: "red", color: "white" }}>New Search</Button>
                    <Table data={formResponse.data} rowHeaders={["#", "Player", "Elo", "Games", "Games Won", "Average Score", "Average Place"]}/>
                    <h2>Recent Tournaments</h2>
                    { formResponse?.records.length !== 0 ?
                        <Table data={formResponse.records} rowHeaders={["#", "name", "place", "score", "change"]}/> 
                         :
                        <b>no tournaments found</b>
                    }
                </>
            : 
            <form onSubmit={setRecaptchaToken}>
                <input type='text' name='search' placeholder='Enter full name or Discord id' required></input><br />
                <input type="submit" className="btn" name="submit-btn" value={formState.text} style={{ width: "100%" }} disabled={formState.disabled}/>
                <ReCAPTCHA ref={recaptcha} sitekey='6Leu4_UUAAAAAEmRqjfo2-g9z75Jc8JHAi7_D-LG' size='invisible'></ReCAPTCHA>
                {formResponse?.error && <span style={{ color: "red" }}>{formResponse.error}</span>}
            </form>
    )
}

export default PlayerSearch
