import type { OpportunityDef } from '../types'
import { genArtistName, pick, randInt } from './names'

interface OppTemplate {
  kind: string
  title: (n: string) => string
  desc: (n: string) => string
  reward: [number, number]
  xp: [number, number]
  reputation: [number, number]
  energyCost: number
  risk: number
  minLevel: number
}

const TEMPLATES: OppTemplate[] = [
  { kind: 'beat', title: n => `${n} wants a beat`, desc: n => `Local rapper ${n} heard your work and wants a custom beat for their next mixtape.`, reward: [150, 800], xp: [40, 120], reputation: [3, 10], energyCost: 20, risk: 0.05, minLevel: 1 },
  { kind: 'production', title: n => `${n} wants production`, desc: n => `Singer ${n} is looking for a producer for their new single. Deliver a polished instrumental.`, reward: [400, 2500], xp: [80, 200], reputation: [5, 18], energyCost: 25, risk: 0.1, minLevel: 3 },
  { kind: 'remix', title: n => `Label wants a remix of ${n}`, desc: n => `A label wants you to remix "${n}" for an upcoming remix EP.`, reward: [800, 5000], xp: [120, 300], reputation: [10, 30], energyCost: 25, risk: 0.12, minLevel: 5 },
  { kind: 'ghost', title: () => 'Ghost production gig', desc: () => 'A touring DJ needs a festival-ready track. Your name stays off it, but the pay is excellent.', reward: [3000, 15000], xp: [100, 220], reputation: [0, 5], energyCost: 30, risk: 0.15, minLevel: 10 },
  { kind: 'collab', title: n => `DJ ${n} wants a collab`, desc: n => `${n} wants to co-produce a club track and split the credits.`, reward: [500, 3000], xp: [150, 350], reputation: [15, 40], energyCost: 25, risk: 0.12, minLevel: 8 },
  { kind: 'brand', title: () => 'Brand sponsorship offer', desc: () => 'A headphone brand wants a sponsored studio video featuring their gear.', reward: [2000, 12000], xp: [60, 150], reputation: [8, 25], energyCost: 15, risk: 0.08, minLevel: 12 },
  { kind: 'festival', title: () => 'Festival performance slot', desc: () => 'A festival wants you on the lineup. Big exposure, demanding show.', reward: [5000, 40000], xp: [300, 700], reputation: [40, 120], energyCost: 40, risk: 0.18, minLevel: 18 },
  { kind: 'tutorial', title: () => 'YouTube tutorial request', desc: () => 'A production channel wants you to break down your workflow on camera.', reward: [300, 1500], xp: [50, 120], reputation: [5, 15], energyCost: 12, risk: 0.03, minLevel: 4 },
  { kind: 'samplepack', title: () => 'Sample pack commission', desc: () => 'A sample company wants a signature pack with your sound.', reward: [1500, 8000], xp: [90, 200], reputation: [10, 30], energyCost: 25, risk: 0.08, minLevel: 7 },
  { kind: 'session', title: n => `Studio session with ${n}`, desc: n => `${n} booked studio time and wants you behind the desk.`, reward: [250, 1200], xp: [60, 140], reputation: [4, 12], energyCost: 20, risk: 0.05, minLevel: 2 },
  { kind: 'sync', title: () => 'Sync licensing pitch', desc: () => 'A TV production company is scouting tracks for a streaming series.', reward: [4000, 25000], xp: [150, 350], reputation: [20, 60], energyCost: 15, risk: 0.25, minLevel: 15 },
]

let oppCounter = 0

export function generateOpportunity(level: number, day: number): OpportunityDef {
  oppCounter++
  const eligible = TEMPLATES.filter(t => t.minLevel <= level)
  const t = pick(eligible)
  const name = genArtistName()
  const lvlScale = 1 + level * 0.12
  return {
    id: `opp-${day}-${oppCounter}`,
    kind: t.kind,
    title: t.title(name),
    desc: t.desc(name),
    reward: Math.round(randInt(t.reward[0], t.reward[1]) * lvlScale / 10) * 10,
    xp: randInt(t.xp[0], t.xp[1]),
    reputation: randInt(t.reputation[0], t.reputation[1]),
    energyCost: t.energyCost,
    risk: t.risk,
    minLevel: t.minLevel,
    expiresDay: day + randInt(4, 10),
  }
}
