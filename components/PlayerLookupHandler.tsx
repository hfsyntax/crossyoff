"use client"
import { useEffect, useState, useRef, FormEvent } from "react"
import { useFormState } from "react-dom"
import { handlePlayerSearch, PlayerSearchResult } from "@/actions"
import Table from "./Table"
import ReCAPTCHA from "react-google-recaptcha"

export default function PlayerLookupHandler(): JSX.Element {
  const recaptcha = useRef<ReCAPTCHA | null>(null)
  const [formState, setFormState] = useState({
    dataReceived: false,
    disabled: false,
    text: "Submit",
  })

  const [formResponse, formAction] = useFormState<
    PlayerSearchResult | null,
    FormData
  >(handlePlayerSearch, null)

  const setRecaptchaToken = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await recaptcha?.current?.executeAsync()
    const formElement = event.target as HTMLFormElement
    const formData = new FormData(formElement)
    formAction(formData)
    setFormState({
      ...formState,
      disabled: true,
      text: "Loading...",
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

  return formState?.dataReceived ? (
    <>
      <button
        onClick={resetFormState}
        className="relative w-fit border-none bg-red-500 pb-5 pl-10 pr-10 pt-5 text-white no-underline duration-500 ease-in-out hover:rounded-xl"
      >
        New Search
      </button>
      {formResponse?.data && (
        <Table
          data={formResponse.data}
          rowHeaders={[
            "#",
            "Player",
            "Elo",
            "Games",
            "Games Won",
            "Average Score",
            "Average Place",
          ]}
        />
      )}
      <h2>Recent Tournaments</h2>
      {formResponse?.records && formResponse?.records?.length > 0 ? (
        <Table
          data={formResponse?.records}
          rowHeaders={["#", "name", "place", "score", "change"]}
        />
      ) : (
        <b>no tournaments found</b>
      )}
    </>
  ) : (
    <form onSubmit={setRecaptchaToken}>
      <input
        type="text"
        name="search"
        placeholder="Enter full name or Discord id"
        required
        className="mb-2 ml-1 mr-1 box-border h-10 w-[300px] border border-black pb-0 pl-5 pr-5 pt-0 outline-none focus:border-red-500 sm:w-[350px] xl:ml-0 xl:mr-0 xl:w-[400px]"
      ></input>
      <br />
      <input
        type="submit"
        className="relative ml-1 w-fit border-none bg-red-500 pb-2 pl-4 pr-4 pt-2 text-white no-underline hover:rounded-xl hover:bg-slate-100 hover:text-red-500 enabled:cursor-pointer enabled:duration-500 enabled:ease-in-out md:pb-3 md:pl-5 md:pr-5 md:pt-3 lg:pb-4 lg:pl-9 lg:pr-9 lg:pt-4 xl:ml-0"
        name="submit-btn"
        value={formState.text}
        disabled={formState.disabled}
      />
      <ReCAPTCHA
        ref={recaptcha}
        sitekey="6Leu4_UUAAAAAEmRqjfo2-g9z75Jc8JHAi7_D-LG"
        size="invisible"
      />
      {formResponse?.error && (
        <span className="font-bold text-red-500">{formResponse.error}</span>
      )}
    </form>
  )
}
