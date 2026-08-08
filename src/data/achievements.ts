import type { AchievementDef, AwardDef, GameState } from '../types'

const released = (s: GameState) => s.songs.filter(x => x.status === 'released')

export const ACHIEVEMENTS: AchievementDef[] = [
  { id: 'bedroom-beginnings', name: 'Bedroom Beginnings', desc: 'Create your first track', xp: 50, check: s => s.songs.length >= 1 },
  { id: 'first-release', name: 'First Release', desc: 'Release your first song', xp: 100, check: s => released(s).length >= 1 },
  { id: 'songs-5', name: 'Finding Your Sound', desc: 'Release 5 songs', xp: 200, check: s => released(s).length >= 5 },
  { id: 'songs-10', name: 'Catalog Builder', desc: 'Release 10 songs', xp: 400, check: s => released(s).length >= 10 },
  { id: 'songs-25', name: 'Prolific', desc: 'Release 25 songs', xp: 800, check: s => released(s).length >= 25 },
  { id: 'songs-50', name: 'Workhorse', desc: 'Release 50 songs', xp: 1500, check: s => released(s).length >= 50 },
  { id: 'songs-100', name: 'Century Club', desc: 'Release 100 songs', xp: 4000, check: s => released(s).length >= 100 },
  { id: 'streams-1k', name: 'First 1,000 Streams', desc: 'Reach 1,000 total streams', xp: 60, check: s => s.totalStreams >= 1_000 },
  { id: 'streams-10k', name: 'Getting Heard', desc: 'Reach 10,000 total streams', xp: 120, check: s => s.totalStreams >= 10_000 },
  { id: 'streams-100k', name: 'First 100,000 Streams', desc: 'Reach 100,000 total streams', xp: 300, check: s => s.totalStreams >= 100_000 },
  { id: 'streams-1m', name: '1M Streams', desc: 'Reach 1 million total streams', xp: 800, check: s => s.totalStreams >= 1_000_000 },
  { id: 'streams-10m', name: '10M Streams', desc: 'Reach 10 million total streams', xp: 2000, check: s => s.totalStreams >= 10_000_000 },
  { id: 'streams-100m', name: '100M Streams', desc: 'Reach 100 million total streams', xp: 5000, check: s => s.totalStreams >= 100_000_000 },
  { id: 'streams-1b', name: '1B Streams', desc: 'Reach 1 BILLION total streams', xp: 15000, check: s => s.totalStreams >= 1_000_000_000 },
  { id: 'streams-10b', name: 'Streaming Deity', desc: 'Reach 10 billion total streams', xp: 50000, check: s => s.totalStreams >= 10_000_000_000 },
  { id: 'money-1k', name: 'First Paycheck', desc: 'Hold $1,000', xp: 60, check: s => s.money >= 1_000 },
  { id: 'money-10k', name: 'Five Figures', desc: 'Hold $10,000', xp: 150, check: s => s.money >= 10_000 },
  { id: 'money-100k', name: 'Six Figures', desc: 'Hold $100,000', xp: 500, check: s => s.money >= 100_000 },
  { id: 'money-1m', name: 'Millionaire Producer', desc: 'Hold $1,000,000', xp: 2000, check: s => s.money >= 1_000_000 },
  { id: 'money-10m', name: 'Music Mogul', desc: 'Hold $10,000,000', xp: 8000, check: s => s.money >= 10_000_000 },
  { id: 'level-5', name: 'Rising Talent', desc: 'Reach level 5', xp: 100, check: s => s.level >= 5 },
  { id: 'level-10', name: 'Underground King', desc: 'Reach level 10', xp: 250, check: s => s.level >= 10 },
  { id: 'level-20', name: 'True Professional', desc: 'Reach level 20', xp: 600, check: s => s.level >= 20 },
  { id: 'level-30', name: 'Gold Standard', desc: 'Reach level 30', xp: 1500, check: s => s.level >= 30 },
  { id: 'level-40', name: 'Superstardom', desc: 'Reach level 40', xp: 3500, check: s => s.level >= 40 },
  { id: 'level-50', name: 'Legendary Status', desc: 'Reach level 50', xp: 10000, check: s => s.level >= 50 },
  { id: 'quality-70', name: 'Professional Sound', desc: 'Create a song rated 70+', xp: 200, check: s => s.songs.some(x => x.quality >= 70) },
  { id: 'quality-85', name: 'Excellence', desc: 'Create a song rated 85+', xp: 500, check: s => s.songs.some(x => x.quality >= 85) },
  { id: 'quality-95', name: 'Masterpiece', desc: 'Create a song rated 95+', xp: 2000, check: s => s.songs.some(x => x.quality >= 95) },
  { id: 'viral-1', name: 'Gone Viral', desc: 'Have a song go viral', xp: 400, check: s => s.songs.some(x => x.wasViral) },
  { id: 'viral-5', name: 'Viral Machine', desc: 'Have 5 songs go viral', xp: 1500, check: s => s.songs.filter(x => x.wasViral).length >= 5 },
  { id: 'followers-1k', name: 'First Thousand Fans', desc: 'Reach 1,000 followers', xp: 100, check: s => s.followers >= 1_000 },
  { id: 'followers-100k', name: 'Fanbase', desc: 'Reach 100,000 followers', xp: 500, check: s => s.followers >= 100_000 },
  { id: 'followers-1m', name: 'Million Strong', desc: 'Reach 1,000,000 followers', xp: 2000, check: s => s.followers >= 1_000_000 },
  { id: 'followers-10m', name: 'Global Icon', desc: 'Reach 10,000,000 followers', xp: 6000, check: s => s.followers >= 10_000_000 },
  { id: 'listeners-1m', name: 'Monthly Million', desc: 'Reach 1M monthly listeners', xp: 1500, check: s => s.monthlyListeners >= 1_000_000 },
  { id: 'gold-record', name: 'First Gold', desc: 'Earn a Gold record (500K streams on one song)', xp: 600, check: s => s.songs.some(x => x.streams >= 500_000) },
  { id: 'platinum-record', name: 'First Platinum', desc: 'Earn a Platinum record (5M streams on one song)', xp: 1500, check: s => s.songs.some(x => x.streams >= 5_000_000) },
  { id: 'diamond-record', name: 'Diamond Status', desc: 'Earn a Diamond record (100M streams on one song)', xp: 6000, check: s => s.songs.some(x => x.streams >= 100_000_000) },
  { id: 'chart-100', name: 'Chart Debut', desc: 'Enter the Top 100', xp: 300, check: s => s.songs.some(x => x.chartPeak !== null && x.chartPeak <= 100) },
  { id: 'chart-10', name: 'Top 10 Hit', desc: 'Reach the Top 10', xp: 1200, check: s => s.songs.some(x => x.chartPeak !== null && x.chartPeak <= 10) },
  { id: 'chart-1', name: 'Global #1', desc: 'Reach #1 on the global chart', xp: 3000, check: s => s.songs.some(x => x.chartPeak === 1) },
  { id: 'label-signed', name: 'Signed', desc: 'Sign a label contract', xp: 400, check: s => s.activeContract !== null || s.awardsUnlocked.includes('major-deal') },
  { id: 'major-deal', name: 'Major Label Deal', desc: 'Sign with a major label', xp: 1500, check: s => s.activeContract?.offer.tier === 'Major Label' },
  { id: 'playlist-1', name: 'Playlisted', desc: 'Get a song added to a playlist', xp: 200, check: s => s.songs.some(x => x.playlists.length > 0) },
  { id: 'playlist-viral50', name: 'Viral 50', desc: 'Get a song on the Viral 50 playlist', xp: 800, check: s => s.songs.some(x => x.playlists.some(p => p.name === 'Viral 50')) },
  { id: 'collab-1', name: 'Better Together', desc: 'Complete a collaboration', xp: 300, check: s => s.songs.some(x => x.collabArtist !== null) },
  { id: 'superfans-1k', name: 'Cult Following', desc: 'Gain 1,000 superfans', xp: 500, check: s => s.superfans >= 1_000 },
  { id: 'superfans-100k', name: 'Devoted Army', desc: 'Gain 100,000 superfans', xp: 2500, check: s => s.superfans >= 100_000 },
  { id: 'gear-5', name: 'Gear Head', desc: 'Own 5 pieces of studio equipment', xp: 250, check: s => s.equipmentOwned.length >= 5 },
  { id: 'studio-mogul', name: 'Studio Mogul', desc: 'Own the Luxury Producer Studio', xp: 3000, check: s => s.equipmentOwned.includes('studio2') },
  { id: 'plugins-6', name: 'Plugin Collector', desc: 'Own 6 plugins', xp: 300, check: s => s.pluginsOwned.length >= 6 },
  { id: 'skill-max', name: 'Perfected Craft', desc: 'Max any skill to 100', xp: 2000, check: s => Object.values(s.skills).some(v => v >= 100) },
  { id: 'year-1', name: 'One Year In', desc: 'Survive your first year in the industry', xp: 400, check: s => s.day >= 360 },
  { id: 'prestige-1', name: 'Reborn', desc: 'Prestige for the first time', xp: 5000, check: s => s.prestige.count >= 1 },
]

