export const metadata = {
    title: "Challenges",
    description: "Lists the CrossyOff rules for challenges.",
};

export default function Challenges(): JSX.Element {
    return (
        <div id="content" className="column rule no-height">
            <h1>CrossyOff Challenges Rules</h1>
            <h2>1. Matchmaking</h2>
            <p className="rule-box">
                Players will be ranked based on ELO, which is a rating system measuring a players skill level. By default a player starts off with 1200 ELO and can gain or lose ELO based on their tournament performances. Each player has 3 attempts to get the highest score possible (number of forward hops). Players can break between attempts. If a player is taking too long during a break, their opponent can notify a referee. The referee decides the amount of break time left. The player will forfeit an attempt for each instance of failing to resume play after the specified break time. If both players decide not to play, the referee will close the match.
            </p>
            <h2>2. Moderation</h2>
            <p className="rule-box">
                Players are not required to monitor each others match and instead will create a recording of their runs. Do not open Crossy Road until after the recording has started. Before each run use the /run command to generate the series of moves that need to be completed before starting each run. When finished be sure to notify a referee who will enter your scores. Referees decide whether a player wins, loses or is disqualified. Players who are unsatisfied with the Referees decision must appeal to an Admin of the Discord Server. Admins have 24 hours to respond to the issue. If no response is given, the Referees decision is final.
            </p>
            <h2>3. Platforms/Fair Play</h2>
            <p className="rule-box">
                Each player agrees to use either the Crossy Road Application on the Windows Store or iOS/Android stable. Third party clients/software such as POKI are prohibited! A player must play at fullscreen using only the original characters, is not allowed to pause the game at any time (whether intentional or unintentional the player will lose an attempt) or bind/map keys. The maximum resolution a player is allowed to use is 1920x1080. If the game crashes the player is allowed to restart the attempt but without any break. Preventable bugs/glitches that cause a player to die do not validate a restart.
            </p>
            <h2>4. Withdrawl/Play Period</h2>
            <p className="rule-box">
                If 1 or both players want to withdrawl themselves from a challenge they must notify a referee of the situation.
            </p>
            <h2>5. Ties</h2>
            <p className="rule-box">
                Ties are applicable and elo will be calculated accordingly in case of a tie.
            </p>
        </div>
    );
}