"use server"
import mysql from 'mysql2/promise'
import { revalidatePath } from 'next/cache'
import { cache } from 'react'


const connectToDatabase = async () => {
    try {
        if (!global.dbConnection) {
            global.dbConnection = mysql.createPool({
                host: process.env.DB_SERVERNAME,
                user: process.env.DB_USERNAME,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_DBNAME,
                waitForConnections: true,
                connectionLimit: 10,
                queueLimit: 0
            })
        }
    } catch (error) {
        console.error(error)
        throw error
    }
}

if (!global.dbConnection) {
    connectToDatabase().then(() => {
        console.log("created the connection pool")
    })
}

const getMembersCount = cache(async () => {
    try {
        const endpoint = "https://discord.com/api/guilds/600865413890310155/preview"
        const token = process.env.BOT_TOKEN
        const response = await fetch(endpoint, { headers: { Authorization: `Bot ${token}` }, method: "GET" })
        const responseBody = await response.json()
        return responseBody.approximate_member_count ? responseBody.approximate_member_count : "N/A"
    } catch (error) {
        console.error(error)
        return "N/A"
    }
})

const getTournamentCount = cache(async () => {
    let dbConnection
    try {
        const query = "SELECT COUNT(*) AS count FROM `Crossy Road Tournaments`"
        dbConnection = await global.dbConnection.getConnection()
        const [[{ "count": tournaments }]] = await dbConnection.execute(query)
        return tournaments
    } catch (error) {
        console.error(error)
        return "N/A"
    } finally {
        if (dbConnection) {
            dbConnection.release()
        }
    }
})

const getAllTournaments = cache(async () => {
    let dbConnection
    try {
        const query = "SELECT tournament_number, date, tournament_logo,  name, status, winner_country, winner, bracket_url, bracket_url2 FROM `Crossy Road Tournaments` ORDER BY tournament_number DESC"
        dbConnection = await global.dbConnection.getConnection()
        const [tournaments] = await dbConnection.execute(query)
        return tournaments
    } catch (error) {
        console.error(error)
        return []
    } finally {
        if (dbConnection) {
            dbConnection.release()
        }
    }
})

const getAllPlayerElo = cache(async () => {
    let dbConnection
    try {
        dbConnection = await global.dbConnection.getConnection()
        const query = "SELECT rank, flag, name, elo, games FROM `Crossy Road Elo Rankings` ORDER BY rank ASC"
        const [players] = await dbConnection.execute(query)
        return players
    } catch (error) {
        console.error(error)
        return []
    } finally {
        if (dbConnection) {
            dbConnection.release()
        }
    }
})

const getPlayerElo = async (search) => {
    const dbConnection = await global.dbConnection?.getConnection().catch(error => {
        return { error: "database authentication error" }
    })

    if (dbConnection.error) {
        return { error: dbConnection.error }
    }

    const query = `SELECT CONVERT(id, CHAR) as id, rank, flag, name, elo, games, won FROM \`Crossy Road Elo Rankings\` WHERE name = '${search}' OR id = '${search}'`

    const player = await dbConnection.execute(query).catch(error => {
        return { error: "database fetch error" }
    })

    dbConnection.release()

    if (player.error) {
        return { error: player.error }
    }
    
    return player[0]
}

const getPlayerTournaments = async (id) => {
    const dbConnection = await global.dbConnection?.getConnection().catch(error => {
        return { error: "database authentication error" }
    })

    if (dbConnection.error) {
        return { error: dbConnection.error }
    }

    const query = "SELECT `tournaments`, `tournament`, `place`, `score`, `change`, `img`  FROM `Crossy Road Games` WHERE id = ? ORDER BY tournaments DESC";

    const tournaments = await dbConnection.execute(query, [id]).catch(error => {
        return { error: "database fetch error" }
    })

    dbConnection.release()

    if (tournaments.error) {
        return { error: tournaments.error }
    }
    
    return tournaments[0]
}

const getPlayerChallenges = async (id) => {
    const dbConnection = await global.dbConnection?.getConnection().catch(error => {
        return { error: "database authentication error" }
    })

    if (dbConnection.error) {
        return { error: dbConnection.error }
    }

    const query = `
    SELECT
            challenge_id,
            CASE
                WHEN challenger_id = ? THEN challenger_id
                WHEN opponent_id = ? THEN opponent_id
            END AS player_id,
            CASE
                WHEN challenger_id = ? THEN challenger_score
                WHEN opponent_id = ? THEN opponent_score
            END AS player_score
            FROM
                  \`Crossy Road Challenges\`
            WHERE
                  challenger_id = ? OR opponent_id = ?
            `;

    const challenges = await dbConnection.execute(query, [id, id, id, id, id, id]).catch(error => {
        return { error: "database fetch error" }
    })

    dbConnection.release()

    if (challenges.error) {
        return { error: challenges.error }
    }
    
    return challenges[0]
}

const getPlatformTopPlayers = cache(async (platform) => {
    let dbConnection
    try {
        dbConnection = await global.dbConnection.getConnection()
        const query = `SELECT rank, flag, name, score, date, titles, video_url FROM \`Crossy Road Records\` WHERE \`platform\` = '${platform}'  ORDER BY \`rank\` ASC`
        const [players] = await dbConnection.execute(query)
        return players
    } catch (error) {
        console.error(error)
        return []
    } finally {
        if (dbConnection) {
            dbConnection.release()
        }
    }
})

