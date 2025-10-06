import type { EloPlayer } from "@/types"
import Table from "@/components/Table"
import PlayerLookupHandler from "@/components/PlayerLookupHandler"
import supabase from "@/lib/supabase"
import { unstable_cacheLife as cacheLife } from "next/cache"

export const metadata = {
  title: "Elo Rankings",
  description: "Lists the CrossyOff top players by elo.",
}

async function getAllPlayerElo(): Promise<Array<EloPlayer>> {
  "use cache"
  cacheLife("weeks")
  const { data, error } = await supabase
    .from("crossy_road_elo_rankings")
    .select("rank, flag, name, elo, games, id")
    .order("rank", { ascending: true })

  if (error) {
    console.error(error)
    return []
  }

  return (data || []).map((row) => ({
    rank: row.rank,
    flag: row.flag,
    player_name: row.name,
    elo: row.elo,
    games: row.games,
    id: row.id,
  }))
}

export default async function Elo(props: {
  searchParams?: Promise<{
    search?: string
  }>
}) {
  const searchParams = await props.searchParams
  let players = await getAllPlayerElo()
  if (searchParams?.search)
    players = players.filter((p) =>
      p.player_name.toLowerCase().includes(searchParams.search!.toLowerCase()),
    )

  return (
    <div className="relative left-0 mb-3 mt-[150px] flex h-0 w-full flex-grow transform-none select-none flex-col font-sans xl:left-1/2 xl:w-[1200px] xl:-translate-x-1/2">
      <h1 className="mb-3 ml-1 mt-3 text-2xl sm:text-3xl xl:ml-0 xl:text-[32px]">
        CrossyOff Elo Rankings
      </h1>
      <PlayerLookupHandler />
      {players.length > 0 ? (
        <Table
          data={[{ ...players[0] }, ...players]}
          columns={["#", "Player", "Elo", "Games"]}
        />
      ) : (
        <span className="ml-1 mt-3 font-bold text-red-500 xl:ml-0">
          No results
        </span>
      )}
    </div>
  )
}
