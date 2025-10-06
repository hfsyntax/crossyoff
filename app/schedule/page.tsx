"use cache"

import type { Schedule } from "@/types"
import Table from "@/components/Table"
import supabase from "@/lib/supabase"

export const metadata = {
  title: "Schedule",
  description: "Displays the CrossyOff tournament schedule.",
}

async function getAllTournaments(): Promise<Schedule[]> {
  const { data, error } = await supabase
    .from("crossy_road_tournaments")
    .select(
      "tournament_number, date, tournament_logo, name, status, winner_country, winner, bracket_url, bracket_url2",
    )
    .order("tournament_number", { ascending: false })

  if (error) {
    console.error(error)
    return []
  }

  return data
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
