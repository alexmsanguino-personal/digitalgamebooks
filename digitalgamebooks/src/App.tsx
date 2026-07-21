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

const sectionClass = (text: string) => {
  if (/^[ÉE]XITO/iu.test(text)) return 'result-card result-success'
  if (/^FRACASO/iu.test(text)) return 'result-card result-failure'
  if (/^CONCLUSI[ÓO]N DEL EVENTO/iu.test(text)) return 'result-card result-conclusion'
  if (/^(?:RECOMPENSA DE MISI[ÓO]N|COMBATE|PRUEBA DE HABILIDAD)/iu.test(text)) return 'result-card'
  return undefined
}

function EntryText({ entry }: { entry: BookEntry }) {
  const sections = entry.text.split(sectionPattern).map((section) => section.trim()).filter(Boolean)
  const choiceHeadingIndex = sections.findIndex((section) => /^HAGA UNA ELECCI[ÓO]N/iu.test(section))
  const beforeChoices = choiceHeadingIndex >= 0 ? sections.slice(0, choiceHeadingIndex) : sections
  const choiceCards: Array<{ variant: 'a' | 'b'; body: string; stop?: string }> = []
  const deferredChoiceResults: string[] = []
  let afterChoiceIndex = choiceHeadingIndex + 1

  if (choiceHeadingIndex >= 0) {
    while (afterChoiceIndex < sections.length) {
      const option = sections[afterChoiceIndex]
      const optionMatch = option.match(/^OPCI[ÓO]N\s+([AB])/iu)
      if (!optionMatch) break

      const optionBody = option.replace(/^OPCI[ÓO]N\s+[AB]:?\s*/iu, '').trim()
      let stop: string | undefined
      const stopText = sections[afterChoiceIndex + 1]
      if (stopText && /^¡DEJA DE LEER!/iu.test(stopText)) {
        const stopMatch = stopText.match(
          /^(¡DEJA DE LEER!.*?(?:tarea|prueba|elecci[óo]n)\.)\s*(.*)$/iu,
        )
        stop = stopMatch?.[1] ?? stopText
        if (stopMatch?.[2]) deferredChoiceResults.push(stopMatch[2])
        afterChoiceIndex += 1
      }

      choiceCards.push({
        variant: optionMatch[1].toLowerCase() as 'a' | 'b',
        body: optionBody,
        stop,
      })
      afterChoiceIndex += 1
    }
  }

  const afterChoices = choiceHeadingIndex >= 0
    ? [...deferredChoiceResults, ...sections.slice(afterChoiceIndex)]
    : []
  const instructionEnd = beforeChoices[0]?.search(/carta de Misi[óo]n\./iu) ?? -1
  const instructionLength = instructionEnd >= 0 ? instructionEnd + 'carta de Misión.'.length : 0
  const instruction = instructionLength ? beforeChoices[0].slice(0, instructionLength) : undefined
  const openingText = instructionLength ? beforeChoices[0].slice(instructionLength).trim() : beforeChoices[0]
  const portrait = entry.mission <= 12
    ? `/big-trouble/portraits/mission-${String(entry.mission).padStart(2, '0')}.jpeg`
    : undefined

  return (
    <div className="entry-copy">
      {instruction && <p className="event-instruction">{instruction}</p>}
      <div className={`entry-opening ${portrait ? '' : 'without-portrait'}`}>
        {portrait && <img className="hero-portrait" src={portrait} alt="Retrato del protagonista" />}
        <div className="opening-narrative">
          {openingText && <p>{openingText}</p>}
          {beforeChoices.slice(1).map((section, index) => (
            <p className={sectionClass(section)} key={`before-${index}`}>
              {section}
            </p>
          ))}
        </div>
      </div>

      {choiceHeadingIndex >= 0 && <h3 className="choice-heading">Haga una elección:</h3>}
      {choiceCards.length > 0 && (
        <div className="choice-grid">
          {choiceCards.map((choice) => (
            <div className={`choice-card choice-${choice.variant}`} key={choice.variant}>
              <h4>Opción {choice.variant.toUpperCase()}:</h4>
              <p>{choice.body}</p>
              {choice.stop && <p className="stop-reading">{choice.stop}</p>}
            </div>
          ))}
        </div>
      )}

      {afterChoices.map((section, index) => (
        <p className={sectionClass(section)} key={`after-${index}`}>
          {section}
        </p>
      ))}
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
              <p className="mission-label">Misión {activeEntry.mission}</p>
              <h2>{activeEntry.missionTitle}</h2>
            </div>
            <div className="event-banner">
              <h3>{activeEntry.title}</h3>
              <strong className="entry-number">{activeEntry.id}</strong>
            </div>
            <EntryText entry={activeEntry} />
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