export const AWARDS: AwardDef[] = [
  { id: 'first-1k', name: 'First 1,000 Streams', desc: 'Every legend starts somewhere.', icon: '🎧' },
  { id: 'first-100k', name: 'First 100,000 Streams', desc: 'The world is starting to listen.', icon: '📈' },
  { id: 'first-1m', name: 'First 1 Million Streams', desc: 'Seven figures of sound.', icon: '🏅' },
  { id: 'first-10m', name: 'First 10 Million Streams', desc: 'A force in the industry.', icon: '🌟' },
  { id: 'first-100m', name: 'First 100 Million Streams', desc: 'Undeniable.', icon: '💫' },
  { id: 'first-1b', name: '1 Billion Total Streams', desc: 'A billion moments soundtracked by you.', icon: '👑' },
  { id: 'gold', name: 'First Gold Record', desc: '500,000 streams on a single track.', icon: '🥇' },
  { id: 'platinum', name: 'First Platinum Record', desc: '5,000,000 streams on a single track.', icon: '💿' },
  { id: 'diamond', name: 'First Diamond Record', desc: '100,000,000 streams on a single track.', icon: '💎' },
  { id: 'number-one', name: 'First #1 Song', desc: 'Top of the world.', icon: '🏆' },
  { id: 'major-deal', name: 'Major Label Deal', desc: 'The big leagues came calling.', icon: '✒️' },
  { id: 'producer-of-year', name: 'Producer of the Year', desc: 'Reach level 30 with 50M+ streams.', icon: '🎖️' },
  { id: 'golden-wave', name: 'Golden Wave Award', desc: 'The industry\'s highest honor: level 40 with 500M+ streams.', icon: '🌊' },
  { id: 'legend', name: 'Living Legend', desc: 'Reach Level 50 — Legendary Producer.', icon: '🔱' },
]

