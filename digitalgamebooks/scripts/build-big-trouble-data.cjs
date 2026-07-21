const fs = require('node:fs')
const path = require('node:path')

const sourcePath = path.resolve(process.argv[2] ?? 'pdf_extracted.txt')
const outputPath = path.resolve(
  process.argv[3] ?? 'src/data/books/big-trouble-little-china.es.json',
)

const missions = {
  1: 'Los hijos de perra deben pagar',
  2: 'Trayendo el pan a casa',
  3: 'En busca de la Espada del Dragón',
  4: 'Belleza con ojos verdes',
  5: 'El pantano de árboles muertos',
  6: 'Solo un sueño puede matar a otro sueño',
  7: 'Liberación',
  8: 'Verde de envidia',
  9: 'El ascenso de Chang Sing',
  10: 'Asalto al Wing Kong',
  11: 'El Pulitzer y el colgante',
  12: 'La caja de Pandora',
  13: 'Una tarde oscura y tormentosa',
  14: 'Caos en los bajos fondos',
  15: 'La calma antes de la tormenta',
}

const expectedIds = [
  '1.1', '1.2', '1.3', '1.4', '1.5',
  '2.1', '2.2', '2.3', '2.4', '2.5', '2.6', '2.7',
  '3.1', '3.2', '3.3', '3.4', '3.5', '3.6', '3.7',
  '4.1', '4.2', '4.3', '4.4', '4.5',
  '5.1', '5.2', '5.3', '5.4', '5.5',
  '6.1', '6.2', '6.3', '6.4',
  '7.1', '7.2', '7.3', '7.4', '7.5',
  '8.1', '8.2', '8.3', '8.4', '8.5',
  '9.1', '9.2', '9.3', '9.4', '9.5', '9.6', '9.7', '9.8',
  '10.1', '10.2', '10.3',
  '11.1', '11.2', '11.3', '11.4',
  '12.1', '12.2', '12.3',
  '13.1', '13.2',
  '14.1', '14.2',
  '15.1', '15.2',
]

const source = fs.readFileSync(sourcePath, 'utf8')
const eventStart = /\b(\d{1,2}\.\d)\s+(?:•\s+)?(?:Muev[ea]|Pon|Coloca?)\b/giu
const matches = [...source.matchAll(eventStart)]

const foundIds = matches.map((match) => match[1])
if (JSON.stringify(foundIds) !== JSON.stringify(expectedIds)) {
  throw new Error(
    `La extracción no coincide con los ${expectedIds.length} eventos esperados.\n` +
      `Encontrados: ${foundIds.join(', ')}`,
  )
}

const normalizeText = (value) =>
  value
    .replace(/--- PAGE (\d+) ---\s*\1\b/g, ' ')
    .replace(/--- PAGE \d+ ---/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\s+([,.;:!?])/g, '$1')
    .replace(/\bHA\s+GA UNA ELECCI[ÓO]N\b/giu, 'HAGA UNA ELECCIÓN')
    .replace(/\bCONCLUSI\s*[ÓO]N\b/giu, 'CONCLUSIÓN')
    .replace(/\be\s+stá\b/giu, 'está')
    .trim()

const entries = Object.fromEntries(
  matches.map((match, index) => {
    const id = match[1]
    const mission = Number(id.split('.')[0])
    const end = matches[index + 1]?.index ?? source.length
    const rawText = source.slice(match.index, end)

    return [
      id,
      {
        id,
        mission,
        missionTitle: missions[mission],
        text: normalizeText(rawText),
      },
    ]
  }),
)

const document = {
  bookId: 'big-trouble-little-china',
  language: 'es',
  source: 'Big_Trouble_in_Little_China_LIBRO_AVENTURAS.pdf',
  entryCount: expectedIds.length,
  entries,
}

fs.mkdirSync(path.dirname(outputPath), { recursive: true })
fs.writeFileSync(outputPath, `${JSON.stringify(document, null, 2)}\n`, 'utf8')
console.log(`Generadas ${expectedIds.length} entradas en ${outputPath}`)
