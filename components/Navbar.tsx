import { getSession } from "@/lib/session"
import ClientNavbar from "./ClientNavbar"
import { unstable_cacheTag as cacheTag } from "next/cache"
import supabase from "@/lib/supabase"

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

export default async function Navbar() {
  const session = await getSession()
  const latestCRCTable = await getLatestCRCTableName()
  return (
    <ClientNavbar
      avatar={session?.user?.avatarURL}
      latestTable={latestCRCTable}
    />
  )
}
