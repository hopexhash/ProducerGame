// Procedural generation of believable fictional names — no external APIs.

export function rand(min: number, max: number): number {
  return min + Math.random() * (max - min)
}
export function randInt(min: number, max: number): number {
  return Math.floor(rand(min, max + 1))
}
export function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}
export function chance(p: number): boolean {
  return Math.random() < p
}

const SONG_A = [
  'Midnight', 'Neon', 'Golden', 'Electric', 'Silent', 'Burning', 'Frozen', 'Wild',
  'Velvet', 'Crystal', 'Lost', 'Hidden', 'Distant', 'Eternal', 'Fading', 'Rising',
  'Cosmic', 'Lunar', 'Solar', 'Deep', 'Dark', 'Bright', 'Endless', 'Broken',
  'Sacred', 'Savage', 'Gentle', 'Restless', 'Hollow', 'Radiant',
]
const SONG_B = [
  'Dreams', 'Lights', 'Hearts', 'Waves', 'Nights', 'Fire', 'Rain', 'Skies',
  'Echoes', 'Motion', 'Horizon', 'Pulse', 'Gravity', 'Mirage', 'Tides', 'Embers',
  'Shadows', 'Voltage', 'Bloom', 'Static', 'Rhythm', 'Sunrise', 'Illusion', 'Momentum',
  'Frequency', 'Paradise', 'Serenade', 'Avenue', 'Reflections', 'Odyssey',
]
const SONG_SINGLE = [
  'Levitate', 'Mirage', 'Afterglow', 'Solstice', 'Eclipse', 'Vertigo', 'Nirvana',
  'Utopia', 'Kinetic', 'Aurora', 'Cascade', 'Zenith', 'Halo', 'Prism', 'Enigma',
  'Wildfire', 'Undertow', 'Daydream', 'Nocturne', 'Euphoria', 'Adrenaline', 'Oxygen',
  'Fever', 'Gravity', 'Monsoon', 'Sahara', 'Lagoon', 'Delirium', 'Impulse', 'Reverie',
]

export function genSongName(): string {
  return chance(0.4) ? pick(SONG_SINGLE) : `${pick(SONG_A)} ${pick(SONG_B)}`
}

const ARTIST_FIRST = [
  'Luna', 'Kairo', 'Nova', 'Ezra', 'Mila', 'Dante', 'Aria', 'Zane', 'Iris', 'Rocco',
  'Sienna', 'Jax', 'Amara', 'Leo', 'Nyla', 'Otis', 'Vera', 'Malik', 'Elio', 'Sade',
  'Ren', 'Kaia', 'Bodhi', 'Zara', 'Idris', 'Freya', 'Cassius', 'Imani', 'Theo', 'Lyra',
]
const ARTIST_LAST = [
  'Vale', 'Storm', 'Reyes', 'Blackwood', 'Monroe', 'Cole', 'Santana', 'Frost',
  'Delacroix', 'Knight', 'Rivers', 'Cruz', 'Wilder', 'Fontaine', 'Grey', 'Kane',
  'Moreau', 'Ashford', 'Voss', 'Mercer',
]
const DJ_PREFIX = ['DJ', 'MC', 'Lil', 'Young', 'Big']
const ONE_WORD_ARTIST = [
  'AVYX', 'KOROVA', 'Solence', 'Nightjar', 'Vantablack', 'Oceanix', 'Hypnica',
  'Stellara', 'Mirage', 'Kryon', 'Zephyra', 'Onyxia', 'Pulsar', 'Nebulon', 'Vexa',
]

export function genArtistName(): string {
  const r = Math.random()
  if (r < 0.2) return pick(ONE_WORD_ARTIST)
  if (r < 0.3) return `${pick(DJ_PREFIX)} ${pick(ARTIST_LAST)}`
  return `${pick(ARTIST_FIRST)} ${pick(ARTIST_LAST)}`
}

const NEWS_TEMPLATES = [
  (a: string, g: string) => `${a} reaches #1 worldwide with a surprise ${g} single.`,
  (_a: string, g: string) => `${g} streams increase ${randInt(6, 28)}% this month.`,
  (a: string, g: string) => `${a} announces a world tour after viral ${g} success.`,
  (a: string, _g: string) => `Industry insiders say ${a} is in talks with three major labels.`,
  (a: string, g: string) => `A leaked ${g} demo from ${a} sets streaming records overnight.`,
  (a: string, _g: string) => `${a} breaks the record for most streams in a single day.`,
  (_a: string, g: string) => `Analysts predict ${g} will dominate festival season this year.`,
  (a: string, g: string) => `${a} teases a genre switch to ${g} — fans are divided.`,
  (a: string, _g: string) => `Nova Music signs rising producer ${a} in a multi-album deal.`,
  (_a: string, g: string) => `TuneTok trend pushes ${g} into the global spotlight.`,
]

export function genIndustryNews(genre: string): string {
  return pick(NEWS_TEMPLATES)(genArtistName(), genre)
}

export const CITIES = [
  'Los Angeles', 'Berlin', 'Amsterdam', 'London', 'Istanbul', 'Tokyo',
  'São Paulo', 'Miami', 'Stockholm', 'Cape Town', 'Seoul', 'Paris',
]
