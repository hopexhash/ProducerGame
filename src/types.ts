// ─── Core data models for Producer Life ───────────────────────────────

export type Genre =
  | 'Afro House' | 'Tech House' | 'Deep House' | 'Melodic Techno'
  | 'Hip-Hop' | 'Trap' | 'Drum & Bass' | 'Pop'
  | 'Amapiano' | 'Phonk' | 'R&B' | 'EDM'

export type SongType = 'Single' | 'EP Track' | 'Club Track' | 'Radio Edit' | 'Remix'

export type SongStatus = 'unreleased' | 'released'

export type ReleaseChannel = 'Independent' | 'Small Label' | 'Medium Label' | 'Major Label'

export interface Skills {
  production: number
  mixing: number
  mastering: number
  songwriting: number
  networking: number
  marketing: number
}

export interface SubScores {
  production: number
  mix: number
  master: number
  songwriting: number
}

export interface PlaylistPlacement {
  name: string
  multiplier: number
  addedDay: number
}

export interface ViralEvent {
  type: string
  multiplier: number
  startDay: number
  duration: number
}

export interface Song {
  id: string
  title: string
  genre: Genre
  bpm: number
  key: string
  type: SongType
  quality: number
  subScores: SubScores
  status: SongStatus
  createdDay: number
  releaseDay: number | null
  releaseChannel: ReleaseChannel | null
  labelName: string | null
  streams: number
  dailyStreams: number
  streamHistory: number[]  // last 30 days
  revenue: number
  chartPeak: number | null
  marketingBudget: number
  hype: number
  playlists: PlaylistPlacement[]
  viral: ViralEvent | null
  wasViral: boolean
  collabArtist: string | null
  collabSplit: number      // fraction of revenue given away
  collabBoost: number      // stream multiplier from collab
  coverHue: number
  certification: 'None' | 'Gold' | 'Platinum' | 'Diamond'
}

export interface Equipment {
  id: string
  name: string
  category: string
  cost: number
  bonuses: Partial<Skills> & { creativity?: number; energyMax?: number; quality?: number }
  tier: number
  desc: string
}

export interface Plugin {
  id: string
  name: string
  cost: number
  bonuses: Partial<Skills> & { creativity?: number }
  desc: string
}

export interface OpportunityDef {
  id: string
  title: string
  desc: string
  reward: number
  xp: number
  reputation: number
  energyCost: number
  risk: number          // 0-1 chance of failure
  minLevel: number
  expiresDay: number
  kind: string
}

export interface CollabArtist {
  id: string
  name: string
  genre: Genre
  fameLevel: string
  followers: number
  cost: number
  split: number
  minReputation: number
  exposure: string
  boost: number
}

export interface LabelOffer {
  id: string
  labelName: string
  tier: ReleaseChannel
  advance: number
  royaltySplit: number      // fraction the PLAYER keeps
  requiredReleases: number
  marketingBonus: number
  playlistBonus: number
  lengthDays: number
  minReputation: number
}

export interface ActiveContract {
  offer: LabelOffer
  releasesDone: number
  signedDay: number
}

export interface ChartEntry {
  title: string
  artist: string
  genre: Genre
  weeklyStreams: number
  isPlayer: boolean
  songId: string | null
}

export interface NewsItem {
  day: number
  text: string
  personal: boolean
}

export interface AchievementDef {
  id: string
  name: string
  desc: string
  check: (s: GameState) => boolean
  xp: number
}

export interface AwardDef {
  id: string
  name: string
  desc: string
  icon: string
}

export interface DailyTask {
  id: string
  desc: string
  target: number
  progress: number
  done: boolean
  rewardXp: number
  rewardMoney: number
}

export interface Toast {
  id: number
  text: string
  kind: 'stream' | 'money' | 'xp' | 'follower' | 'info' | 'success' | 'warn' | 'levelup'
}

export interface GameEventChoice {
  label: string
  outcome: string
  effect: { money?: number; xp?: number; reputation?: number; energy?: number; creativity?: number }
}

export interface ActiveGameEvent {
  id: string
  title: string
  desc: string
  choices: GameEventChoice[]
}

export interface PrestigeState {
  count: number
  streamBonus: number
  xpBonus: number
  creativityBonus: number
  royaltyBonus: number
}

export interface HistoryPoint {
  day: number
  streams: number
  money: number
  followers: number
  listeners: number
}

export interface GameState {
  version: number
  started: boolean
  tutorialStep: number   // 0..5, 6 = done

  // identity
  producerName: string
  age: number
  ageDays: number
  homeCity: string
  favoriteGenre: Genre

  // time
  day: number            // absolute day counter, day 0 = Jan 1, Year 1

  // core stats
  level: number
  xp: number
  money: number
  reputation: number
  energy: number
  energyMax: number
  creativity: number

  skills: Skills

  // audience
  followers: number
  monthlyListeners: number
  superfans: number
  totalStreams: number
  streamsToday: number
  hype: number

  // content
  songs: Song[]
  songCounter: number

  // ownership
  equipmentOwned: string[]
  pluginsOwned: string[]

  // market
  genreTrends: Record<Genre, number>
  genreFamiliarity: Record<Genre, number>

  // career
  opportunities: OpportunityDef[]
  labelOffers: LabelOffer[]
  activeContract: ActiveContract | null
  collabPool: CollabArtist[]

  // charts & news
  chart: ChartEntry[]
  chartWeek: number
  news: NewsItem[]

  // meta progression
  achievementsUnlocked: string[]
  awardsUnlocked: string[]
  dailyTasks: DailyTask[]
  prestige: PrestigeState

  // analytics
  history: HistoryPoint[]
  countryWeights: Record<string, number>

  // transient UI queues (persisted harmlessly)
  toasts: Toast[]
  toastCounter: number
  pendingLevelUp: { level: number; title: string; unlocks: string[] } | null
  pendingViral: { songTitle: string; type: string; streams: number } | null
  activeEvent: ActiveGameEvent | null
  pendingAchievements: string[]
}
