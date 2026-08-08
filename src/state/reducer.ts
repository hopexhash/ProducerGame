import type { GameState, Genre, ReleaseChannel, Song, SongType } from '../types'
import { advanceDays, checkAchievements, effectiveEnergyMax, grantXp, newGame, pushNews, pushToast, refreshLabelOffers, taskProgress } from '../systems/engine'
import { computeQuality } from '../systems/quality'
import { EQUIPMENT } from '../data/equipment'
import { PLUGINS } from '../data/plugins'
import { chance, rand, randInt } from '../data/names'
import { fmt } from '../systems/format'

export type Action =
  | { type: 'START_GAME'; name: string; age: number; city: string; favoriteGenre: Genre }
  | { type: 'LOAD_GAME'; state: GameState }
  | { type: 'CREATE_SONG'; title: string; genre: Genre; bpm: number; key: string; songType: SongType; days: number; marketing: number }
  | { type: 'RELEASE_SONG'; songId: string; channel: ReleaseChannel }
  | { type: 'HYPE_SONG'; songId: string; activity: string }
  | { type: 'REST' }
  | { type: 'SKIP_DAY' }
  | { type: 'NETWORK' }
  | { type: 'SOCIAL_POST'; platform: string; postType: string }
  | { type: 'ACCEPT_OPPORTUNITY'; oppId: string }
  | { type: 'DECLINE_OPPORTUNITY'; oppId: string }
  | { type: 'BUY_EQUIPMENT'; equipmentId: string }
  | { type: 'BUY_PLUGIN'; pluginId: string }
  | { type: 'SIGN_CONTRACT'; offerId: string }
  | { type: 'DECLINE_OFFER'; offerId: string }
  | { type: 'START_COLLAB'; artistId: string; songId: string }
  | { type: 'EVENT_CHOICE'; index: number }
  | { type: 'PRACTICE'; skill: keyof GameState['skills'] }
  | { type: 'PRESTIGE' }
  | { type: 'DISMISS_TOAST'; id: number }
  | { type: 'CLEAR_LEVELUP' }
  | { type: 'CLEAR_VIRAL' }
  | { type: 'CLEAR_ACHIEVEMENT'; id: string }
  | { type: 'TUTORIAL_ADVANCE'; step: number }
  | { type: 'RESET_CAREER' }

export const HYPE_ACTIVITIES: Record<string, { label: string; energy: number; money: number; hype: [number, number] }> = {
  teaser: { label: 'Post teaser', energy: 5, money: 0, hype: [4, 9] },
  djs: { label: 'Send song to DJs', energy: 10, money: 0, hype: [6, 14] },
  ads: { label: 'Run ads', energy: 4, money: 500, hype: [8, 16] },
  influencers: { label: 'Contact influencers', energy: 8, money: 250, hype: [5, 18] },
  preview: { label: 'Upload preview', energy: 5, money: 0, hype: [3, 8] },
  presave: { label: 'Pre-save campaign', energy: 6, money: 150, hype: [6, 12] },
  videoteaser: { label: 'Music video teaser', energy: 12, money: 800, hype: [10, 22] },
}

export const SOCIAL_POST_TYPES = ['Studio Clip', 'Song Teaser', 'Tutorial', 'Meme', 'Release Announcement', 'Behind The Scenes']
export const SOCIAL_PLATFORMS = ['TuneTok', 'SoundGram', 'MusicTube']

function clone(s: GameState): GameState {
  return { ...s, skills: { ...s.skills }, genreTrends: { ...s.genreTrends }, genreFamiliarity: { ...s.genreFamiliarity } }
}

