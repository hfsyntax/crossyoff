import { getPlatformTopPlayers } from "@/actions"
import Link from "next/link"
import Table from "@/components/Table"

export const metadata = {
  title: "PC Rankings",
  description: "Lists the Crossy Road top highscores for pc.",
}

export default async function PC(): Promise<JSX.Element> {
  const players = await getPlatformTopPlayers("PC")
  return (
    <div className="relative left-0 mt-[150px] flex w-full transform-none select-none flex-col overflow-auto font-sans xl:left-1/2 xl:w-[1200px] xl:-translate-x-1/2">
      <h1 className="mb-3 mt-3 text-[32px]">CrossyOff PC Rankings</h1>
      {players.length === 0 ? (
        <b style={{ color: "red" }}>Failed to get PC rankings</b>
      ) : (
        <>
          <Link
            href={"/submit_run"}
            className="relative w-fit border-none bg-red-500 pb-5 pl-10 pr-10 pt-5 text-white no-underline duration-500 ease-in-out hover:rounded-xl"
          >
            Submit Run
          </Link>
          <Table
            rowHeaders={["#", "Player", "Score", "Date", "Titles", "Video"]}
            data={players}
          />
        </>
      )}
    </div>
  )
}
