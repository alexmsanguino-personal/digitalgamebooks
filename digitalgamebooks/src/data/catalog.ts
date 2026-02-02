import type { GameCatalogItem } from '../types'

export const catalog: GameCatalogItem[] = [
  {
    id: 'lost-island',
    title: 'La Isla Perdida',
    description: 'Explora ruinas antiguas y desvela los misterios del archipiélago tropical.',
    languages: ['es', 'en'],
    entriesRange: { min: 1, max: 250 },
  },
  {
    id: 'space-trail',
    title: 'Space Trail',
    description: 'Campaña sci-fi ligera con rutas alternativas y encuentros rápidos.',
    languages: ['es', 'en'],
    entriesRange: { min: 1, max: 180 },
  },
]