export function checkAwards(s: GameState): string[] {
  const newly: string[] = []
  const has = (id: string) => s.awardsUnlocked.includes(id) || newly.includes(id)
  const grant = (id: string, cond: boolean) => { if (cond && !has(id)) newly.push(id) }
  const maxSong = s.songs.reduce((m, x) => Math.max(m, x.streams), 0)
  grant('first-1k', s.totalStreams >= 1_000)
  grant('first-100k', s.totalStreams >= 100_000)
  grant('first-1m', s.totalStreams >= 1_000_000)
  grant('first-10m', s.totalStreams >= 10_000_000)
  grant('first-100m', s.totalStreams >= 100_000_000)
  grant('first-1b', s.totalStreams >= 1_000_000_000)
  grant('gold', maxSong >= 500_000)
  grant('platinum', maxSong >= 5_000_000)
  grant('diamond', maxSong >= 100_000_000)
  grant('number-one', s.songs.some(x => x.chartPeak === 1))
  grant('major-deal', s.activeContract?.offer.tier === 'Major Label')
  grant('producer-of-year', s.level >= 30 && s.totalStreams >= 50_000_000)
  grant('golden-wave', s.level >= 40 && s.totalStreams >= 500_000_000)
  grant('legend', s.level >= 50)
  return newly
}
