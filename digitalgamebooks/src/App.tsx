import { useEffect, useMemo, useState, type KeyboardEvent } from 'react'
import './App.css'
import { catalog } from './data/catalog'
import { entriesIndex } from './data/entries'
import type { GameEntry, LanguageCode } from './types'

type SearchResult = {
  entryId: number
  data: GameEntry
  language: LanguageCode
}

function App() {
  const [selectedGameId, setSelectedGameId] = useState<string>(catalog[0]?.id ?? '')
  const [selectedLang, setSelectedLang] = useState<LanguageCode>('es')
  const [entryInput, setEntryInput] = useState('')
  const [result, setResult] = useState<SearchResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const selectedGame = useMemo(
    () => catalog.find((game) => game.id === selectedGameId) ?? catalog[0],
    [selectedGameId],
  )

  const availableLanguages = selectedGame?.languages ?? ['es']

  useEffect(() => {
    if (!availableLanguages.includes(selectedLang)) {
      setSelectedLang(availableLanguages[0] as LanguageCode)
      setResult(null)
    }
  }, [availableLanguages, selectedLang])

  const currentEntries = useMemo(() => {
    return entriesIndex[selectedGame?.id ?? '']?.[selectedLang] ?? {}
  }, [selectedGame?.id, selectedLang])

  const handleSearch = () => {
    setError(null)
    const entryId = Number.parseInt(entryInput, 10)
    if (!Number.isFinite(entryId)) {
      setResult(null)
      setError('Introduce un número de entrada válido.')
      return
    }

    const data = currentEntries[entryId]
    if (!data) {
      setResult(null)
      setError('Entrada no encontrada para este juego/idioma.')
      return
    }

    setResult({ entryId, data, language: selectedLang })
  }

  const handleEnterKey = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="page">
      <header className="hero">
        <div className="brand">
          <div className="brand-mark">DG</div>
          <div>
            <p className="eyebrow">Digital Gamebooks · Beta</p>
            <h1>Encuentra entradas de tus libros de aventuras en segundos</h1>
            <p className="lede">
              Catálogo ligero, búsqueda por número y soporte multidioma. Optimizado para móvil,
              tablet y sobremesa.
            </p>
          </div>
        </div>
        <div className="controls">
          <div className="control">
            <label htmlFor="game">Juego</label>
            <select
              id="game"
              value={selectedGame?.id}
              onChange={(event) => {
                setSelectedGameId(event.target.value)
                setEntryInput('')
                setResult(null)
                setError(null)
              }}
            >
              {catalog.map((game) => (
                <option key={game.id} value={game.id}>
                  {game.title}
                </option>
              ))}
            </select>
          </div>

          <div className="control">
            <label htmlFor="language">Idioma</label>
            <select
              id="language"
              value={selectedLang}
              onChange={(event) => {
                setSelectedLang(event.target.value as LanguageCode)
                setResult(null)
                setError(null)
              }}
            >
              {availableLanguages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      <main className="grid">
        <section className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Catálogo</p>
              <h2>Juegos disponibles</h2>
            </div>
            <span className="pill">{catalog.length} juegos</span>
          </div>

          <div className="catalog-list">
            {catalog.map((game) => (
              <article
                key={game.id}
                className={`card ${selectedGame?.id === game.id ? 'card-active' : ''}`}
                onClick={() => {
                  setSelectedGameId(game.id)
                  setEntryInput('')
                  setResult(null)
                  setError(null)
                }}
              >
                <div className="card-title">
                  <h3>{game.title}</h3>
                  <span className="pill subtle">{game.languages.length} idiomas</span>
                </div>
                <p className="muted">{game.description}</p>
                <p className="meta">Entradas {game.entriesRange.min} - {game.entriesRange.max}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="panel focus">
          <p className="eyebrow">Búsqueda</p>
          <h2>Ir a una entrada</h2>
          <p className="muted">
            Escribe el número de entrada del libro y te mostraremos el texto en el idioma
            seleccionado.
          </p>

          <div className="search-box">
            <label htmlFor="entry">Número de entrada</label>
            <div className="search-row">
              <input
                id="entry"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="Ej. 125"
                value={entryInput}
                onChange={(event) => setEntryInput(event.target.value.replace(/[^0-9]/g, ''))}
                onKeyDown={handleEnterKey}
              />
              <button type="button" onClick={handleSearch}>
                Ir
              </button>
            </div>
            <p className="hint">Rango: {selectedGame?.entriesRange.min} - {selectedGame?.entriesRange.max}</p>
          </div>

          {error && <div className="banner error">{error}</div>}
          {result && (
            <div className="result">
              <div className="result-header">
                <span className="pill">Entrada {result.entryId}</span>
                <span className="pill subtle">{result.language.toUpperCase()}</span>
              </div>
              <h3>{result.data.title}</h3>
              <p>{result.data.body}</p>
            </div>
          )}
        </section>
      </main>

      <footer className="footer">
        <p className="muted">Digital Gamebooks · Prototipo estático listo para Azure Static Web Apps</p>
      </footer>
    </div>
  )
}

export default App
