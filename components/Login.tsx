"use client"
import { login } from "@/app/actions"
import {
  type FormEvent,
  startTransition,
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react"
import ReCAPTCHA from "react-google-recaptcha"

export default function Login() {
  const recaptcha = useRef<ReCAPTCHA>(null)
  const currentForm = useRef<HTMLFormElement>(null)
  const [formResponse, formAction, isPending] = useActionState(login, null)
  const [formError, setFormError] = useState<string>()

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const setRecaptchaToken = await recaptcha.current
      ?.executeAsync()
      .catch((error: Error) => {
        console.error(error)
        return null
      })

    if (!setRecaptchaToken) return setFormError("Internal server error")

    const formData = new FormData(event.target as HTMLFormElement)
    const username = String(formData.get("username")).trim()
    const password = String(formData.get("password")).trim()
    const recaptchaToken = String(formData.get("g-recaptcha-response"))

    if (
      !username ||
      !password ||
      username.length > 32 ||
      password.length > 128 ||
      !recaptchaToken
    )
      return setFormError("username/password is incorrect")

    startTransition(() => formAction(formData))
  }

  useEffect(() => {
    if (formResponse?.error) {
      currentForm.current?.reset()
      setFormError(formResponse.error)
    }
  }, [formResponse])

  if (!process.env.NEXT_PUBLIC_RECAPTCHA_CLIENT_KEY)
    throw new Error("NEXT_PUBLIC_RECAPTCHA_CLIENT_KEY missing!")

  return (
    <form
      ref={currentForm}
      onSubmit={handleLogin}
      className="mb-auto ml-auto mr-auto mt-auto flex w-3/4 flex-col rounded-md bg-slate-300 p-10 sm:w-fit"
    >
      <h1 className="text-center text-2xl sm:text-3xl xl:text-[32px]">Login</h1>
      <label className="mt-4 text-lg" htmlFor="username">
        Username
      </label>
      <input
        type="text"
        id="username"
        name="username"
        placeholder="Username"
        autoComplete="name"
        maxLength={32}
        spellCheck={false}
        required
        className="box-border h-10 w-full border border-black pb-0 pl-5 pr-5 pt-0 outline-none focus:border-red-500 sm:w-[400px]"
      />
      <label className="mt-4 text-lg" htmlFor="password">
        Password
      </label>
      <input
        type="password"
        id="password"
        name="password"
        placeholder="Password"
        autoComplete="current-password"
        required
        className="box-border h-10 w-full border border-black pb-0 pl-5 pr-5 pt-0 outline-none focus:border-red-500 sm:w-[400px]"
      />
      <button
        type="submit"
        disabled={isPending}
        className={`mt-3 border-none bg-red-500 pb-3 pt-3 font-bold text-white duration-500 ease-in-out ${!isPending && "hover:rounded-xl hover:bg-slate-100 hover:text-red-500"} `}
      >
        {isPending ? "loading..." : "Login"}
      </button>
      <ReCAPTCHA
        ref={recaptcha}
        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_CLIENT_KEY}
        size="invisible"
      />
      {formError !== "" && <span className="text-red-500">{formError}</span>}
    </form>
  )
}
