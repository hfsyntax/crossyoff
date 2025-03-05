export type PlayerSearchResult =
  | {
      error: string
      data?: undefined
      records?: undefined
    }
  | {
      data: QueryResultRow[]
      records: QueryResultRow[]
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
