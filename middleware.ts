import { NextRequest, NextResponse } from "next/server"
import { updateSession, getSession } from "./lib/session"
import { unstable_cacheTag as cacheTag } from "next/cache"
import supabase from "./lib/supabase"

export const config = {
  matcher:
    "/((?!api|_next/static|_next/image|favicon.ico|static-assets|img).*)",
}

async function getLatestCRCTableName(): Promise<string | null> {
  "use cache"
  cacheTag("crossy_road_castle_leaderboards")

  const { data, error } = await supabase
    .from("crossy_road_castle_tables")
    .select("table_name")
    .order("created_at", { ascending: false })
    .maybeSingle()

  if (error) {
    console.error(error)
    return null
  }

  return data?.table_name ?? null
}

export async function middleware(request: NextRequest) {
  console.log(`path is ${request.nextUrl.pathname}`)
  const response = await updateSession(request)
  const session = await getSession()
  if (session && request.nextUrl.pathname === "/login")
    return NextResponse.redirect(new URL("/crossy-road-castle", request.url))
  else if (!session && request.nextUrl.pathname === "/crossy-road-castle") {
    if (!session) return NextResponse.redirect(new URL("/", request.url))
    const latestCRCTable = await getLatestCRCTableName()
    if (latestCRCTable)
      return NextResponse.redirect(
        new URL(
          `/crossy-road-castle/leaderboard/${latestCRCTable}`,
          request.url,
        ),
      )
  } else return response ?? NextResponse.next()
}
