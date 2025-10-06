import CreateTableButton from "@/components/CreateTableButton"

export const metadata = {
  title: "CRC Create Table",
}

export default async function Page() {
  // min height for container is 100vh - top margin (150px) - bottom margin (12px) - footer height
  return (
    <div className="relative left-0 mb-3 mt-[150px] flex h-[calc(100vh_-150px_-12px-_56px_)] w-full transform-none select-none flex-col overflow-y-auto overflow-x-hidden pl-3 pr-3 font-sans md:h-[calc(100vh_-150px_-12px-_52px_)] xl:left-1/2 xl:w-[1200px] xl:-translate-x-1/2">
      <CreateTableButton />
      <span className="mt-2 text-xs italic sm:text-sm md:text-base lg:text-lg">
        No Crossy Road Castle leaderboards have been created yet.
      </span>
    </div>
  )
}