const validateRecaptcha = async (token) => {
    const recaptchaResponse = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`)
    const responseBody = await recaptchaResponse.json()
    return responseBody?.success && responseBody?.score > 0.5
}

const handlePlayerSearch = async (prevState, formData) => {
    if (!formData.get("search")) {
        return { error: "search cannot be empty" }
    }

    if (formData.get("search").length > 64) {
        return { error: "search is too long" }
    }

    if (!formData.get("g-recaptcha-response")) {
        return { error: "no reCAPTCHA token set." }
    }

    const recaptchaToken = formData.get("g-recaptcha-response")
    const recaptchaValidated = await validateRecaptcha(recaptchaToken)

    if (!recaptchaValidated) {
        return { error: "reCAPTCHA validation failed" }
    }

    const search = formData.get("search")
    const playerSearch = await getPlayerElo(search)

    if (playerSearch.error) {
        return { error: playerSearch.error }
    }

    if (playerSearch.length === 0) {
        return { error: "no results" }
    }

    // get tournaments
    const playerTournaments = await getPlayerTournaments(playerSearch[0].id)

    if (playerTournaments.error) {
        return { error: tournaments.error }
    }

    // get challenges
    const playerChallenges = await getPlayerChallenges(playerSearch[0].id)
    
    if (playerChallenges.error) {
        return { error: tournaments.error }
    }

    // calculate average score and place
    let totalPlace = 0
    let totalScore = 0
    let totalTournaments = 0
    
    for (let tournament of playerTournaments) {
        const tournamentName = tournament["tournament"]
        if (!tournamentName.includes("Worlds") && tournamentName !== "King of Cross #1") {
            const tournamentPlace = tournament["place"]
            const tournamentScore = tournament["score"]
            totalPlace += tournamentPlace
            totalScore += tournamentScore
            totalTournaments++
        }
    }

    let totalChallenges = 0
    for (let challenge of playerChallenges) {
        totalScore += challenge["player_score"]
        totalChallenges++
    }

    const averageScore = Math.round(totalScore / (totalTournaments + totalChallenges) )
    // max in the case of a player who played challenges but no tournaments
    const averagePlace = Math.round(totalPlace / Math.max(totalTournaments, 1))
    playerSearch[0].averageScore = averageScore
    playerSearch[0].averagePlace = averagePlace
    revalidatePath("/")
    return { data: playerSearch, records: playerTournaments }
}

const handleSubmitRun = async (prevState, formData) => {

    const formInputs = ["name", "country", "score", "video_url", "platform"]
    const validURLRegex = /^(?:(?:https?):\/\/)?(?:www\.)?[a-z0-9-]+(?:\.[a-z0-9-]{2,5})+(?:\/[^\s]*)?$/i

    for (let input of formInputs) {
        if (!formData.get(input))
            return { error: `${input} cannot be empty` }
    }

    if (formData.get("name").length > 64) {
        return { error: "name too long" }
    }

    if (formData.get("country").length < 4 || formData.get("country").length > 64) {
        return { error: "invalid country" }
    }

    if (isNaN(formData.get("score")) || formData.get("score").length > 4) {
        return { error: "score must be a number and 4 digits or less." }
    }

    if (formData.get("video_url").length > 2083 || !validURLRegex.test(formData.get("video_url"))) {
        return { error: "invalid video url" }
    }

    if (formData.get("platform") !== "Mobile" && formData.get("platform") !== "PC") {
        return { error: "platform must be Mobile or PC" }
    }

    if (!formData.get("g-recaptcha-response")) {
        return { error: "no reCAPTCHA token set." }
    }

    const recaptchaToken = formData.get("g-recaptcha-response")
    const recaptchaValidated = await validateRecaptcha(recaptchaToken)

    if (!recaptchaValidated) {
        return { error: "reCAPTCHA validation failed" }
    }

    const dbConnection = await global.dbConnection.getConnection().catch(error => {
        return { error: "database authentication error" }
    })

    if (dbConnection.error) {
        return { error: dbConnection.error }
    }

    const scoreQuery = "SELECT score FROM `Crossy Road Records` WHERE platform = ? AND score < ?"
    const scoreQueryResult = await dbConnection.execute(scoreQuery, [formData.get("platform"), formData.get("score")])
    .catch(error => {
        console.error(error)
        return { error: `database fetch error` }
    })

    dbConnection.release()

    if (scoreQueryResult.error) {
        return { error: scoreQueryResult.error }
    }

    if (scoreQueryResult[0].length === 0) {
        return { error: `score is less than the top 5 ${formData.get("platform")} highscores` }
    }

    // discord webhook embed with form data here
    const webhookID = process.env.WEBHOOK_ID
    const webhookToken = process.env.WEBHOOK_TOKEN
    const webhookURL = `https://discord.com/api/webhooks/${webhookID}/${webhookToken}`
    const discordEmbed = {
        embeds: [
            {
                title: "CrossyOff Run Submission",
                type: "rich",
                timestamp: new Date().toISOString(),
                color: 15548997,
                footer: {
                    text: "Sent"
                },
                fields: [
                    { name: "Name", value: formData.get("name") },
                    { name: "Country", value: formData.get("country") },
                    { name: "Score", value: formData.get("score") },
                    { name: "Platform", value: formData.get("platform") },
                    { name: "Video URL", value: formData.get("video_url") },
                ]
            }
        ]
    }
    const postWebhook = await fetch(webhookURL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(discordEmbed) })
        .catch(error => {
            console.error(error)
            return { error: "discord api error" }
        })

    if (postWebhook.error) {
        return { error: postWebhook.error }
    }

    revalidatePath("/")
    return { success: "success" }
}

export {
    getMembersCount,
    getTournamentCount,
    getAllTournaments,
    getAllPlayerElo,
    getPlatformTopPlayers,
    handlePlayerSearch,
    handleSubmitRun
}
