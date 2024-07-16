import PlayerLookupHandler from "@/components/PlayerLookupHandler";

export const metadata = {
  title: "Player Lookup",
};

export default function PlayerLookup(): JSX.Element  {
    return (
    <div id="content" className="column">
      <h1>CrossyOff Player Lookup</h1>
      <PlayerLookupHandler/>
    </div>
  )
}