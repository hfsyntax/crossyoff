import { getAllPlayerElo } from "@/actions";
import Link from "next/link";
import Table from "@/components/Table";

export const metadata = {
    title: "Elo Rankings",
    description: "Lists the CrossyOff top players by elo.",
};

export const revalidate = 1800

export default async function Elo(): Promise<JSX.Element> {
    const players = await getAllPlayerElo()
    return (
        <div id="content" className="column">
            <h1>CrossyOff Elo Rankings</h1>
            {players.length === 0 ?
                <b style={{ color: "red" }}>Failed to get elo rankings</b> :
                <>
                    <Link href={"/player_lookup"} className="btn" style={{ backgroundColor: "red", color: "white" }}>
                        Player Lookup
                    </Link>
                    <Table 
                        rowHeaders={["#", "Player", "Elo", "Games"]}
                        data={players}
                    />
                </>
            }
        </div>
    )
}