export function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'START_GAME':
      return newGame(action.name, action.age, action.city, action.favoriteGenre)

    case 'LOAD_GAME':
      return action.state

    case 'RESET_CAREER':
      return { ...newGame('', 18, '', 'Afro House'), started: false }

    case 'CREATE_SONG': {
      const s = clone(state)
      if (s.energy < 25) { pushToast(s, 'Too tired to produce — rest first', 'warn'); return s }
      if (s.money < action.marketing) { pushToast(s, 'Not enough money for that marketing budget', 'warn'); return s }
      s.energy -= 25
      s.money -= action.marketing
      taskProgress(s, 'marketing', action.marketing)
      const { quality, subScores } = computeQuality(s, action.genre, action.days)
      s.songCounter++
      const song: Song = {
        id: `song-${s.songCounter}`,
        title: action.title,
        genre: action.genre,
        bpm: action.bpm,
        key: action.key,
        type: action.songType,
        quality,
        subScores,
        status: 'unreleased',
        createdDay: s.day,
        releaseDay: null,
        releaseChannel: null,
        labelName: null,
        streams: 0,
        dailyStreams: 0,
        streamHistory: [],
        revenue: 0,
        chartPeak: null,
        marketingBudget: action.marketing,
        hype: 0,
        playlists: [],
        viral: null,
        wasViral: false,
        collabArtist: null,
        collabSplit: 0,
        collabBoost: 1,
        coverHue: randInt(0, 360),
        certification: 'None',
      }
      s.songs = [...s.songs, song]
      // craft practice: skills grow by doing, with diminishing returns near mastery
      const gain = 0.4 + action.days * 0.25
      const practice = (skill: number, mult: number) =>
        Math.min(100, +(skill + gain * mult * Math.max(0.05, 1 - skill / 105)).toFixed(1))
      s.skills.production = practice(s.skills.production, rand(0.8, 1.2))
      s.skills.mixing = practice(s.skills.mixing, rand(0.6, 1))
      s.skills.mastering = practice(s.skills.mastering, rand(0.5, 0.9))
      s.skills.songwriting = practice(s.skills.songwriting, rand(0.6, 1.1))
      s.genreFamiliarity[action.genre] = Math.min(100, (s.genreFamiliarity[action.genre] ?? 0) + 4)
      s.creativity = Math.max(0, s.creativity - 8)
      grantXp(s, 40 + action.days * 20 + Math.round(quality / 2))
      taskProgress(s, 'produce', 1)
      pushToast(s, `Finished "${action.title}" — Quality ${quality}`, 'success')
      if (s.tutorialStep === 0) s.tutorialStep = 1
      advanceDays(s, action.days)
      checkAchievements(s)
      return s
    }

    case 'RELEASE_SONG': {
      const s = clone(state)
      const song = s.songs.find(x => x.id === action.songId)
      if (!song || song.status === 'released') return s
      const contract = s.activeContract
      const channel: ReleaseChannel = contract ? contract.offer.tier : 'Independent'
      const labelName = contract ? contract.offer.labelName : null
      s.songs = s.songs.map(x => x.id === action.songId
        ? { ...x, status: 'released' as const, releaseDay: s.day, releaseChannel: channel, labelName, hype: x.hype + s.hype }
        : x)
      s.hype = 0
      if (contract) {
        s.activeContract = { ...contract, releasesDone: contract.releasesDone + 1 }
        if (s.activeContract.releasesDone >= contract.offer.requiredReleases) {
          pushToast(s, `Contract with ${contract.offer.labelName} fulfilled!`, 'success')
          pushNews(s, `You fulfilled your ${contract.offer.requiredReleases}-release deal with ${contract.offer.labelName}.`, true)
          grantXp(s, 400)
          s.reputation += 50
          s.activeContract = null
          refreshLabelOffers(s)
        }
      }
      grantXp(s, 60)
      taskProgress(s, 'release', 1)
      pushNews(s, `You released "${song.title}" (${song.genre})${labelName ? ` on ${labelName}` : ' independently'}.`, true)
      pushToast(s, `"${song.title}" is out now!`, 'success')
      if (s.tutorialStep === 1) s.tutorialStep = 2
      advanceDays(s, 1)
      checkAchievements(s)
      return s
    }

    case 'HYPE_SONG': {
      const s = clone(state)
      const act = HYPE_ACTIVITIES[action.activity]
      const song = s.songs.find(x => x.id === action.songId)
      if (!act || !song || song.status === 'released') return s
      if (s.energy < act.energy) { pushToast(s, 'Not enough energy', 'warn'); return s }
      if (s.money < act.money) { pushToast(s, 'Not enough money', 'warn'); return s }
      s.energy -= act.energy
      s.money -= act.money
      if (act.money > 0) taskProgress(s, 'marketing', act.money)
      const gained = randInt(act.hype[0], act.hype[1]) + Math.round(s.skills.marketing / 20)
      s.songs = s.songs.map(x => x.id === action.songId ? { ...x, hype: Math.min(100, x.hype + gained) } : x)
      s.skills.marketing = Math.min(100, +(s.skills.marketing + 0.3).toFixed(1))
      grantXp(s, 15)
      pushToast(s, `${act.label}: +${gained} hype for "${song.title}"`, 'info')
      return s
    }

    case 'REST': {
      const s = clone(state)
      advanceDays(s, 1)
      s.energy = effectiveEnergyMax(s)
      s.creativity = Math.min(100, s.creativity + 12)
      pushToast(s, 'Fully rested', 'info')
      return s
    }

    case 'SKIP_DAY': {
      const s = clone(state)
      advanceDays(s, 1)
      return s
    }

    case 'NETWORK': {
      const s = clone(state)
      if (s.energy < 15) { pushToast(s, 'Not enough energy', 'warn'); return s }
      s.energy -= 15
      const repGain = randInt(3, 8) + Math.round(s.skills.networking / 10)
      s.reputation += repGain
      s.skills.networking = Math.min(100, +(s.skills.networking + rand(0.5, 1.2)).toFixed(1))
      grantXp(s, 30)
      pushToast(s, `Networking: +${repGain} reputation`, 'info')
      if (chance(0.12)) refreshLabelOffers(s)
      advanceDays(s, 1)
      return s
    }

    case 'SOCIAL_POST': {
      const s = clone(state)
      if (s.energy < 5) { pushToast(s, 'Not enough energy', 'warn'); return s }
      if (s.level < 2) { pushToast(s, 'Reach level 2 to unlock social media', 'warn'); return s }
      s.energy -= 5
      const reach = Math.pow(Math.max(10, s.followers), 0.75)
      const typeBonus = action.postType === 'Meme' ? rand(0.5, 3) : action.postType === 'Tutorial' ? rand(0.8, 1.6) : rand(0.7, 1.8)
      const gained = Math.max(1, Math.round(reach * 0.25 * typeBonus * (1 + s.skills.marketing / 100)))
      s.followers += gained
      s.hype = Math.min(100, s.hype + randInt(2, 6))
      s.skills.marketing = Math.min(100, +(s.skills.marketing + 0.4).toFixed(1))
      grantXp(s, 20)
      taskProgress(s, 'social', 1)
      pushToast(s, `${action.platform} · ${action.postType}: +${fmt(gained)} followers`, 'follower')
      if (chance(0.04) && s.followers > 500) {
        const viralGain = Math.round(gained * rand(8, 25))
        s.followers += viralGain
        pushToast(s, `Your ${action.postType.toLowerCase()} blew up on ${action.platform}! +${fmt(viralGain)} followers`, 'levelup')
      }
      advanceDays(s, 1)
      return s
    }

    case 'ACCEPT_OPPORTUNITY': {
      const s = clone(state)
      const opp = s.opportunities.find(o => o.id === action.oppId)
      if (!opp) return s
      if (s.energy < opp.energyCost) { pushToast(s, 'Not enough energy for this opportunity', 'warn'); return s }
      s.energy -= opp.energyCost
      s.opportunities = s.opportunities.filter(o => o.id !== action.oppId)
      const failed = chance(opp.risk)
      if (failed) {
        s.reputation = Math.max(0, s.reputation - Math.round(opp.reputation / 2))
        grantXp(s, Math.round(opp.xp * 0.3))
        pushToast(s, `"${opp.title}" fell through — they went with someone else`, 'warn')
      } else {
        s.money += opp.reward
        s.reputation += opp.reputation
        grantXp(s, opp.xp)
        s.skills.networking = Math.min(100, +(s.skills.networking + 0.3).toFixed(1))
        taskProgress(s, 'opportunity', 1)
        pushToast(s, `${opp.title}: +$${fmt(opp.reward)}, +${opp.xp} XP`, 'money')
        pushNews(s, `You completed a gig: ${opp.title}.`, true)
      }
      advanceDays(s, 1)
      checkAchievements(s)
      return s
    }

    case 'DECLINE_OPPORTUNITY': {
      const s = clone(state)
      s.opportunities = s.opportunities.filter(o => o.id !== action.oppId)
      return s
    }

    case 'BUY_EQUIPMENT': {
      const s = clone(state)
      const eq = EQUIPMENT.find(e => e.id === action.equipmentId)
      if (!eq || s.equipmentOwned.includes(eq.id)) return s
      if (s.money < eq.cost) { pushToast(s, 'Not enough money', 'warn'); return s }
      s.money -= eq.cost
      s.equipmentOwned = [...s.equipmentOwned, eq.id]
      grantXp(s, 25)
      pushToast(s, `Purchased ${eq.name}`, 'success')
      if (s.tutorialStep === 4) s.tutorialStep = 5
      checkAchievements(s)
      return s
    }

    case 'BUY_PLUGIN': {
      const s = clone(state)
      const pl = PLUGINS.find(p => p.id === action.pluginId)
      if (!pl || s.pluginsOwned.includes(pl.id)) return s
      if (s.money < pl.cost) { pushToast(s, 'Not enough money', 'warn'); return s }
      s.money -= pl.cost
      s.pluginsOwned = [...s.pluginsOwned, pl.id]
      grantXp(s, 15)
      pushToast(s, `Purchased ${pl.name}`, 'success')
      checkAchievements(s)
      return s
    }

    case 'SIGN_CONTRACT': {
      const s = clone(state)
      const offer = s.labelOffers.find(o => o.id === action.offerId)
      if (!offer || s.activeContract) return s
      s.activeContract = { offer, releasesDone: 0, signedDay: s.day }
      s.labelOffers = []
      s.money += offer.advance
      s.reputation += 40
      grantXp(s, 300)
      pushToast(s, `Signed with ${offer.labelName}! +$${fmt(offer.advance)} advance`, 'levelup')
      pushNews(s, `${offer.labelName} signs ${s.producerName} in a ${offer.requiredReleases}-release deal.`, true)
      checkAchievements(s)
      return s
    }

    case 'DECLINE_OFFER': {
      const s = clone(state)
      s.labelOffers = s.labelOffers.filter(o => o.id !== action.offerId)
      return s
    }

    case 'START_COLLAB': {
      const s = clone(state)
      const artist = s.collabPool.find(a => a.id === action.artistId)
      const song = s.songs.find(x => x.id === action.songId)
      if (!artist || !song || song.status === 'released' || song.collabArtist) return s
      if (s.reputation < artist.minReputation) { pushToast(s, 'Your reputation is too low for this artist', 'warn'); return s }
      if (s.money < artist.cost) { pushToast(s, 'Not enough money', 'warn'); return s }
      if (s.energy < 20) { pushToast(s, 'Not enough energy for a session', 'warn'); return s }
      s.money -= artist.cost
      s.energy -= 20
      s.collabPool = s.collabPool.filter(a => a.id !== artist.id)
      s.songs = s.songs.map(x => x.id === song.id
        ? { ...x, collabArtist: artist.name, collabSplit: artist.split, collabBoost: artist.boost, title: `${x.title} (feat. ${artist.name})` }
        : x)
      grantXp(s, 120)
      s.reputation += Math.round(artist.boost * 8)
      pushToast(s, `Collab locked in with ${artist.name}!`, 'success')
      pushNews(s, `You hit the studio with ${artist.name} (${artist.fameLevel}).`, true)
      advanceDays(s, 1)
      checkAchievements(s)
      return s
    }

    case 'EVENT_CHOICE': {
      const s = clone(state)
      const ev = s.activeEvent
      if (!ev) return s
      const choice = ev.choices[action.index]
      if (!choice) return s
      const e = choice.effect
      if (e.money) s.money = Math.max(0, s.money + e.money)
      if (e.reputation) s.reputation = Math.max(0, s.reputation + e.reputation)
      if (e.energy) s.energy = Math.max(0, Math.min(effectiveEnergyMax(s), s.energy + e.energy))
      if (e.creativity) s.creativity = Math.max(0, Math.min(100, s.creativity + e.creativity))
      if (e.xp) grantXp(s, e.xp)
      s.activeEvent = null
      pushToast(s, choice.outcome, 'info')
      checkAchievements(s)
      return s
    }

    case 'PRACTICE': {
      const s = clone(state)
      if (s.energy < 12) { pushToast(s, 'Not enough energy', 'warn'); return s }
      s.energy -= 12
      const gain = +(rand(0.8, 1.8)).toFixed(1)
      s.skills[action.skill] = Math.min(100, +(s.skills[action.skill] + gain).toFixed(1))
      grantXp(s, 25)
      pushToast(s, `Practiced ${action.skill}: +${gain}`, 'info')
      advanceDays(s, 1)
      return s
    }

    case 'PRESTIGE': {
      const s = state
      if (s.level < 50) return s
      const p = s.prestige
      const next = {
        count: p.count + 1,
        streamBonus: +(p.streamBonus + 0.05).toFixed(2),
        xpBonus: +(p.xpBonus + 0.05).toFixed(2),
        creativityBonus: p.creativityBonus + 3,
        royaltyBonus: +(p.royaltyBonus + 0.1).toFixed(2),
      }
      const fresh = newGame(s.producerName, 18, s.homeCity, s.favoriteGenre, next)
      fresh.tutorialStep = 6
      fresh.news = [{ day: 0, text: `PRESTIGE ${next.count}: You walk away at the top to do it all again — smarter, sharper, hungrier.`, personal: true }]
      return fresh
    }

    case 'DISMISS_TOAST':
      return { ...state, toasts: state.toasts.filter(t => t.id !== action.id) }
    case 'CLEAR_LEVELUP':
      return { ...state, pendingLevelUp: null }
    case 'CLEAR_VIRAL':
      return { ...state, pendingViral: null }
    case 'CLEAR_ACHIEVEMENT':
      return { ...state, pendingAchievements: state.pendingAchievements.filter(a => a !== action.id) }
    case 'TUTORIAL_ADVANCE':
      return { ...state, tutorialStep: Math.max(state.tutorialStep, action.step) }

    default:
      return state
  }
}
