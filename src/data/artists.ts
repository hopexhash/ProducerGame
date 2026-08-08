import type { CollabArtist, Genre } from '../types'
import { GENRES } from './genres'
import { genArtistName, pick, randInt } from './names'

interface FameTier {
  fameLevel: string
  followers: [number, number]
  cost: [number, number]
  split: [number, number]
  minReputation: number
  exposure: string
  boost: [number, number]
}

const FAME_TIERS: FameTier[] = [
  { fameLevel: 'Unknown Artist', followers: [200, 5000], cost: [0, 100], split: [10, 20], minReputation: 0, exposure: 'Minimal', boost: [1.05, 1.15] },
  { fameLevel: 'Local Artist', followers: [5000, 40000], cost: [200, 1500], split: [15, 30], minReputation: 30, exposure: 'Low', boost: [1.15, 1.4] },
  { fameLevel: 'Rising Artist', followers: [40000, 400000], cost: [2000, 15000], split: [25, 40], minReputation: 150, exposure: 'Medium', boost: [1.4, 2.2] },
  { fameLevel: 'Established Artist', followers: [400000, 2000000], cost: [20000, 80000], split: [35, 50], minReputation: 600, exposure: 'High', boost: [2.2, 4] },
  { fameLevel: 'Superstar Artist', followers: [2000000, 10000000], cost: [90000, 300000], split: [45, 55], minReputation: 2000, exposure: 'Very High', boost: [4, 8] },
  { fameLevel: 'Global Superstar', followers: [10000000, 60000000], cost: [350000, 1200000], split: [50, 60], minReputation: 6000, exposure: 'Massive', boost: [8, 18] },
]

let collabCounter = 0

export function generateCollabArtist(tierIndex?: number): CollabArtist {
  collabCounter++
  const tier = FAME_TIERS[tierIndex ?? randInt(0, FAME_TIERS.length - 1)]
  return {
    id: `collab-${Date.now()}-${collabCounter}`,
    name: genArtistName(),
    genre: pick(GENRES) as Genre,
    fameLevel: tier.fameLevel,
    followers: randInt(tier.followers[0], tier.followers[1]),
    cost: Math.round(randInt(tier.cost[0], tier.cost[1]) / 50) * 50,
    split: randInt(tier.split[0], tier.split[1]) / 100,
    minReputation: tier.minReputation,
    exposure: tier.exposure,
    boost: +(tier.boost[0] + Math.random() * (tier.boost[1] - tier.boost[0])).toFixed(2),
  }
}

export function generateCollabPool(reputation: number): CollabArtist[] {
  const pool: CollabArtist[] = []
  const maxTier = FAME_TIERS.reduce((m, t, i) => (reputation >= t.minReputation ? i : m), 0)
  for (let i = 0; i < 5; i++) {
    pool.push(generateCollabArtist(randInt(Math.max(0, maxTier - 2), Math.min(maxTier + 1, FAME_TIERS.length - 1))))
  }
  return pool
}
