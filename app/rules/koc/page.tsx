export const metadata = {
  title: "KOC Rules",
  description: "Lists the CrossyOff tournament rules for King of Cross.",
}

export default function Koc(): JSX.Element {
  return (
    <div className="relative left-0 mt-[150px] flex w-full flex-[1] transform-none select-none flex-col overflow-auto font-sans xl:left-1/2 xl:w-[1200px] xl:-translate-x-1/2">
      <h1 className="mb-3 ml-1 mt-3 text-2xl sm:text-3xl xl:ml-0 xl:text-[32px]">
        King of Cross Rules
      </h1>
      <h2 className="mb-4 ml-1 mt-4 text-2xl xl:ml-0">1. Matchmaking</h2>
      <p className="relative mb-4 mt-4 box-border max-w-[1200px] border-l-[3px] border-red-500 bg-[#d3d3d3] pb-[30px] pl-[30px] pr-[50px] pt-[30px] text-black">
        Players will be ranked based on ELO, which is a rating system measuring
        a players skill level. By default a player starts off with 1200 ELO and
        can gain or lose ELO based on their tournament performances. Each player
        has 3 attempts to get the highest score possible (number of forward
        hops). Players also have a maximum of 5 minutes to break between
        attempts. If a player exceeds the break time they will lose an attempt
        every 5 minutes exceeded. If both players in a round don't play, the
        player with the higher ELO advances.
      </p>
      <h2 className="mb-4 ml-1 mt-4 text-2xl xl:ml-0">2. Moderation</h2>
      <p className="relative mb-4 mt-4 box-border max-w-[1200px] border-l-[3px] border-red-500 bg-[#d3d3d3] pb-[30px] pl-[30px] pr-[50px] pt-[30px] text-black">
        A Referee must be present to monitor each match. Referees participating
        in tournaments agree to advise each players match without bias and are
        not allowed to referee their own runs. Referees decide whether a player
        wins, loses or is disqualified. Players who are unsatisfied with the
        Referees decision must appeal to an Admin of the Discord Server. Admins
        have 24 hours to respond to the issue. If no response is given, the
        Referees decision is final.
      </p>
      <h2 className="mb-4 ml-1 mt-4 text-2xl xl:ml-0">
        3. Platforms/Fair Play
      </h2>
      <p className="relative mb-4 mt-4 box-border max-w-[1200px] border-l-[3px] border-red-500 bg-[#d3d3d3] pb-[30px] pl-[30px] pr-[50px] pt-[30px] text-black">
        Each player agrees to use either the Crossy Road Application on the
        Windows Store or iOS/Android stable. Third party clients/software such
        as POKI are prohibited! A player must play at fullscreen using only the
        original characters, is not allowed to pause the game at any time
        (whether intentional or unintentional the player will lose an attempt)
        or bind/map keys. The maximum resolution a player is allowed to use is
        1920x1080. If the game crashes the player is allowed to restart the
        attempt but without any break. Preventable bugs/glitches that cause a
        player to die do not validate a restart.
        <b>
          If a stream crashes the player is allowed the option to restart the
          attempt. The second time the stream crashes the run is considered
          dead.
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
        the same after a match. When a tie occurs, both players will have one
        attempt to get the highest score possible, disregarding any previous
        runs scores. The player with the higher score wins.
      </p>
    </div>
  )
}
