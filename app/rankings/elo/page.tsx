import { getAllPlayerElo } from "@/actions"
import Table from "@/components/Table"
import PlayerLookupHandler from "@/components/PlayerLookupHandler"

export const metadata = {
  title: "Elo Rankings",
  description: "Lists the CrossyOff top players by elo.",
}

export default async function Elo({
  searchParams,
}: {
  searchParams?: {
    search?: string
  }
}) {
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
