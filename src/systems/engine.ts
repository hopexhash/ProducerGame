import type { DailyTask, GameState, Genre, Toast } from '../types'
import { GENRES } from '../data/genres'
import { titleForLevel, xpForLevel, LEVELS } from '../data/levels'
import { generateOpportunity } from '../data/opportunities'
import { generateLabelOffer, LABEL_REQUIREMENTS } from '../data/labels'
import { generateCollabPool } from '../data/artists'
import { rollRandomEvent, trendNews } from '../data/events'
import { genIndustryNews, chance, pick, rand } from '../data/names'
import { ACHIEVEMENTS, checkAwards } from '../data/achievements'
import { simulateSongDay, pickViralMultiplier, playlistMultiplierFor, royaltyFor } from './streaming'
import { buildChart, chartRewards } from './charts'
import { gearBonuses } from './quality'
import { fmt } from './format'

export const SAVE_VERSION = 1

export function rollTrends(): Record<Genre, number> {
  const trends = {} as Record<Genre, number>
  for (const g of GENRES) trends[g] = +rand(0.55, 1.7).toFixed(2)
  return trends
}

export function makeDailyTasks(s: GameState): DailyTask[] {
  const pool: DailyTask[] = [
    { id: 'produce', desc: 'Produce 1 track', target: 1, progress: 0, done: false, rewardXp: 80, rewardMoney: 100 },
    { id: 'streams', desc: `Gain ${fmt(Math.max(150, Math.round(s.totalStreams * 0.004)))} streams`, target: Math.max(150, Math.round(s.totalStreams * 0.004)), progress: 0, done: false, rewardXp: 60, rewardMoney: 50 },
    { id: 'social', desc: 'Post on social media', target: 1, progress: 0, done: false, rewardXp: 40, rewardMoney: 0 },
    { id: 'marketing', desc: 'Spend $1,000 on marketing', target: 1000, progress: 0, done: false, rewardXp: 70, rewardMoney: 0 },
    { id: 'opportunity', desc: 'Complete a career opportunity', target: 1, progress: 0, done: false, rewardXp: 90, rewardMoney: 150 },
    { id: 'release', desc: 'Release a song', target: 1, progress: 0, done: false, rewardXp: 100, rewardMoney: 100 },
  ]
  const picked: DailyTask[] = []
  while (picked.length < 3 && pool.length) {
    const i = Math.floor(Math.random() * pool.length)
    picked.push(pool.splice(i, 1)[0])
  }
  return picked
}

export function newGame(name: string, age: number, city: string, favoriteGenre: Genre, prestige?: GameState['prestige']): GameState {
  const familiarity = {} as Record<Genre, number>
  for (const g of GENRES) familiarity[g] = g === favoriteGenre ? 25 : 5
  const p = prestige ?? { count: 0, streamBonus: 0, xpBonus: 0, creativityBonus: 0, royaltyBonus: 0 }
  const state: GameState = {
    version: SAVE_VERSION,
    started: true,
    tutorialStep: 0,
    producerName: name,
    age,
    ageDays: 0,
    homeCity: city,
    favoriteGenre,
    day: 0,
    level: 1,
    xp: 0,
    money: 500,
    reputation: 0,
    energy: 100,
    energyMax: 100,
    creativity: Math.min(100, 50 + p.creativityBonus),
    skills: { production: 30, mixing: 26, mastering: 22, songwriting: 28, networking: 8, marketing: 8 },
    followers: 25,
    monthlyListeners: 0,
    superfans: 0,
    totalStreams: 0,
    streamsToday: 0,
    hype: 0,
    songs: [],
    songCounter: 0,
    equipmentOwned: [],
    pluginsOwned: [],
    genreTrends: rollTrends(),
    genreFamiliarity: familiarity,
    opportunities: [],
    labelOffers: [],
    activeContract: null,
    collabPool: generateCollabPool(0),
    chart: [],
    chartWeek: 0,
    news: [{ day: 0, text: 'Welcome to the industry. Nobody knows your name — yet.', personal: true }],
    achievementsUnlocked: [],
    awardsUnlocked: [],
    dailyTasks: [],
    prestige: p,
    history: [],
    countryWeights: {},
    toasts: [],
    toastCounter: 0,
    pendingLevelUp: null,
    pendingViral: null,
    activeEvent: null,
    pendingAchievements: [],
  }
  state.chart = buildChart(state)
  state.dailyTasks = makeDailyTasks(state)
  // Randomized country distribution for this career
  const countries = ['United States', 'Netherlands', 'Germany', 'United Kingdom', 'France', 'Turkey', 'Brazil', 'Spain', 'Australia', 'Italy']
  let remaining = 100
  for (let i = 0; i < countries.length; i++) {
    const w = i === countries.length - 1 ? remaining : Math.max(2, Math.round(remaining * rand(0.12, 0.3)))
    state.countryWeights[countries[i]] = Math.min(w, remaining)
    remaining -= state.countryWeights[countries[i]]
    if (remaining <= 0) remaining = 0
  }
  return state
}

