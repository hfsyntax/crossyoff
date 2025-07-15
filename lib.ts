import type { RowList, Row } from "postgres"
import sql from "./sql"

export async function getPlatformTopPlayers(
  platform: "PC" | "mobile",
): Promise<RowList<Row[]> | never[]> {
  const queryResult =
    await sql`SELECT rank, flag, name, score, date, titles, video_url, id FROM crossy_road_records WHERE platform = ${platform} ORDER BY rank ASC`.catch(
      (error) => {
        console.error(error)
        return null
      },
    )
  return queryResult ?? []
}
