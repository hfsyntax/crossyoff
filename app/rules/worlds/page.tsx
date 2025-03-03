export const metadata = {
  title: "Worlds Rules",
  description: "Lists the CrossyOff tournament rules for Worlds.",
}

export default function Worlds(): JSX.Element {
  return (
    <div className="relative left-0 mt-[150px] flex w-full flex-[1] transform-none select-none flex-col overflow-auto font-sans xl:left-1/2 xl:w-[1200px] xl:-translate-x-1/2">
      <h1 className="mb-3 ml-1 mt-3 text-2xl sm:text-3xl xl:ml-0 xl:text-[32px]">
        CrossyOff Worlds Rules
      </h1>
      <h2 className="mb-4 ml-1 mt-4 text-2xl xl:ml-0">
        1. Qualifying/Matchmaking
      </h2>
      <p className="relative mb-4 mt-4 box-border max-w-[1200px] border-l-[3px] border-red-500 bg-[#d3d3d3] pb-[30px] pl-[30px] pr-[50px] pt-[30px] text-black">
        Players can qualify by having the first or second highest ELO/highscore
        (elo is the primary factor) for their country. Each player has 1 hour to
        get the highest score possible, best 2 of 3 games (number of forward
        hops). Players also have a maximum of 5 minutes to break between games.
        If a player exceeds the break time they will lose an attempt every 5
        minutes exceeded. If both players in a round don't play, the player with
        the higher ELO/highscore advances.
      </p>
      <h2 className="mb-4 ml-1 mt-4 text-2xl xl:ml-0">2. Moderation</h2>
      <p className="relative mb-4 mt-4 box-border max-w-[1200px] border-l-[3px] border-red-500 bg-[#d3d3d3] pb-[30px] pl-[30px] pr-[50px] pt-[30px] text-black">
        <b>A Referee is not required to be present for each match.</b> If a
        Referee is not present both players must save a downloadable copy of
        their stream as evidence of their runs. Referees decide whether a player
        wins, loses or is disqualified (if streams are reviewed). Players who
        are unsatisfied with the Referees decision must appeal to an Admin of
        the Discord Server. Admins have 24 hours to respond to the issue. If no
        response is given, the Referees decision is final.
      </p>
      <h2 className="mb-4 ml-1 mt-4 text-2xl xl:ml-0">
        3. Platforms/Fair Play
      </h2>
      <p className="relative mb-4 mt-4 box-border max-w-[1200px] border-l-[3px] border-red-500 bg-[#d3d3d3] pb-[30px] pl-[30px] pr-[50px] pt-[30px] text-black">
        Each player agrees to use either the Crossy Road Application on the
        Windows Store or iOS/Android stable. Third party clients/software such
        as POKI are prohibited! A player must play at fullscreen using only the
        original characters, is not allowed to pause the game at any time{" "}
        <b>
          (whether intentional or unintentional the score will be the last hop
          completed)
        </b>{" "}
        or bind/map keys. The maximum resolution a player is allowed to use is
        1920x1080.{" "}
        <b>
          If time is up or a stream crashes the Referee will report the last hop
          completed.
        </b>
      </p>
      <h2 className="mb-4 ml-1 mt-4 text-2xl xl:ml-0">
        4. Withdrawl/Play Period
      </h2>
      <p className="relative mb-4 mt-4 box-border max-w-[1200px] border-l-[3px] border-red-500 bg-[#d3d3d3] pb-[30px] pl-[30px] pr-[50px] pt-[30px] text-black">
        Players have the ability to withdrawl themselves from the tournament
        whenever fit, however their funds contributed will be non-refundable and
        their ELO will still be affected.
      </p>
      <h2 className="mb-4 ml-1 mt-4 text-2xl xl:ml-0">5. Ties</h2>
      <p className="relative mb-4 mt-4 box-border max-w-[1200px] border-l-[3px] border-red-500 bg-[#d3d3d3] pb-[30px] pl-[30px] pr-[50px] pt-[30px] text-black">
        Players can only qualify for a tie if both players highest scores are
        the same after a game. When a tie occurs, both players will have one
        attempt to get the highest score possible, disregarding any previous
        runs scores. The player with the higher score wins.
      </p>
    </div>
  )
}
