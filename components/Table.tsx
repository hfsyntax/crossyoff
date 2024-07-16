import Image from "next/image"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrophy, faVideo } from "@fortawesome/free-solid-svg-icons"
import { QueryResultRow } from "@vercel/postgres"

export default function Table({ rowHeaders, data }: {rowHeaders: string[], data: QueryResultRow[]}): JSX.Element {
    return (
        <table>
            <thead>
                <tr key={"rowHeaders"}>
                    {rowHeaders.map((header, index) => <th key={index}>{header === "#" ? <>&nbsp;{header}</> : header }</th>)}
                </tr>
            </thead>
            <tbody>

                {data.map((row, index) => (
                    <tr key={index}>
                        {Object.keys(row)
                            // filter out tournament number to combine fields (keep header to fields ratio)
                            .filter(field => !["tournament_logo", "winner_country", "bracket_url2", "flag", "img", "id"].includes(field))
                            .map(field => (
                                // color of row text
                                <td key={field} style={{
                                    color: row[field] === "Completed" ? "green" : (row[field] === "In-Progress" ? "coral" : "inherit")
                                }}>
                                    {
                                        // if row is date convert to string
                                        row[field] instanceof Date ?
                                            row[field].toLocaleDateString()
                                        : (
                                            // combine tournament name and logo to the same field
                                            (field === "name" && row["tournament_logo"]) ?
                                                (<><Image width={50} height={50} src={`/img/${row["tournament_logo"]}.png`} alt='tournament logo' />&nbsp;{row[field]}</>) :
                                            // bracket url
                                            (field === "bracket_url" ?
                                                (row[field] !== "" ?
                                                    // check for a second bracket
                                                    (row["bracket_url2"] ?
                                                        <> <a href={row["bracket_url"]} target="_blank"><FontAwesomeIcon icon={faTrophy} size="2xl" /></a><a href={row["bracket_url2"]} target="_blank"><FontAwesomeIcon icon={faTrophy} size="2xl" /></a>  </>
                                                        : <a href={row[field]} target="_blank"><FontAwesomeIcon icon={faTrophy} size="2xl" /></a>)
                                                    : <b>N/A</b>) :
                                            // tournament status field
                                            (field === "status" ?
                                                <b>{row[field]}</b> :
                                            // tournament winner field
                                            (field === "winner" && row["tournament_number"] ? 
                                                (row["winner_country"] !== "" ? <><Image  width={50} height={50} src={`/img/flags/${row["winner_country"]}1.png`} alt="winner_country"/><b>&nbsp;{row[field]}</b></> : <b>{row[field]}</b>) 
                                            // tournament number or player rank
                                            : (field === "tournament_number" || field === "rank" || field === "tournaments" ? 
                                                <b>&nbsp;{row[field]}</b> 
                                            // combine player name and country flag
                                            : (field === "name" && row["flag"] ? 
                                                <><Image width={67} height={50} src={`/img/flags/${row["flag"]}.png`} alt="player_flag"/>&nbsp;{row["name"]}</> 
                                            // video url for rank table by platform
                                            : (field === "video_url" ? 
                                                <a href={row[field]} target="_blank"><FontAwesomeIcon icon={faVideo} size="2xl" /></a> 
                                            // player search combine tournament image with name
                                            : (field === "tournament" && row["img"] ?
                                                <><Image width={50} height={50} src={`/img/${row["img"]}.png`} alt="tournament_logo"/>&nbsp;{row["tournament"]}</>  
                                            : row[field]))  )))))
                                        )
                                    }
                                </td>
                            ))}
                    </tr>
                ))}
            </tbody>
        </table>
    )
}