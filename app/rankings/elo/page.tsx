import { getAllPlayerElo } from "@/actions"
import Link from "next/link"
import Table from "@/components/Table"

export const metadata = {
  title: "Elo Rankings",
  description: "Lists the CrossyOff top players by elo.",
}

export default async function Elo(): Promise<JSX.Element> {
  const players = await getAllPlayerElo()
  return (
    <div className="relative left-0 mb-3 mt-[150px] flex h-0 w-full flex-grow transform-none select-none flex-col overflow-auto font-sans xl:left-1/2 xl:w-[1200px] xl:-translate-x-1/2">
      <h1 className="mb-3 mt-3 text-[32px]">CrossyOff Elo Rankings</h1>
      {players.length === 0 ? (
        <b style={{ color: "red" }}>Failed to get elo rankings</b>
      ) : (
        <>
          <Link
            href={"/player_lookup"}
            className="relative w-fit border-none bg-red-500 pb-5 pl-10 pr-10 pt-5 text-white no-underline duration-500 ease-in-out hover:rounded-xl"
          >
            Player Lookup
          </Link>
          <Table rowHeaders={["#", "Player", "Elo", "Games"]} data={players} />
        </>
      )}
    </div>
  )
}
