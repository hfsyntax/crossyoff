import PlayerLookupHandler from "@/components/PlayerLookupHandler"

export const metadata = {
  title: "Player Lookup",
}

export default function PlayerLookup(): JSX.Element {
  return (
    <div className="relative left-0 mt-[150px] flex h-[500px] w-full transform-none select-none flex-col overflow-y-auto overflow-x-hidden font-sans xl:left-1/2 xl:w-[1200px] xl:-translate-x-1/2">
      <h1 className="mb-3 ml-1 mt-3 text-2xl sm:text-3xl xl:ml-0 xl:text-[32px]">
        CrossyOff Player Lookup
      </h1>
      <PlayerLookupHandler />
    </div>
  )
}
