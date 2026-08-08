import type { ActiveGameEvent, GameState } from '../types'
import { genArtistName, pick, randInt } from './names'

interface EventTemplate {
  id: string
  weight: number
  minLevel: number
  build: (s: GameState) => ActiveGameEvent
}

export const EVENT_TEMPLATES: EventTemplate[] = [
  {
    id: 'laptop-crash', weight: 8, minLevel: 1,
    build: () => ({
      id: 'laptop-crash',
      title: 'Laptop Crash!',
      desc: 'Your laptop crashed mid-session and you lost a project file. Repairs will cost you, or you can push through the frustration.',
      choices: [
        { label: 'Pay for repairs ($200)', outcome: 'Fixed and back to work.', effect: { money: -200 } },
        { label: 'Push through it', outcome: 'You rebuilt the project from memory, but it drained you.', effect: { energy: -20, creativity: -5, xp: 30 } },
      ],
    }),
  },
  {
    id: 'plugin-sale', weight: 10, minLevel: 1,
    build: () => ({
      id: 'plugin-sale',
      title: 'Flash Plugin Sale',
      desc: 'A developer is running a 24-hour flash sale. A bundle worth $400 is going for $120.',
      choices: [
        { label: 'Buy the bundle ($120)', outcome: 'New toys! Your creativity surges.', effect: { money: -120, creativity: 8 } },
        { label: 'Skip it', outcome: 'You save your money.', effect: {} },
      ],
    }),
  },
  {
    id: 'creative-block', weight: 8, minLevel: 1,
    build: () => ({
      id: 'creative-block',
      title: 'Creative Block',
      desc: 'Nothing sounds good today. Every loop feels stale.',
      choices: [
        { label: 'Take a walk and reset', outcome: 'Fresh air helped clear your head.', effect: { creativity: 5, energy: -5 } },
        { label: 'Force it', outcome: 'You ground through it. Painful, but you learned something.', effect: { creativity: -3, xp: 50, energy: -15 } },
      ],
    }),
  },
  {
    id: 'beat-offer', weight: 5, minLevel: 8,
    build: (s) => {
      const price = 5000 * Math.max(1, Math.round(s.level / 4))
      return {
        id: 'beat-offer',
        title: 'A Major Artist Wants Your Beat',
        desc: `${genArtistName()} heard one of your instrumentals and wants it for their album. Their team offers a buyout or publishing.`,
        choices: [
          { label: `Sell beat for $${price.toLocaleString()}`, outcome: 'Cash in hand. Clean and simple.', effect: { money: price, xp: 150 } },
          { label: 'Take 20% publishing', outcome: 'You bet on the song — reputation and royalties trickle in.', effect: { reputation: 60, xp: 250, money: Math.round(price * 0.4) } },
          { label: 'Reject the offer', outcome: 'You keep the beat for yourself.', effect: { creativity: 3 } },
        ],
      }
    },
  },
  {
    id: 'dj-support', weight: 7, minLevel: 3,
    build: () => ({
      id: 'dj-support',
      title: 'DJ Supports Your Track',
      desc: `${genArtistName()} played your track at a sold-out club night. Clips are circulating online.`,
      choices: [
        { label: 'Repost and engage', outcome: 'The clip spreads and new fans find you.', effect: { reputation: 15, xp: 80, energy: -5 } },
        { label: 'Stay lowkey', outcome: 'Mysterious. Some tastemakers respect it.', effect: { reputation: 8, creativity: 2 } },
      ],
    }),
  },
  {
    id: 'gear-break', weight: 6, minLevel: 5,
    build: (s) => ({
      id: 'gear-break',
      title: 'Studio Equipment Breaks',
      desc: 'Your monitors started crackling — a blown driver. Working without proper monitoring will hurt your mixes.',
      choices: [
        { label: `Repair now ($${Math.min(800, Math.max(150, Math.round(s.money * 0.05)))})`, outcome: 'Back to full fidelity.', effect: { money: -Math.min(800, Math.max(150, Math.round(s.money * 0.05))) } },
        { label: 'Work on headphones for now', outcome: 'Not ideal. Your next mixes may suffer.', effect: { creativity: -4, energy: -5 } },
      ],
    }),
  },
  {
    id: 'label-scout', weight: 4, minLevel: 6,
    build: () => ({
      id: 'label-scout',
      title: 'A Label Scout Reached Out',
      desc: 'An A&R scout says they have been watching your growth and wants a meeting.',
      choices: [
        { label: 'Take the meeting', outcome: 'Good impression made. Doors are opening.', effect: { reputation: 25, xp: 120, energy: -10 } },
        { label: 'Not yet — stay independent', outcome: 'You keep full control and your fans respect it.', effect: { creativity: 4, xp: 60 } },
      ],
    }),
  },
  {
    id: 'producer-beef', weight: 4, minLevel: 10,
    build: () => ({
      id: 'producer-beef',
      title: 'Producer Beef',
      desc: `${genArtistName()} claims you stole their drum pattern and is calling you out publicly.`,
      choices: [
        { label: 'Respond with receipts', outcome: 'Your project files settle it instantly. Respect earned.', effect: { reputation: 30, xp: 100, energy: -10 } },
        { label: 'Ignore the drama', outcome: 'It blows over in a week.', effect: { energy: -5 } },
        { label: 'Fire back publicly', outcome: 'Messy. Some fans love it, some leave.', effect: { reputation: -10, xp: 40 } },
      ],
    }),
  },
  {
    id: 'copyright', weight: 3, minLevel: 12,
    build: (s) => {
      const fine = Math.min(20000, Math.max(1000, Math.round(s.money * 0.08)))
      return {
        id: 'copyright',
        title: 'Copyright Dispute',
        desc: 'A publisher claims a sample in one of your older tracks was never cleared.',
        choices: [
          { label: `Settle quietly ($${fine.toLocaleString()})`, outcome: 'Resolved without headlines.', effect: { money: -fine } },
          { label: 'Fight it', outcome: 'Your lawyer wins, but the stress cost you.', effect: { energy: -25, reputation: 10, xp: 100 } },
        ],
      }
    },
  },
  {
    id: 'fan-video', weight: 6, minLevel: 4,
    build: () => ({
      id: 'fan-video',
      title: 'Fan Video Goes Viral',
      desc: 'A fan used your track in a video that exploded overnight.',
      choices: [
        { label: 'Share it everywhere', outcome: 'The wave carries you with it.', effect: { reputation: 20, xp: 90, energy: -5 } },
        { label: 'Send them merch', outcome: 'Wholesome moment. The fanbase deepens.', effect: { money: -100, reputation: 25, xp: 60 } },
      ],
    }),
  },
  {
    id: 'song-leak', weight: 3, minLevel: 8,
    build: () => ({
      id: 'song-leak',
      title: 'Unreleased Song Leaked!',
      desc: 'One of your unreleased tracks leaked on a forum and is spreading.',
      choices: [
        { label: 'Embrace it — release now', outcome: 'You turn the leak into a moment.', effect: { reputation: 15, xp: 80 } },
        { label: 'Issue takedowns', outcome: 'Contained, mostly. Exhausting.', effect: { energy: -15, creativity: -2 } },
      ],
    }),
  },
  {
    id: 'festival-invite', weight: 3, minLevel: 15,
    build: (s) => ({
      id: 'festival-invite',
      title: 'Festival Invite',
      desc: 'A mid-size festival wants you for a sunset slot next month.',
      choices: [
        { label: 'Accept the slot', outcome: 'An unforgettable set. Your name is buzzing.', effect: { money: 4000 + s.level * 500, reputation: 60, xp: 300, energy: -30 } },
        { label: 'Decline — studio first', outcome: 'You stay locked in on the music.', effect: { creativity: 6, energy: 10 } },
      ],
    }),
  },
]

export function rollRandomEvent(s: GameState): ActiveGameEvent | null {
  const eligible = EVENT_TEMPLATES.filter(t => t.minLevel <= s.level)
  const total = eligible.reduce((sum, t) => sum + t.weight, 0)
  let roll = Math.random() * total
  for (const t of eligible) {
    roll -= t.weight
    if (roll <= 0) return t.build(s)
  }
  return eligible.length ? eligible[0].build(s) : null
}

export const TREND_SHIFT_NEWS = [
  'Music trend shift: streaming tastes are moving.',
  'New month, new charts — genre trends have shifted.',
]

export function trendNews(genre: string, up: boolean): string {
  return up
    ? `${genre} is surging — streams up ${randInt(8, 30)}% this month.`
    : `${genre} is cooling off — listeners drift to other sounds.`
}

export { pick }
