import type { GameState, Song } from '../types'
import { GENRE_BASE } from '../data/genres'
import { PLAYLISTS, VIRAL_TYPES } from '../data/playlists'
import { chance, rand, randInt } from '../data/names'

export interface DayStreamResult {
  streams: number
  viralTriggered: { type: string } | null
  playlistAdded: string | null
}

/** Simulate one day of streams for a released song. Mutates nothing — returns numbers. */
export function simulateSongDay(s: GameState, song: Song): DayStreamResult {
  const age = s.day - (song.releaseDay ?? s.day)
  const trend = s.genreTrends[song.genre] ?? 1
  const genreBase = GENRE_BASE[song.genre] ?? 1

  // Core reach: who can even find this song
  const coreReach = 18 + Math.pow(Math.max(0, s.followers), 0.82) * 0.4 + s.reputation * 1.5

  // Quality curve — quality dominates long-term performance
  const qualityMult = Math.pow(song.quality / 50, 2.7)

  // Launch window: marketing + hype boost the first ~14 days
  const contract = s.activeContract
  const labelMarketing = song.labelName && contract ? contract.offer.marketingBonus : 0
  const marketingPower = Math.log10(1 + song.marketingBudget) / 4
  const launchBoost = age < 14
    ? 1 + (marketingPower * (1 + labelMarketing) + song.hype / 45) * (1 - age / 14) * 2.2
    : 1

  // Release-window discovery burst: even unknown producers get found by a few
  // hundred listeners at launch — quality decides how many stick around.
  const discovery = age < 12
    ? Math.pow(song.quality, 1.6) * 0.5 * (1 - age / 12) * (1 + marketingPower * 2.5 + song.hype / 60)
    : 0

  // Long-tail decay: songs fade but never die completely (catalog value)
  const decay = 0.18 + 0.82 * Math.exp(-age / (18 + song.quality * 0.7))

  // Playlists (active placements only)
  let playlistMult = 1
  for (const p of song.playlists) {
    if (s.day - p.addedDay < 60) playlistMult *= p.multiplier
  }

  const labelMult = song.releaseChannel === 'Major Label' ? 1.6
    : song.releaseChannel === 'Medium Label' ? 1.3
    : song.releaseChannel === 'Small Label' ? 1.15 : 1

  const collabMult = song.collabBoost || 1
  const viralMult = song.viral && s.day - song.viral.startDay < song.viral.duration ? song.viral.multiplier : 1
  const luck = rand(0.7, 1.35)
  const prestigeMult = 1 + s.prestige.streamBonus

  let daily = (coreReach * qualityMult * launchBoost * decay + discovery) * trend * genreBase
    * playlistMult * labelMult * collabMult * viralMult * luck * prestigeMult

  // Superfans give every release a stable floor
  const releasedCount = Math.max(1, s.songs.filter(x => x.status === 'released').length)
  daily += (s.superfans * 1.5) / releasedCount * Math.min(1, song.quality / 60)

  // ── Viral roll ──
  let viralTriggered: { type: string } | null = null
  if (viralMult === 1 && song.quality >= 55) {
    const freshness = age < 30 ? 1 : age < 90 ? 0.4 : 0.1
    const p = 0.0012 * Math.pow(song.quality / 70, 3) * (1 + song.hype / 60) * freshness * trend
    if (chance(Math.min(0.03, p))) {
      const total = VIRAL_TYPES.reduce((a, v) => a + v.weight, 0)
      let roll = Math.random() * total
      let picked = VIRAL_TYPES[0]
      for (const v of VIRAL_TYPES) { roll -= v.weight; if (roll <= 0) { picked = v; break } }
      viralTriggered = { type: picked.type }
    }
  }

  // ── Organic playlist roll ──
  let playlistAdded: string | null = null
  if (age < 45 && song.playlists.length < 4 && chance(0.5)) {
    const playlistBonus = song.labelName && contract ? contract.offer.playlistBonus : 0
    for (const pl of PLAYLISTS) {
      if (song.quality < pl.minQuality) continue
      if (song.playlists.some(x => x.name === pl.name)) continue
      const p = pl.baseChance * (0.3 + song.hype / 80) * (1 + playlistBonus) * (age < 7 ? 1.6 : 0.5)
      if (chance(p)) { playlistAdded = pl.name; break }
    }
  }

  return { streams: Math.max(0, Math.round(daily)), viralTriggered, playlistAdded }
}

export function pickViralMultiplier(type: string): { multiplier: number; duration: number } {
  const def = VIRAL_TYPES.find(v => v.type === type) ?? VIRAL_TYPES[0]
  return { multiplier: randInt(def.mult[0], def.mult[1]), duration: randInt(3, 9) }
}

export function playlistMultiplierFor(name: string): number {
  return PLAYLISTS.find(p => p.name === name)?.multiplier ?? 1.3
}

/** Royalty per stream, including contract split, collab split and prestige bonus. */
export function royaltyFor(s: GameState, song: Song, streams: number): number {
  const rate = 0.003 * rand(0.85, 1.15)
  const contractSplit = song.labelName && s.activeContract ? s.activeContract.offer.royaltySplit : 1
  const collabKeep = 1 - (song.collabSplit || 0)
  return streams * rate * contractSplit * collabKeep * (1 + s.prestige.royaltyBonus)
}
