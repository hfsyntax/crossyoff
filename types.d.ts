import type { RowList, Row } from "postgres"

export type PlayerSearchResult =
  | {
      error: string
      data?: undefined
      records?: undefined
    }
  | {
      data: RowList<Row[]> | never[]
      records: RowList<Row[]> | never[]
      error?: undefined
    }

export type HighscoreFormResult =
  | {
      error: string
      success?: undefined
    }
  | {
      success: string
      error?: undefined
    }
