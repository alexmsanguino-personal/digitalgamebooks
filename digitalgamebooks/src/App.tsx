import { useMemo, useState } from 'react'
import './App.css'
import bigTroubleEs from './data/books/big-trouble-little-china.es.json'
import type { BookEntry, LanguageCode, LocalizedBook } from './types'

const languageNames: Record<LanguageCode, string> = {
  es: 'Español',
  en: 'English',
}

const books = [
  {
    id: 'big-trouble-little-china',
    title: 'Big Trouble in Little China',
    subtitle: 'Libro de aventuras',
    cover: '/btilc.webp',
    available: true,
  },
  {
    id: 'myskatonic-tales-innsmouth',
    title: 'Miskatonic Tales',
    subtitle: 'Journey to Innsmouth · Próximamente',
    cover: '/miskatonic.webp',
    available: false,
  },
]

const localizedBooks: Record<string, Partial<Record<LanguageCode, LocalizedBook>>> = {
  'big-trouble-little-china': {
    es: bigTroubleEs as LocalizedBook,
  },
}

const sectionPattern =
  /(?=(?:HAGA UNA ELECCI[ÓO]N|OPCI[ÓO]N\s+[AB]|[ÉE]XITO|FRACASO|CONCLUSI[ÓO]N DEL EVENTO|RECOMPENSA DE MISI[ÓO]N|COMBATE|PRUEBA DE HABILIDAD|¡DEJA DE LEER!))/giu

function EntryText({ text }: { text: string }) {
  const sections = text.split(sectionPattern).filter(Boolean)

  return (
    <div className="entry-copy">
      {sections.map((section, index) => {
        const trimmed = section.trim()
        const isCallout = /^(?:HAGA UNA ELECCI[ÓO]N|OPCI[ÓO]N\s+[AB]|[ÉE]XITO|FRACASO|CONCLUSI[ÓO]N DEL EVENTO|RECOMPENSA DE MISI[ÓO]N|COMBATE|PRUEBA DE HABILIDAD|¡DEJA DE LEER!)/iu.test(
          trimmed,
        )

        return (
          <p className={isCallout ? 'entry-callout' : undefined} key={`${index}-${trimmed.slice(0, 12)}`}>
            {trimmed}
          </p>
        )
      })}
    </div>
  )
}

function App() {
  const [activeBook, setActiveBook] = useState<string | null>(null)
  const [language, setLanguage] = useState<LanguageCode>('es')
  const [entryId, setEntryId] = useState('1.1')

  const bookData = activeBook ? localizedBooks[activeBook]?.[language] : undefined
  const entries = useMemo(
    () => (bookData ? (Object.values(bookData.entries) as BookEntry[]) : []),
    [bookData],
  )
  const activeEntry = bookData?.entries[entryId] as BookEntry | undefined
  const activeIndex = entries.findIndex((entry) => entry.id === entryId)

  const openBook = (bookId: string) => {
    setActiveBook(bookId)
    setLanguage('es')
    setEntryId('1.1')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const moveEntry = (offset: number) => {
    const nextEntry = entries[activeIndex + offset]
    if (nextEntry) {
      setEntryId(nextEntry.id)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  if (activeBook && bookData && activeEntry) {
    return (
      <div className="reader-page">
        <header className="reader-toolbar">
          <button className="back-button" type="button" onClick={() => setActiveBook(null)}>
            ← Biblioteca
          </button>
          <div className="book-heading">
            <span>Big Trouble in Little China</span>
            <small>{bookData.entryCount} entradas digitalizadas</small>
          </div>
          <label className="field compact-field">
            <span>Idioma</span>
            <select value={language} onChange={(event) => setLanguage(event.target.value as LanguageCode)}>
              {Object.keys(localizedBooks[activeBook]).map((code) => (
                <option key={code} value={code}>
                  {languageNames[code as LanguageCode]}
                </option>
              ))}
            </select>
          </label>
        </header>

        <main className="reader-layout">
          <aside className="entry-picker">
            <p className="picker-kicker">Libro de misión</p>
            <h1>Busca tu entrada</h1>
            <p>Selecciona el número indicado por la carta o por el evento anterior.</p>
            <label className="field">
              <span>Entrada</span>
              <select value={entryId} onChange={(event) => setEntryId(event.target.value)}>
                {Array.from(new Map(entries.map((entry) => [entry.mission, entry.missionTitle]))).map(
                  ([mission, missionTitle]) => (
                  <optgroup key={missionTitle} label={missionTitle}>
                    {entries.filter((entry) => entry.mission === mission).map((entry) => (
                      <option key={entry.id} value={entry.id}>
                        {entry.id}
                      </option>
                    ))}
                  </optgroup>
                  ),
                )}
              </select>
            </label>
            <div className="entry-count">
              Entrada {activeIndex + 1} de {entries.length}
            </div>
          </aside>

          <article className="entry-sheet">
            <div className="entry-title-row">
              <div>
                <p className="mission-label">Misión {activeEntry.mission}</p>
                <h2>{activeEntry.missionTitle}</h2>
              </div>
              <strong className="entry-number">{activeEntry.id}</strong>
            </div>
            <EntryText text={activeEntry.text} />
            <nav className="entry-navigation" aria-label="Navegación entre entradas">
              <button type="button" disabled={activeIndex <= 0} onClick={() => moveEntry(-1)}>
                ← Anterior
              </button>
              <button type="button" disabled={activeIndex >= entries.length - 1} onClick={() => moveEntry(1)}>
                Siguiente →
              </button>
            </nav>
          </article>
        </main>
      </div>
    )
  }

  return (
    <div className="library-page">
      <header className="library-hero">
        <p className="eyebrow">Digital Adventure Books</p>
        <h1>La aventura, siempre por la página correcta.</h1>
        <p>Elige un libro y abre la entrada que te indique la partida. Sin pasar páginas ni leer spoilers.</p>
      </header>

      <main className="book-grid">
        {books.map((book) => (
          <button
            className="book-card"
            disabled={!book.available}
            key={book.id}
            type="button"
            onClick={() => openBook(book.id)}
          >
            <img src={book.cover} alt={`Portada de ${book.title}`} />
            <span className="book-card-overlay">
              <small>{book.subtitle}</small>
              <strong>{book.title}</strong>
              {book.available && <em>Abrir libro →</em>}
            </span>
          </button>
        ))}
      </main>
    </div>
  )
}

export default App
