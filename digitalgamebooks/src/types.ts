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

export type EntriesIndex = Record<string, Partial<Record<LanguageCode, Record<string, GameEntry>>>>

export type BookEntry = {
  id: string
  mission: number
  missionTitle: string
  text: string
}

export type LocalizedBook = {
  bookId: string
  language: LanguageCode
  source: string
  entryCount: number
  entries: Record<string, BookEntry>
}

// ── Mission Book types ─────────────────────────────────────────────────────────

export type EventLink = {
  id: string       // Target event ID, e.g. "1.3"
  label: string    // Button label, e.g. "→ Opción A"
  variant?: 'a' | 'b' | 'next' | 'end'
}

export type MissionEvent = {
  id: string          // "1.1", "2.3", etc.
  title?: string
  text: string        // Full narrative text (paragraphs separated by \n\n)
  links: EventLink[]
  isEnd?: boolean
  missionReward?: string
}

export type Mission = {
  num: number
  title: string
  startEvent: string
  events: MissionEvent[]
}
