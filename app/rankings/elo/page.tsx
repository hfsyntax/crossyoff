import type { RowList, Row } from "postgres"
import Table from "@/components/Table"
import PlayerLookupHandler from "@/components/PlayerLookupHandler"
import sql from "@/sql"

export const metadata = {
  title: "Elo Rankings",
  description: "Lists the CrossyOff top players by elo.",
}

async function getAllPlayerElo(
  search: string = "",
): Promise<RowList<Row[]> | never[]> {
  const queryResult =
    await sql`SELECT rank, flag, name AS player_name, elo, games, id FROM crossy_road_elo_rankings WHERE name ILIKE '%' || ${search} || '%' ORDER BY rank ASC`.catch(
      (error) => {
        console.error(error)
        return null
      },
    )
  return queryResult ?? []
}

export default async function Elo(props: {
  searchParams?: Promise<{
    search?: string
  }>
}) {
  const searchParams = await props.searchParams
  const players = await getAllPlayerElo(searchParams?.search)
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
