"use client"
import { createCRCTable } from "@/app/actions"
import {
  FormEvent,
  startTransition,
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react"

export default function CreateTableButton() {
  const currentForm = useRef<HTMLFormElement>(null)
  const [butonClicked, setButtonClicked] = useState<boolean>(false)
  const [error, setError] = useState<string>()
  const [formResponse, formAction, isPending] = useActionState(
    createCRCTable,
    null,
  )

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const tableName = String(formData.get("table_name"))
    if (!tableName) return setError("Table name cannot be empty.")
    if (tableName.length > 50)
      return setError("Table name cannot be more than 50 characters.")
    const noSpecialChars = /^[a-zA-Z0-9]+$/.test(tableName)
    if (!noSpecialChars)
      return setError("Table name can only contain letters and numbers.")
    startTransition(() => formAction(formData))
  }

  useEffect(() => {
    if (formResponse?.error) setError(formResponse.error)
  }, [formResponse])

  useEffect(() => {
    if (error) currentForm.current?.reset()
  }, [error])

  return butonClicked ? (
    <form
      ref={currentForm}
      onSubmit={handleFormSubmit}
      className="flex flex-col gap-2 sm:w-[400px]"
    >
      <label
        className="ml-1 text-sm md:text-base lg:text-lg xl:ml-0"
        htmlFor="table_name"
      >
        Table Name
      </label>
      <input
        type="text"
        id="table_name"
        name="table_name"
        placeholder="Table Name"
        autoComplete="off"
        maxLength={50}
        required
        className="mb-auto mt-auto box-border h-7 w-full border border-black pb-0 pl-5 pr-5 pt-0 outline-none focus:border-red-500 lg:h-10 xl:ml-0 xl:mr-0"
      />
      <input
        type="submit"
        disabled={isPending}
        className={`w-full border-none bg-red-500 p-1 text-xs font-bold text-white duration-500 ease-in-out lg:p-3 lg:text-sm xl:ml-0 xl:mr-0 xl:text-base ${!isPending && "cursor-pointer hover:rounded-xl hover:bg-slate-100 hover:text-red-500"} `}
        value={isPending ? "loading..." : "Create Table"}
      />
      <button
        type="button"
        className={`w-full border-none bg-red-500 p-1 text-xs font-bold text-white duration-500 ease-in-out lg:p-3 lg:text-sm xl:text-base ${!isPending && "cursor-pointer hover:rounded-xl hover:bg-slate-100 hover:text-red-500"} `}
        onClick={() => {
          if (error) setError(undefined)
          setButtonClicked((prev) => !prev)
        }}
      >
        Cancel
      </button>
      {error && <span className="block text-red-500">{error}</span>}
    </form>
  ) : (
    <button
      className={`w-fit cursor-pointer border-none bg-red-500 p-3 text-xs font-bold text-white duration-500 ease-in-out hover:rounded-xl hover:bg-slate-100 hover:text-red-500 lg:text-sm xl:text-base`}
      onClick={() => setButtonClicked((prev) => !prev)}
    >
      Create Table
    </button>
  )
}
