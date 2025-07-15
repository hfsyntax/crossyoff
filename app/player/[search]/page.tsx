"use cache"

import type { PlayerSearchResult } from "@/types"
import type { RowList, Row } from "postgres"
import Table from "@/components/Table"
import sql from "@/sql"

export const metadata = {
  title: "Player Lookup",
}

async function getPlayerElo(id: string): Promise<RowList<Row[]> | never[]> {
  const queryResult =
    await sql`SELECT id, rank, flag, name, elo, games, won FROM crossy_road_elo_rankings WHERE id = ${id}`.catch(
      (error) => {
        console.error(error)
        return null
      },
    )

  return queryResult ?? []
}

async function getPlayerTournaments(
  id: number | string,
): Promise<RowList<Row[]> | never[]> {
  const queryResult =
    await sql`SELECT tournaments, tournament AS name, place, score, change, img AS tournament_logo  FROM crossy_road_games WHERE id = ${id} ORDER BY tournaments DESC`.catch(
      (error) => {
        console.error(error)
        return null
      },
    )
  return queryResult ?? []
}

async function getPlayerChallenges(
  id: number | string,
): Promise<RowList<Row[]> | never[]> {
  const queryResult = await sql`SELECT
        challenge_id,
        CASE
            WHEN challenger_id = ${id} THEN challenger_id
            WHEN opponent_id = ${id} THEN opponent_id
        END AS player_id,
        CASE
            WHEN challenger_id = ${id} THEN challenger_score
            WHEN opponent_id = ${id} THEN opponent_score
        END AS player_score
        FROM
            crossy_road_challenges
        WHERE
            challenger_id = ${id} OR opponent_id = ${id}`.catch((error) => {
    console.error(error)
    return null
  })
  return queryResult ?? []
}

async function handlePlayerSearch(id: string): Promise<PlayerSearchResult> {
  if (!id || id.length > 20 || isNaN(parseInt(id))) {
    return { error: "player not found" }
  }

  const playerSearch = await getPlayerElo(id)

  if (playerSearch.length === 0) return { error: "no results" }

  // get tournaments
  const playerTournaments = await getPlayerTournaments(playerSearch?.[0]?.id)

  // get challenges
  const playerChallenges = await getPlayerChallenges(playerSearch?.[0]?.id)

  // calculate average score and place
  let totalPlace = 0
  let totalScore = 0
  let totalTournaments = 0
  let totalChallenges = 0

  for (let tournament of playerTournaments) {
    const tournamentName = tournament["name"]
    if (
      !tournamentName.includes("Worlds") &&
      tournamentName !== "King of Cross #1"
    ) {
      const tournamentPlace = tournament["place"]
      const tournamentScore = tournament["score"]
      totalPlace += tournamentPlace
      totalScore += tournamentScore
      totalTournaments++
    }
  }

  for (let challenge of playerChallenges) {
    totalScore += challenge["player_score"]
    totalChallenges++
  }

  const averageScore = Math.round(
    totalScore / (totalTournaments + totalChallenges),
  )
  // max in the case of a player who played challenges but no tournaments
  const averagePlace = Math.round(totalPlace / Math.max(totalTournaments, 1))
  playerSearch[0].averageScore = averageScore
  playerSearch[0].averagePlace = averagePlace
  return { data: playerSearch, records: playerTournaments }
}

export default async function Page({
  params,
}: {
  params: Promise<{ search: string }>
}) {
  const { search } = await params
  const playerSearch = await handlePlayerSearch(search)
  // min height for container is 100vh - top margin (150px) - bottom margin (12px) - footer height
  return (
    <div className="relative left-0 mb-3 mt-[150px] flex h-[calc(100vh_-150px_-12px-_56px_)] w-full transform-none select-none flex-col overflow-y-auto overflow-x-hidden font-sans md:h-[calc(100vh_-150px_-12px-_52px_)] xl:left-1/2 xl:w-[1200px] xl:-translate-x-1/2">
      <h1 className="mb-3 ml-1 mt-3 text-2xl sm:text-3xl xl:ml-0 xl:text-[32px]">
        CrossyOff Player Lookup
      </h1>
      {playerSearch.data && (
        <Table
          data={[{ ...playerSearch.data[0] }, ...playerSearch.data]}
          columns={[
            "#",
            "Player",
            "Elo",
            "Games",
            "Won",
            "Avg. Score",
            "Avg. Place",
          ]}
          height={100}
        />
      )}
      {playerSearch.records &&
        (playerSearch.records.length > 0 ? (
          <>
            <h2 className="ml-1 mt-5 text-base sm:text-xl md:text-2xl xl:ml-0">
              Recent Tournaments
            </h2>
            <Table
              data={[{ ...playerSearch.records[0] }, ...playerSearch.records]}
              columns={["#", "Name", "place", "score", "change"]}
              height={0}
              grow
            />
          </>
        ) : (
          <b>no tournaments found</b>
        ))}
      {playerSearch.error && (
        <span className="text-red-500">{playerSearch.error}</span>
      )}
    </div>
  )
}
