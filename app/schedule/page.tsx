"use cache"

import { getAllTournaments } from "@/actions"
import Table from "@/components/Table"

export const metadata = {
  title: "Schedule",
  description: "Displays the CrossyOff tournament schedule.",
}

export default async function Schedule() {
  const tournaments = await getAllTournaments()
  return (
    <div className="relative left-0 mb-3 mt-[150px] flex h-0 w-full flex-grow transform-none select-none flex-col font-sans xl:left-1/2 xl:w-[1200px] xl:-translate-x-1/2">
      <h1 className="mb-3 ml-1 mt-3 text-2xl sm:text-3xl xl:ml-0 xl:text-[32px]">
        CrossyOff Tournament Schedule
      </h1>
      {tournaments.length === 0 ? (
        <b className="text-red-500">Failed to get tournaments</b>
      ) : (
        <Table
          data={[{ ...tournaments[0] }, ...tournaments]}
          columns={["#", "date", "Name", "Status", "Winner", "Bracket"]}
          minWidth={640}
        />
      )}
    </div>
  )
}
