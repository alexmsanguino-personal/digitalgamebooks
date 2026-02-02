import './App.css'

const covers = [
  {
    id: 'big-trouble',
    title: 'Big Trouble in Little China – The Game',
    url: 'https://cf.geekdo-images.com/1pBWj7IikvPvCUskiD0_fQ__imagepage@2x/img/g4S5I3riKRJ9hLgEJRLKVIIIGas=/fit-in/1800x1200/filters:strip_icc()/pic3474863.jpg',
  },
  {
    id: 'myskatonic-innsmouth',
    title: 'Myskatonic Tales – Journey to Innsmouth',
    url: 'https://cf.geekdo-images.com/5gsKAJyt4P8hdriaWHAEIw__imagepage@2x/img/Vw2JPQuKQsMvcZO7ohFF6hV-HOY=/fit-in/1800x1200/filters:strip_icc()/pic9109929.png',
  },
]

function App() {
  const handleTilt = (event: React.MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100
    event.currentTarget.style.setProperty('--mx', x.toFixed(2))
    event.currentTarget.style.setProperty('--my', y.toFixed(2))
  }

  const handleTiltReset = (event: React.MouseEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty('--mx', '50')
    event.currentTarget.style.setProperty('--my', '50')
  }

  return (
    <div className="page simple">
      <header className="hero minimal">
        <p className="eyebrow">Digital Adventure Books</p>
        <h1>Playing adventures without getting lost hunting pages</h1>
        <p className="lede">Pick your book, tap the number, keep the story flowing.</p>
      </header>

      <main className="covers-only">
        {covers.map((cover) => (
          <article
            key={cover.id}
            className="simple-card"
            aria-label={cover.title}
            onMouseMove={handleTilt}
            onMouseLeave={handleTiltReset}
          >
            <div
              className="simple-cover"
              style={{ backgroundImage: `url(${cover.url})` }}
              role="img"
              aria-label={cover.title}
            />
            <div className="simple-overlay">
              <h2>{cover.title}</h2>
            </div>
          </article>
        ))}
      </main>
    </div>
  )
}

export default App
