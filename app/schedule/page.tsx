import { getAllTournaments } from "@/actions"
import Table from "@/components/Table"

export const metadata = {
  title: "Schedule",
  description: "Displays the CrossyOff tournament schedule.",
}

export default async function Schedule(): Promise<JSX.Element> {
  const tournaments = await getAllTournaments()

  return (
    <div className="relative left-0 mb-3 mt-[150px] flex h-0 w-full flex-grow transform-none select-none flex-col overflow-auto font-sans xl:left-1/2 xl:w-[1200px] xl:-translate-x-1/2">
      <h1 className="mb-3 mt-3 text-[32px]">CrossyOff Tournament Schedule</h1>
      {tournaments.length === 0 ? (
        <b style={{ color: "red" }}>Failed to get tournaments</b>
      ) : (
        <Table
          rowHeaders={["#", "date", "Name", "Status", "Winner", "Bracket"]}
          data={tournaments}
        ></Table>
      )}
    </div>
  )
}
