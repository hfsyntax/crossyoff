import { getAllTournaments } from "@/actions";
import Table from "@/components/Table";

export const metadata = {
  title: "Schedule",
  description: "Displays the CrossyOff tournament schedule.",
};

export const revalidate = 86400

export default async function Schedule(): Promise<JSX.Element> {

  const tournaments = await getAllTournaments()

  return (
    <div id="content" className="column">
      <h1>CrossyOff Tournament Schedule</h1>
      {tournaments.length === 0 ?
        <b style={{ color: "red" }}>Failed to get tournaments</b> :
        <Table rowHeaders={["#", "date", "Name", "Status", "Winner", "Bracket"]} data={tournaments}></Table>
      }
    </div>
  )
}