export function pushToast(s: GameState, text: string, kind: Toast['kind'] = 'info'): void {
  s.toastCounter++
  s.toasts = [...s.toasts.slice(-5), { id: s.toastCounter, text, kind }]
}

export function pushNews(s: GameState, text: string, personal = false): void {
  s.news = [{ day: s.day, text, personal }, ...s.news].slice(0, 40)
}

export function grantXp(s: GameState, amount: number): void {
  const gained = Math.round(amount * (1 + s.prestige.xpBonus))
  s.xp += gained
  let needed = xpForLevel(s.level)
  while (s.xp >= needed) {
    s.xp -= needed
    s.level++
    const def = LEVELS.find(l => l.level === s.level)
    // stat bonuses on level up
    s.skills = { ...s.skills }
    const keys = ['production', 'mixing', 'mastering', 'songwriting', 'networking', 'marketing'] as const
    const k = pick([...keys])
    s.skills[k] = Math.min(100, s.skills[k] + 1)
    s.energy = effectiveEnergyMax(s)
    s.pendingLevelUp = {
      level: s.level,
      title: titleForLevel(s.level),
      unlocks: def?.unlocks ?? [],
    }
    pushNews(s, `You reached Level ${s.level}: ${titleForLevel(s.level)}.`, true)
    needed = xpForLevel(s.level)
  }
}

export function effectiveEnergyMax(s: GameState): number {
  return s.energyMax + gearBonuses(s).energyMax
}

export function taskProgress(s: GameState, id: string, amount: number): void {
  s.dailyTasks = s.dailyTasks.map(t => {
    if (t.id !== id || t.done) return t
    const progress = t.progress + amount
    if (progress >= t.target) {
      s.money += t.rewardMoney
      pushToast(s, `Daily task complete: ${t.desc} (+${t.rewardXp} XP${t.rewardMoney ? `, +$${t.rewardMoney}` : ''})`, 'success')
      grantXp(s, t.rewardXp)
      return { ...t, progress: t.target, done: true }
    }
    return { ...t, progress }
  })
}

export function checkAchievements(s: GameState): void {
  for (const a of ACHIEVEMENTS) {
    if (s.achievementsUnlocked.includes(a.id)) continue
    if (a.check(s)) {
      s.achievementsUnlocked = [...s.achievementsUnlocked, a.id]
      s.pendingAchievements = [...s.pendingAchievements, a.id]
      grantXp(s, a.xp)
    }
  }
  const newAwards = checkAwards(s)
  if (newAwards.length) {
    s.awardsUnlocked = [...s.awardsUnlocked, ...newAwards]
    for (const id of newAwards) pushNews(s, `Award unlocked: ${id.replace(/-/g, ' ')}.`, true)
  }
  // certifications
  s.songs = s.songs.map(song => {
    let cert = song.certification
    if (song.streams >= 100_000_000) cert = 'Diamond'
    else if (song.streams >= 5_000_000) cert = 'Platinum'
    else if (song.streams >= 500_000) cert = 'Gold'
    if (cert !== song.certification) {
      pushToast(s, `"${song.title}" is now certified ${cert}!`, 'levelup')
      pushNews(s, `Your track "${song.title}" was certified ${cert}.`, true)
      return { ...song, certification: cert }
    }
    return song
  })
}

