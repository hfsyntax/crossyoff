"use server"
import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import supabase from "@/lib/supabase"

const secretKey = process.env.SESSION_SECRET_KEY

if (!secretKey)
  throw new Error("SESSION_SECRET_KEY environment variable is not defined!")

const key = new TextEncoder().encode(secretKey)

export async function encrypt(payload: any) {
  try {
    return await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .sign(key)
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function decrypt(input: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ["HS256"],
    })
    return payload
  } catch (error) {
    throw error
  }
}

export async function getSession() {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get("session")?.value
    if (!session) return null

    return await decrypt(session)
  } catch (error) {
    const res = NextResponse.next()
    res.cookies.set({
      name: "session",
      value: "",
      httpOnly: true,
      expires: new Date(0),
    })
    return null
  }
}

export async function updateSession(request: NextRequest) {
  try {
    const session = request.cookies.get("session")?.value
    if (!session) return

    const parsed = await decrypt(session)

    if (!parsed?.user?.username)
      throw new Error("Encrypted session username is not defined!")

    const { data } = await supabase
      .from("users")
      .select("session_token")
      .eq("username", parsed.user.username)
      .maybeSingle()

    if (!data) throw new Error("Session token does not exist for user in db!")

    // Refresh the session so it doesn't expires
    parsed.expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 365 * 10)
    const newEncryptedSession = await encrypt(parsed)

    if (!newEncryptedSession) return

    const res = NextResponse.next()

    res.cookies.set({
      name: "session",
      value: newEncryptedSession,
      httpOnly: true,
      expires: parsed.expires,
    })

    await supabase
      .from("users")
      .update({ session_token: newEncryptedSession })
      .eq("username", parsed.user.username)

    return res
  } catch (error: any) {
    // delete the session cookie
    const res = NextResponse.redirect(new URL("/", request.url))
    res.cookies.set({
      name: "session",
      value: "",
      httpOnly: true,
      expires: new Date(0),
    })
    return res
  }
}
