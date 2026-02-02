export type LanguageCode = 'es' | 'en'

export type GameCatalogItem = {
  id: string
  title: string
  description: string
  coverUrl: string
  languages: LanguageCode[]
  entriesRange: { min: number; max: number }
  tags?: string[]
}

export type GameEntry = {
  title: string
  body: string
}

export type EntriesIndex = Record<string, Record<LanguageCode, Record<number, GameEntry>>>
