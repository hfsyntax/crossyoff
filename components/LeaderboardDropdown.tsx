"use client"
import type { ChangeEvent } from "react"
import { useRouter } from "next/navigation"

export default function LeaderboardDropdown({
  tables,
  currentTable,
}: {
  tables: {
    table_name: string
  }[]
  currentTable: string
}) {
  const router = useRouter()

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) =>
    router.push(`/crossy-road-castle/leaderboard/${event.target.value}`)

  return (
    <div className="mb-3 flex items-center gap-2 text-sm sm:text-base md:text-lg lg:text-xl">
      <span className="pl-1 font-bold">Select Leaderboard</span>
      <select
        value={
          tables.some((t) => t.table_name === currentTable)
            ? currentTable
            : "select_leaderboard"
        }
        className="mr-5 box-border flex-[1] border border-black sm:mr-40"
        name={`select_crossy_road_castle_leaderboard`}
        onChange={handleSelectChange}
      >
        <option value="select_leaderboard" disabled>
          Select a Leaderboard
        </option>
        {tables.map((table) => (
          <option
            key={`crossy_road_castle_leaderboard_${table.table_name}`}
            value={table.table_name}
          >
            {table.table_name}
          </option>
        ))}
      </select>
    </div>
  )
}
