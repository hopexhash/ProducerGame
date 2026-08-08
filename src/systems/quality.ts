import type { GameState, Genre, Skills, SubScores } from '../types'
import { EQUIPMENT } from '../data/equipment'
import { PLUGINS } from '../data/plugins'
import { rand } from '../data/names'

export interface GearBonuses extends Skills {
  creativity: number
  energyMax: number
  quality: number
}

export function gearBonuses(s: GameState): GearBonuses {
  const b: GearBonuses = { production: 0, mixing: 0, mastering: 0, songwriting: 0, networking: 0, marketing: 0, creativity: 0, energyMax: 0, quality: 0 }
  for (const id of s.equipmentOwned) {
    const eq = EQUIPMENT.find(e => e.id === id)
    if (!eq) continue
    for (const [k, v] of Object.entries(eq.bonuses)) (b as unknown as Record<string, number>)[k] += v
  }
  for (const id of s.pluginsOwned) {
    const pl = PLUGINS.find(p => p.id === id)
    if (!pl) continue
    for (const [k, v] of Object.entries(pl.bonuses)) (b as unknown as Record<string, number>)[k] += v
  }
  return b
}

/** Skill value including gear, capped at 100. */
export function effectiveSkill(s: GameState, skill: keyof Skills): number {
  return Math.min(100, s.skills[skill] + gearBonuses(s)[skill])
}

export function computeQuality(s: GameState, genre: Genre, daysSpent: number): { quality: number; subScores: SubScores } {
  const gear = gearBonuses(s)
  const energyFactor = 0.85 + 0.15 * (s.energy / s.energyMax)          // tired = sloppy
  const creativity = Math.min(100, s.creativity + gear.creativity)
  const creativityFactor = 0.85 + 0.3 * (creativity / 100)
  const familiarity = s.genreFamiliarity[genre] ?? 0
  const familiarityFactor = 0.9 + 0.2 * Math.min(1, familiarity / 50)
  const timeFactor = 0.82 + 0.06 * Math.min(daysSpent, 6)              // more days, better song

  const sub = (skill: keyof Skills) => {
    const base = Math.min(100, s.skills[skill] + gear[skill])
    const luck = rand(0.85, 1.15)
    return Math.max(1, Math.min(100, Math.round(base * energyFactor * creativityFactor * familiarityFactor * timeFactor * luck)))
  }

  const subScores: SubScores = {
    production: sub('production'),
    mix: sub('mixing'),
    master: sub('mastering'),
    songwriting: sub('songwriting'),
  }

  const weighted =
    subScores.production * 0.35 +
    subScores.mix * 0.25 +
    subScores.master * 0.15 +
    subScores.songwriting * 0.25

  const quality = Math.max(1, Math.min(100, Math.round(weighted + gear.quality + rand(-3, 3))))
  return { quality, subScores }
}
