import SubmitRunHandler from "@/components/SubmitRunHandler"

export const metadata = {
  title: "Submit Run",
};

export default function SubmitRun(): JSX.Element {
    return (
    <div id="content" className="column">
      <h1>CrossyOff Submit Run</h1>
      <SubmitRunHandler/>
    </div>
  )
}