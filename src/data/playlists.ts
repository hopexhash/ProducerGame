export interface PlaylistDef {
  name: string
  multiplier: number
  minQuality: number
  baseChance: number
}

export const PLAYLISTS: PlaylistDef[] = [
  { name: 'Fresh Finds', multiplier: 1.3, minQuality: 45, baseChance: 0.10 },
  { name: 'Dance Rising', multiplier: 1.5, minQuality: 55, baseChance: 0.07 },
  { name: 'Electronic Hits', multiplier: 1.8, minQuality: 65, baseChance: 0.05 },
  { name: 'New Music Friday', multiplier: 2.0, minQuality: 70, baseChance: 0.04 },
  { name: 'Viral 50', multiplier: 2.6, minQuality: 75, baseChance: 0.025 },
  { name: 'Global Dance', multiplier: 2.2, minQuality: 72, baseChance: 0.03 },
  { name: 'Top Hits', multiplier: 3.2, minQuality: 82, baseChance: 0.015 },
]

export const VIRAL_TYPES = [
  { type: 'TikTok Viral', weight: 25, mult: [5, 25] },
  { type: 'Spotify Algorithm Push', weight: 20, mult: [2, 6] },
  { type: 'DJ Support', weight: 15, mult: [2, 5] },
  { type: 'Influencer Uses Song', weight: 12, mult: [3, 10] },
  { type: 'Festival DJ Plays Song', weight: 8, mult: [3, 8] },
  { type: 'YouTube Upload Explodes', weight: 8, mult: [4, 12] },
  { type: 'Instagram Reel Trend', weight: 8, mult: [3, 15] },
  { type: 'Celebrity Shares Song', weight: 4, mult: [10, 50] },
]
