import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { compare } from "bcryptjs"

export async function GET() {
    return NextResponse.json({ error: "405 Method Not Allowed" }, { status: 405 })
}

export async function POST(request: NextRequest) {
    const jsonBody = await request.json()
    const token = jsonBody?.token
    const correctTokenHash = String(process.env?.APP_CACHE_HASHKEY)
    
    if (!token) {
        return NextResponse.json({ error: "Error: missing authentication token in request body" }, { status: 400 })
    }

    const correctToken = await compare(String(token), correctTokenHash)

    if (correctToken) {
        revalidatePath("/")
        revalidatePath("/rankings/elo")
        revalidatePath("/rankings/mobile")
        revalidatePath("/rankings/pc")
        revalidatePath("/schedule")
        revalidatePath("/rules/lcs")
        revalidatePath("/rules/koc")
        revalidatePath("/rules/worlds")
        revalidatePath("/rules/challenges")
        return NextResponse.json({ message: "successfully revalidated server cache" }, { status: 200 })
    } 

    return NextResponse.json({ error: "Error: unauthorized" }, { status: 401 })
}