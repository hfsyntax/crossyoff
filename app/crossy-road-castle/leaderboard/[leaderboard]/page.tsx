import type { CastlePlayer } from "@/types"
import { getSession } from "@/lib/session"
import supabase from "@/lib/supabase"
import EditableTable from "@/components/EditableTable"
import LeaderboardDropdown from "@/components/LeaderboardDropdown"
import FixedTable from "@/components/Table"
import { cacheTag } from "next/dist/server/use-cache/cache-tag"
import Table from "@/components/Table"
import PlayerLookupHandler from "@/components/PlayerLookupHandler"

export const metadata = {
  title: "CRC Leaderboard",
}

async function getTableData(leaderboard: string) {
  "use cache"
  cacheTag(`crossy_road_castle_leaderboard_${leaderboard}`)
  const { data: tableData, error: tableDataError } = await supabase.rpc(
    "get_leaderboard_rows",
    { leaderboard_name: leaderboard },
  )

  if (tableDataError) console.error(tableDataError)

  return {
    data: tableDataError ? null : (tableData as Array<CastlePlayer>),
    lastRevalidated: Date.now(),
  }
}

async function getTables() {
  "use cache"
  cacheTag(`crossy_road_castle_leaderboards`)
  const { data: tables, error } = await supabase
    .from("crossy_road_castle_tables")
    .select("table_name")
    .order("created_at", { ascending: false })

  if (error) console.error(error)

  return {
    data: error ? null : tables,
    lastRevalidated: Date.now(),
  }
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ leaderboard: string }>
  searchParams?: Promise<{
    search?: string
  }>
}) {
  const { leaderboard } = await params
  const search = await searchParams
  const query = search?.search

  const tableData = await getTableData(leaderboard)

  const tables = await getTables()

  const session = await getSession()

  const filtered =
    query && tableData.data
      ? tableData.data.filter((d) =>
          d.username.toLocaleLowerCase().includes(query.toLowerCase()),
        )
      : []

  return (
    <div className="relative left-0 mb-3 mt-[150px] flex h-[calc(100vh_-150px_-12px-_56px_)] w-full transform-none select-none flex-col font-sans md:h-[calc(100vh_-150px_-12px-_52px_)] xl:left-1/2 xl:w-[1200px] xl:-translate-x-1/2">
      <h1 className="mb-3 ml-1 mt-3 text-xl sm:text-2xl lg:text-3xl xl:ml-0">
        Crossy Road Castle - {leaderboard} Leaderboard
      </h1>
      {(!tableData.data || !tables.data) && (
        <span className="text-red-500">Internal server error</span>
      )}
      {tables.data && tables.data?.length > 0 && (
        <LeaderboardDropdown tables={tables.data} currentTable={leaderboard} />
      )}

      {tableData.data && tableData.data?.length > 0 ? (
        tableData.data[0]?.row_id ? (
          session ? (
            <EditableTable
              data={
                query
                  ? [{ ...filtered[0] }, ...filtered]
                  : [{ ...tableData.data[0] }, ...tableData.data]
              }
              columns={["rank", "player", "points"]}
              tableEmpty={false}
            />
          ) : (
            <>
              <PlayerLookupHandler />
              {!query ? (
                <FixedTable
                  data={[{ ...tableData.data[0] }, ...tableData.data]}
                  columns={["rank", "player", "points"]}
                />
              ) : filtered.length > 0 ? (
                <FixedTable
                  data={[{ ...filtered[0] }, ...filtered]}
                  columns={["rank", "player", "points"]}
                />
              ) : (
                <span className="ml-1 mt-3 font-bold text-red-500 xl:ml-0">
                  No results
                </span>
              )}
            </>
          )
        ) : session ? (
          <EditableTable
            data={tableData.data}
            columns={["rank", "player", "points"]}
            tableEmpty={true}
          />
        ) : (
          <Table data={tableData.data} columns={["rank", "player", "points"]} />
        )
      ) : tableData.data && session ? (
        <EditableTable
          data={tableData.data}
          columns={["rank", "player", "points"]}
          tableEmpty={true}
        />
      ) : (
        tableData.data && (
          <Table data={tableData.data} columns={["rank", "player", "points"]} />
        )
      )}
    </div>
  )
}
