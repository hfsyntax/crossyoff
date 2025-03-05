import { handlePlayerSearch } from "@/actions"
import Table from "@/components/Table"

export const metadata = {
  title: "Player Lookup",
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
