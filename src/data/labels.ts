import type { LabelOffer, ReleaseChannel } from '../types'
import { randInt, pick } from './names'

export const LABEL_NAMES: Record<Exclude<ReleaseChannel, 'Independent'>, string[]> = {
  'Small Label': ['Nightwave Records', 'Neon Sound', 'Basement Trax', 'Velvet Room Records'],
  'Medium Label': ['Pulse Music', 'Atlas Records', 'Meridian Sound Co.', 'Skyline Recordings'],
  'Major Label': ['Nova Music Group', 'Titan Records', 'Empire Global Music', 'Stratosphere Entertainment'],
}

export const LABEL_REQUIREMENTS: Record<Exclude<ReleaseChannel, 'Independent'>, number> = {
  'Small Label': 50,
  'Medium Label': 250,
  'Major Label': 1200,
}

let offerCounter = 0

export function generateLabelOffer(tier: Exclude<ReleaseChannel, 'Independent'>, reputation: number): LabelOffer {
  offerCounter++
  const scale = tier === 'Small Label' ? 1 : tier === 'Medium Label' ? 8 : 60
  const repFactor = 1 + Math.min(reputation / 2000, 2)
  return {
    id: `offer-${Date.now()}-${offerCounter}`,
    labelName: pick(LABEL_NAMES[tier]),
    tier,
    advance: Math.round(randInt(3000, 6000) * scale * repFactor / 100) * 100,
    royaltySplit: tier === 'Small Label' ? randInt(55, 70) / 100 : tier === 'Medium Label' ? randInt(45, 60) / 100 : randInt(35, 50) / 100,
    requiredReleases: tier === 'Small Label' ? randInt(2, 3) : tier === 'Medium Label' ? randInt(3, 5) : randInt(4, 6),
    marketingBonus: tier === 'Small Label' ? randInt(15, 30) / 100 : tier === 'Medium Label' ? randInt(30, 55) / 100 : randInt(55, 90) / 100,
    playlistBonus: tier === 'Small Label' ? randInt(10, 20) / 100 : tier === 'Medium Label' ? randInt(20, 35) / 100 : randInt(35, 60) / 100,
    lengthDays: randInt(180, 540),
    minReputation: LABEL_REQUIREMENTS[tier],
  }
}
