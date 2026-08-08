import type { ChartEntry, GameState } from '../types'
import { GENRES } from '../data/genres'
import { genArtistName, genSongName, pick, rand } from '../data/names'

/** Build this week's global Top 100: NPC songs + player songs ranked by weekly streams. */
export function buildChart(s: GameState): ChartEntry[] {
  // NPC competition scales with player progression so charts stay reachable but not trivial
  const playerWeeklyBest = s.songs.reduce((m, song) => {
    const weekly = song.streamHistory.slice(-7).reduce((a, b) => a + b, 0)
    return Math.max(m, weekly)
  }, 0)
  const levelBase = 200_000 + Math.pow(s.level, 2.7) * 4000
  // NPC top hovers around the player's best weekly — sometimes beatable, sometimes not
  const topStreams = Math.max(levelBase, playerWeeklyBest * rand(0.55, 1.7))

  const npcs: ChartEntry[] = Array.from({ length: 100 }, (_, i) => ({
    title: genSongName(),
    artist: genArtistName(),
    genre: pick(GENRES),
    weeklyStreams: Math.round(topStreams * Math.pow(1 / (i + 1), 0.85) * rand(0.7, 1.3)),
    isPlayer: false,
    songId: null,
  }))

  const playerEntries: ChartEntry[] = s.songs
    .filter(song => song.status === 'released')
    .map(song => ({
      title: song.title,
      artist: s.producerName,
      genre: song.genre,
      weeklyStreams: song.streamHistory.slice(-7).reduce((a, b) => a + b, 0),
      isPlayer: true,
      songId: song.id,
    }))
    .filter(e => e.weeklyStreams > 100)

  return [...npcs, ...playerEntries]
    .sort((a, b) => b.weeklyStreams - a.weeklyStreams)
    .slice(0, 100)
}

export function chartRewards(position: number): { xp: number; reputation: number } {
  if (position === 1) return { xp: 1500, reputation: 300 }
  if (position <= 5) return { xp: 800, reputation: 150 }
  if (position <= 10) return { xp: 500, reputation: 90 }
  if (position <= 50) return { xp: 250, reputation: 40 }
  return { xp: 100, reputation: 15 }
}
