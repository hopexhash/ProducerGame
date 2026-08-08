export interface LevelDef {
  level: number
  title: string
  unlocks: string[]
}

const TITLES: Record<number, string> = {
  1: 'Bedroom Producer',
  2: 'Hobbyist Producer',
  3: 'Local Producer',
  4: 'Demo Maker',
  5: 'Rising Talent',
  6: 'Beat Maker',
  7: 'Studio Regular',
  8: 'Track Builder',
  9: 'Sound Designer',
  10: 'Underground Producer',
  11: 'Club Producer',
  12: 'Scene Producer',
  13: 'Groove Architect',
  14: 'Rising Producer',
  15: 'Buzzing Producer',
  16: 'Radio-Ready Producer',
  17: 'Certified Beat Maker',
  18: 'Signed Producer',
  19: 'Touring Producer',
  20: 'Professional Producer',
  21: 'Chart Contender',
  22: 'Studio Veteran',
  23: 'Sound Innovator',
  24: 'Hit Crafter',
  25: 'Industry Producer',
  26: 'A-List Collaborator',
  27: 'Festival Producer',
  28: 'Award Nominee',
  29: 'Certified Hitmaker',
  30: 'Gold Producer',
  31: 'International Producer',
  32: 'Headline Producer',
  33: 'Studio Mogul',
  34: 'Genre Definer',
  35: 'Platinum Producer',
  36: 'Multi-Platinum Producer',
  37: 'World-Class Producer',
  38: 'Visionary Producer',
  39: 'Icon In The Making',
  40: 'Superstar Producer',
  41: 'Diamond Producer',
  42: 'Stadium Producer',
  43: 'Cultural Force',
  44: 'Era-Defining Producer',
  45: 'Global Producer',
  46: 'Living Legend',
  47: 'Sound Immortal',
  48: 'Hall of Fame Producer',
  49: 'Mythic Producer',
  50: 'Legendary Producer',
}

const UNLOCKS: Record<number, string[]> = {
  2: ['Social media posting'],
  3: ['Career opportunities'],
  4: ['Hype campaigns'],
  5: ['Small label offers', 'Plugin store expands'],
  8: ['Collaborations with local artists'],
  10: ['Medium label offers', 'Ghost production gigs'],
  12: ['Playlist pitching'],
  15: ['Rising artist collaborations'],
  18: ['Festival opportunities'],
  20: ['Major label offers'],
  25: ['Established artist collaborations'],
  30: ['Superstar collaborations'],
  35: ['Luxury studio upgrades'],
  40: ['Global superstar collaborations'],
  50: ['PRESTIGE MODE'],
}

export const LEVELS: LevelDef[] = Array.from({ length: 60 }, (_, i) => {
  const level = i + 1
  return {
    level,
    title: TITLES[level] ?? (level < 50 ? `Elite Producer ${level}` : 'Legendary Producer'),
    unlocks: UNLOCKS[level] ?? [],
  }
})

/** XP needed to advance FROM this level to the next. */
export function xpForLevel(level: number): number {
  const base = 120 * Math.pow(level, 1.85)
  // past Legendary (50), each level gets dramatically harder
  const post50 = level > 50 ? Math.pow(1.35, level - 50) : 1
  return Math.round(base * post50)
}

export function titleForLevel(level: number): string {
  const capped = Math.min(level, 50)
  return TITLES[capped] ?? 'Legendary Producer'
}
