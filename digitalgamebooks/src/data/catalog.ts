import type { GameCatalogItem } from '../types'

export const catalog: GameCatalogItem[] = [
  {
    id: 'big-trouble-little-china',
    title: 'Big Trouble in Little China – The Game',
    description: 'Una noche en Chinatown que se desmadra con magia antigua, callejones y héroes improbables.',
    coverUrl: 'https://via.placeholder.com/480x640.png?text=Big+Trouble+in+Little+China',
    languages: ['en', 'es'],
    entriesRange: { min: 1, max: 230 },
    tags: ['Kung-fu', 'Sobrenatural'],
  },
  {
    id: 'myskatonic-tales-innsmouth',
    title: 'Myskatonic Tales – Journey to Innsmouth',
    description: 'Investiga la costa ennegrecida, faros apagados y secretos que no quieren ser encontrados.',
    coverUrl: 'https://via.placeholder.com/480x640.png?text=Myskatonic+Tales+Journey+to+Innsmouth',
    languages: ['en', 'es'],
    entriesRange: { min: 1, max: 200 },
    tags: ['Horror', 'Investigación'],
  },
]
