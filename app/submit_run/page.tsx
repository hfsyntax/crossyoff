import SubmitRunHandler from "@/components/SubmitRunHandler"

export const metadata = {
  title: "Submit Run",
}

export default function SubmitRun(): JSX.Element {
  return (
    <div className="relative left-0 mt-[150px] flex h-[500px] w-full transform-none select-none flex-col overflow-y-auto overflow-x-hidden font-sans xl:left-1/2 xl:w-[1200px] xl:-translate-x-1/2">
      <h1>CrossyOff Submit Run</h1>
      <SubmitRunHandler />
    </div>
  )
}
