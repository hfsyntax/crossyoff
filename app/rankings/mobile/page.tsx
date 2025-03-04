import { getPlatformTopPlayers } from "@/actions"
import Link from "next/link"
import Table from "@/components/Table"

export const metadata = {
  title: "Mobile Rankings",
  description: "Lists the Crossy Road top highscores for mobile.",
}

export default async function Mobile(): Promise<JSX.Element> {
  const players = await getPlatformTopPlayers("mobile")
  return (
    <div className="relative left-0 mt-[150px] flex h-0 w-full flex-grow transform-none select-none flex-col overflow-auto font-sans xl:left-1/2 xl:w-[1200px] xl:-translate-x-1/2">
      <h1 className="mb-3 ml-1 mt-3 text-2xl sm:text-3xl xl:ml-0 xl:text-[32px]">
        CrossyOff Mobile Rankings
      </h1>
      {players.length === 0 ? (
        <b className="text-red-500">Failed to get mobile rankings</b>
      ) : (
        <>
          <Link
            href={"/submit_run"}
            className="relative ml-1 w-fit border-none bg-red-500 pb-2 pl-4 pr-4 pt-2 text-white no-underline duration-500 ease-in-out hover:rounded-xl hover:bg-slate-100 hover:text-red-500 md:pb-3 md:pl-5 md:pr-5 md:pt-3 lg:pb-4 lg:pl-9 lg:pr-9 lg:pt-4 xl:ml-0"
          >
            Submit Run
          </Link>
          <Table
            data={[{ ...players[0] }, ...players]}
            columns={["#", "Player", "Score", "Date", "Titles", "Video"]}
          />
        </>
      )}
    </div>
  )
}
