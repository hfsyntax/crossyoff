export const metadata = {
  title: "LCS Rules",
  description:
    "Lists the CrossyOff tournament rules for Last Chicken Standing.",
}

export default function Lcs(): JSX.Element {
  return (
    <div className="relative left-0 mt-[150px] flex w-full flex-[1] transform-none select-none flex-col overflow-auto font-sans xl:left-1/2 xl:w-[1200px] xl:-translate-x-1/2">
      <h1 className="mb-3 mt-3 text-[32px]">Last Chicken Standing Rules</h1>
      <h2 className="mb-4 mt-4 text-2xl">1. Matchmaking</h2>
      <p className="relative mb-4 mt-4 box-border max-w-[1200px] border-l-[3px] border-red-500 bg-[#d3d3d3] pb-[30px] pl-[30px] pr-[50px] pt-[30px] text-black">
        Players highest score at the end of each round will be compared against
        all other players highest scores and their elo will be affected. Elo is
        a rating system measuring a players skill level. By default a player
        starts off with 1200 ELO and can gain or lose ELO based on their
        tournament performances. Each player has 3 attempts to get the highest
        score possible (number of forward hops) 5 minute breaks in-between runs
        (every 5 minutes exceeded is -1 attempt) and a set amount of time
        specified by the tournament organizer to complete round runs. At the end
        of each of the earlier rounds the highest scoring player is granted a
        bye and isn't required to play the next round. It is up to the
        tournament organizer to decide how many pools there will be, what the
        percentage of those who receive strikes will be, the amount of time
        between runs, and the amount of time alloted for each round.
      </p>
      <h2 className="mb-4 mt-4 text-2xl">2. Moderation</h2>
      <p className="relative mb-4 mt-4 box-border max-w-[1200px] border-l-[3px] border-red-500 bg-[#d3d3d3] pb-[30px] pl-[30px] pr-[50px] pt-[30px] text-black">
        A Referee must be present to monitor each match. Referees participating
        in tournaments agree to advise each players match without bias and are
        not allowed to referee their own runs. Referees decide whether a player
        wins, loses or is disqualified. Players who are unsatisfied with the
        Referees decision must appeal to an Admin of the Discord Server. Admins
        have 24 hours to respond to the issue. If no response is given, the
        Referees decision is final.
      </p>
      <h2 className="mb-4 mt-4 text-2xl">3. Platforms/Fair Play</h2>
      <p className="relative mb-4 mt-4 box-border max-w-[1200px] border-l-[3px] border-red-500 bg-[#d3d3d3] pb-[30px] pl-[30px] pr-[50px] pt-[30px] text-black">
        Each player agrees to use either the Crossy Road Application on the
        Windows Store or iOS/Android stable. Third party clients/software such
        as POKI are prohibited! A player must play at fullscreen using only the
        original characters, is not allowed to pause the game at any time{" "}
        <b>intentionally</b> or bind/map keys. If a player unintentionally
        pauses at a score of 1000 or less they are allowed to continue but must
        unpause immediately. The maximum resolution a player is allowed to use
        is 1920x1080. If the game crashes the player is allowed to restart the
        attempt but without any break. Preventable bugs/glitches that cause a
        player to die do not validate a restart.{" "}
        <b>
          If a stream crashes the player is allowed the option to restart the
          attempt. The second time the stream crashes the run is considered
          dead.
        </b>
      </p>
      <h2 className="mb-4 mt-4 text-2xl">4. Withdrawl/Play Period</h2>
      <p className="relative mb-4 mt-4 box-border max-w-[1200px] border-l-[3px] border-red-500 bg-[#d3d3d3] pb-[30px] pl-[30px] pr-[50px] pt-[30px] text-black">
        Players have the ability to withdraw themselves from the tournament
        whenever fit, however their funds contributed will be non-refundable and
        their ELO will still be affected.
      </p>
      <h2 className="mb-4 mt-4 text-2xl">5. Ties</h2>
      <p className="relative mb-4 mt-4 box-border max-w-[1200px] border-l-[3px] border-red-500 bg-[#d3d3d3] pb-[30px] pl-[30px] pr-[50px] pt-[30px] text-black">
        Players can only qualify for a tie if the highest score is the same for
        two or more players after a round. When a tie occurs, players will have
        one attempt to get the highest score possible (disregarding any previous
        runs scores). The player with the highest score wins the round. In the
        event that multiple people do not do their runs all players that did not
        do their runs will receive a strike or are eliminated depending on the
        organizers format.
      </p>
    </div>
  )
}
