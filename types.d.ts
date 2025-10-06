import type { RowList, Row } from "postgres"

export type HighscoreFormResult =
  | {
      error: string
      success?: undefined
    }
  | {
      success: string
      error?: undefined
    }

export type Schedule = {
  tournament_number: number
  date: Date
  tournament_logo: string
  name: string
  status: string
  winner_country: string
  winner: string
  bracket_url: string
  bracket_url2: string | null
}

export type EloPlayer = {
  rank: number
  flag: string
  player_name: string
  elo: number
  games: number
  id: string
}

export type CastlePlayer = {
  table_id: number
  table_name: string
  row_id: number
  rank: number
  discord_id: string
  username: string
  points: number
  avatar_url: string
}
