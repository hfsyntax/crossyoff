import { getPlatformTopPlayers } from "@/actions";
import Link from "next/link";
import Table from "@/components/Table";

export const metadata = {
    title: "PC Rankings",
    description: "Lists the Crossy Road top highscores for pc.",
};

export const revalidate = 86400

export default async function PC(): Promise<JSX.Element> {
    const players = await getPlatformTopPlayers("PC")
    return (
        <div id="content" className="column no-height">
            <h1>CrossyOff PC Rankings</h1>
            {players.length === 0 ?
                <b style={{ color: "red" }}>Failed to get PC rankings</b> :
                <>
                    <Link href={"/submit_run"} className="btn" style={{ backgroundColor: "red", color: "white" }}>
                        Submit Run
                    </Link>
                    <Table
                        rowHeaders={["#", "Player", "Score", "Date", "Titles", "Video"]}
                        data={players}
                    />
                </>
            }
        </div>
    )
}