/** Advance the world one day. The heart of the simulation. */
export function advanceDay(s: GameState): void {
  s.day++
  s.ageDays++
  if (s.ageDays >= 360) { s.ageDays = 0; s.age++ }

  let dayStreams = 0
  let dayRevenue = 0

  s.songs = s.songs.map(song => {
    if (song.status !== 'released') return song
    const result = simulateSongDay(s, song)
    const updated = { ...song }
    updated.dailyStreams = result.streams
    updated.streams += result.streams
    updated.streamHistory = [...song.streamHistory.slice(-29), result.streams]
    const rev = royaltyFor(s, updated, result.streams)
    updated.revenue += rev
    dayStreams += result.streams
    dayRevenue += rev

    if (result.viralTriggered) {
      const { multiplier, duration } = pickViralMultiplier(result.viralTriggered.type)
      updated.viral = { type: result.viralTriggered.type, multiplier, startDay: s.day, duration }
      updated.wasViral = true
      const projected = Math.round(result.streams * multiplier)
      s.pendingViral = { songTitle: updated.title, type: result.viralTriggered.type, streams: projected }
      pushNews(s, `"${updated.title}" is going viral — ${result.viralTriggered.type}!`, true)
    }
    if (result.playlistAdded) {
      updated.playlists = [...updated.playlists, { name: result.playlistAdded, multiplier: playlistMultiplierFor(result.playlistAdded), addedDay: s.day }]
      pushToast(s, `"${updated.title}" added to ${result.playlistAdded}!`, 'success')
      pushNews(s, `Your track "${updated.title}" entered ${result.playlistAdded}.`, true)
    }
    return updated
  })

  s.streamsToday = dayStreams
  s.totalStreams += dayStreams
  s.money += dayRevenue

  // audience growth — sublinear so the streams→followers→streams loop converges
  if (dayStreams > 0) {
    const newFollowers = Math.round(Math.pow(dayStreams, 0.8) * rand(0.012, 0.022) * (1 + s.skills.marketing / 200))
    s.followers += newFollowers
    s.superfans += Math.round(newFollowers * rand(0.01, 0.03))
    grantXp(s, Math.min(1200, Math.round(Math.pow(dayStreams, 0.55))))
    if (dayStreams >= 100) {
      pushToast(s, `+${fmt(dayStreams)} streams  ·  +$${fmt(dayRevenue)}`, 'stream')
    }
  }

  // monthly listeners = unique-ish share of last 30 days of streams
  const last30 = s.history.slice(-29).reduce((a, h) => a + h.streams, 0) + dayStreams
  s.monthlyListeners = Math.round(last30 * 0.55 + s.superfans)

  // energy & creativity regen
  s.energy = Math.min(effectiveEnergyMax(s), s.energy + 32)
  s.creativity = Math.min(100, s.creativity + 2 + Math.round(s.prestige.creativityBonus / 3))
  s.hype = Math.max(0, s.hype - 3)

  // opportunities: expire and spawn
  s.opportunities = s.opportunities.filter(o => o.expiresDay > s.day)
  if (s.opportunities.length < 4 && chance(0.28) && s.level >= 2) {
    const opp = generateOpportunity(s.level, s.day)
    s.opportunities = [...s.opportunities, opp]
    pushToast(s, `New opportunity: ${opp.title}`, 'info')
  }

  // random events (only if none already open)
  if (!s.activeEvent && chance(0.07)) {
    s.activeEvent = rollRandomEvent(s)
  }

  // weekly chart update
  if (s.day % 7 === 0) {
    s.chart = buildChart(s)
    s.chartWeek++
    for (const [i, entry] of s.chart.entries()) {
      if (!entry.isPlayer || !entry.songId) continue
      const pos = i + 1
      const song = s.songs.find(x => x.id === entry.songId)
      if (!song) continue
      if (song.chartPeak === null || pos < song.chartPeak) {
        const rewards = chartRewards(pos)
        s.songs = s.songs.map(x => x.id === song.id ? { ...x, chartPeak: pos } : x)
        s.reputation += rewards.reputation
        grantXp(s, rewards.xp)
        pushToast(s, `"${song.title}" hit #${pos} on the Global Chart!`, 'levelup')
        pushNews(s, `"${song.title}" climbs to #${pos} on the Global Top 100.`, true)
      }
    }
  }

  // monthly: trends re-roll, offers, collab pool, news
  if (s.day % 30 === 0) {
    const old = s.genreTrends
    s.genreTrends = rollTrends()
    const biggestUp = GENRES.reduce((best, g) => (s.genreTrends[g] - (old[g] ?? 1) > s.genreTrends[best] - (old[best] ?? 1) ? g : best), GENRES[0])
    pushNews(s, trendNews(biggestUp, true))
    s.collabPool = generateCollabPool(s.reputation)
    refreshLabelOffers(s)
  }

  // daily tasks reset each day
  s.dailyTasks = makeDailyTasks(s)
  taskProgress(s, 'streams', dayStreams)

  // ambient industry news
  if (chance(0.15)) pushNews(s, genIndustryNews(pick([...GENRES])))

  // contract expiry
  if (s.activeContract && s.day - s.activeContract.signedDay > s.activeContract.offer.lengthDays) {
    pushNews(s, `Your contract with ${s.activeContract.offer.labelName} has ended. You are independent again.`, true)
    pushToast(s, `Contract with ${s.activeContract.offer.labelName} ended`, 'info')
    s.activeContract = null
  }

  // history for graphs
  s.history = [...s.history.slice(-119), { day: s.day, streams: dayStreams, money: s.money, followers: s.followers, listeners: s.monthlyListeners }]

  checkAchievements(s)
}

export function refreshLabelOffers(s: GameState): void {
  const offers = []
  if (s.reputation >= LABEL_REQUIREMENTS['Small Label'] && s.level >= 5) offers.push(generateLabelOffer('Small Label', s.reputation))
  if (s.reputation >= LABEL_REQUIREMENTS['Medium Label'] && s.level >= 10) offers.push(generateLabelOffer('Medium Label', s.reputation))
  if (s.reputation >= LABEL_REQUIREMENTS['Major Label'] && s.level >= 20) offers.push(generateLabelOffer('Major Label', s.reputation))
  if (offers.length && !s.activeContract) {
    s.labelOffers = offers
    if (offers.length > (s.labelOffers?.length ?? 0)) pushToast(s, 'New label offers available', 'info')
  } else if (!s.activeContract) {
    s.labelOffers = offers
  } else {
    s.labelOffers = []
  }
}

export function advanceDays(s: GameState, n: number): void {
  const times = Math.max(1, Math.min(30, Math.round(n)))
  for (let i = 0; i < times; i++) advanceDay(s)
}
