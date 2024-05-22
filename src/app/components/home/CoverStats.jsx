import { getTournamentCount, getMembersCount  } from "../../../utility_functions"

const CoverStats = async ({containerClass, statClass}) => {
    const tournaments = await getTournamentCount()
    const members = await getMembersCount()
    return (
        <div className={containerClass}>
            <div className={statClass}>
                <span>{tournaments}</span><br />
                <span>Tournaments</span>
            </div>
            <div className={statClass}>
                <span>{members}</span><br />
                <span>Members</span>
            </div>
        </div>
    )
}

export default CoverStats