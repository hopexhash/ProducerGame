import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useGame } from '../../state/GameContext'
import { BPM_RANGES, GENRES, KEYS } from '../../data/genres'
import { genSongName, randInt, pick } from '../../data/names'
import type { Genre, SongType } from '../../types'
import { Btn, GhostBtn, Section } from '../ui'
import { effectiveSkill } from '../../systems/quality'
import { fmtMoney, qualityRating } from '../../systems/format'
import type { Page } from '../App'

const SONG_TYPES: SongType[] = ['Single', 'EP Track', 'Club Track', 'Radio Edit', 'Remix']

export function CreateSong({ go }: { go: (p: Page) => void }) {
  const { state: s, dispatch } = useGame()
  const [title, setTitle] = useState(() => genSongName())
  const [genre, setGenre] = useState<Genre>(s.favoriteGenre)
  const [bpm, setBpm] = useState(() => randInt(...BPM_RANGES[s.favoriteGenre]))
  const [key, setKey] = useState(() => pick(KEYS))
  const [songType, setSongType] = useState<SongType>('Single')
  const [days, setDays] = useState(2)
  const [marketing, setMarketing] = useState(0)

  const [showResult, setShowResult] = useState(false)

  const canAfford = s.money >= marketing
  const hasEnergy = s.energy >= 25

  const trendLabel = useMemo(() => {
    const t = s.genreTrends[genre]
    if (t >= 1.35) return { text: '🔥 Very hot right now', cls: 'text-orange-300' }
    if (t >= 1.1) return { text: '📈 Trending up', cls: 'text-emerald-300' }
    if (t >= 0.85) return { text: '➖ Steady', cls: 'text-zinc-400' }
    return { text: '📉 Cooling off', cls: 'text-sky-400' }
  }, [genre, s.genreTrends])

  function create() {
    if (!title.trim() || !canAfford || !hasEnergy) return
    dispatch({ type: 'CREATE_SONG', title: title.trim(), genre, bpm, key, songType, days, marketing })
    setShowResult(true)
  }

  // after dispatch, the newest song in state is the one just created
  const justCreated = showResult ? s.songs[s.songs.length - 1] : null

  if (showResult && justCreated) {
    const rating = qualityRating(justCreated.quality)
    return (
      <AnimatePresence>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-xl mx-auto">
          <div className="glass p-8 text-center">
            <div className="text-xs uppercase tracking-widest text-zinc-500 mb-2">Track Finished</div>
            <div className="text-3xl font-black uppercase tracking-wide mb-1">{justCreated.title}</div>
            <div className="text-sm text-zinc-400 mb-6">{justCreated.genre} · {justCreated.bpm} BPM · {justCreated.key} · {justCreated.type}</div>

            <div className="grid grid-cols-2 gap-3 mb-6 text-left">
              {([['Production', justCreated.subScores.production], ['Mix', justCreated.subScores.mix], ['Master', justCreated.subScores.master], ['Songwriting', justCreated.subScores.songwriting]] as [string, number][]).map(([l, v]) => (
                <div key={l} className="glass p-3">
                  <div className="text-[11px] uppercase tracking-widest text-zinc-500">{l}</div>
                  <div className="text-xl font-bold tabular-nums">{v}</div>
                </div>
              ))}
            </div>

            <motion.div
              initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.3 }}
              className="mb-2"
            >
              <div className="text-6xl font-black text-gradient tabular-nums">{justCreated.quality}</div>
              <div className={`text-lg font-bold ${rating.color}`}>{rating.label}</div>
            </motion.div>

            <div className="flex gap-3 justify-center mt-6">
              <Btn onClick={() => go('songs')}>Go Release It →</Btn>
              <GhostBtn onClick={() => { setShowResult(false); setTitle(genSongName()) }}>Make Another</GhostBtn>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <Section title="New Track">
        <div className="grid md:grid-cols-2 gap-4">
          <label className="block md:col-span-2">
            <span className="text-xs uppercase tracking-widest text-zinc-500">Song Name</span>
            <div className="flex gap-2 mt-1">
              <input value={title} onChange={e => setTitle(e.target.value)} maxLength={30}
                className="flex-1 rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm font-semibold uppercase tracking-wide focus:outline-none focus:border-indigo-400/60" />
              <GhostBtn onClick={() => setTitle(genSongName())}>🎲</GhostBtn>
            </div>
          </label>

          <div className="md:col-span-2">
            <span className="text-xs uppercase tracking-widest text-zinc-500">Genre</span>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-2">
              {GENRES.map(g => (
                <button key={g} onClick={() => { setGenre(g); setBpm(randInt(...BPM_RANGES[g])) }}
                  className={`rounded-lg px-2 py-2 text-xs font-medium border transition ${genre === g ? 'border-indigo-400 bg-indigo-500/20 text-indigo-200' : 'border-white/10 text-zinc-400 hover:border-white/25'}`}>
                  {g}
                  <span className="block text-[10px] text-zinc-500">×{(s.genreTrends[g] ?? 1).toFixed(2)}</span>
                </button>
              ))}
            </div>
            <div className={`text-xs mt-2 ${trendLabel.cls}`}>{trendLabel.text} · familiarity {Math.round(s.genreFamiliarity[genre] ?? 0)}/100</div>
          </div>

          <label className="block">
            <span className="text-xs uppercase tracking-widest text-zinc-500">BPM: {bpm}</span>
            <input type="range" min={60} max={200} value={bpm} onChange={e => setBpm(+e.target.value)} className="w-full mt-2" />
          </label>

          <label className="block">
            <span className="text-xs uppercase tracking-widest text-zinc-500">Key</span>
            <select value={key} onChange={e => setKey(e.target.value)}
              className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm focus:outline-none [&>option]:bg-zinc-900">
              {KEYS.map(k => <option key={k}>{k}</option>)}
            </select>
          </label>

          <label className="block">
            <span className="text-xs uppercase tracking-widest text-zinc-500">Song Type</span>
            <select value={songType} onChange={e => setSongType(e.target.value as SongType)}
              className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm focus:outline-none [&>option]:bg-zinc-900">
              {SONG_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </label>

          <label className="block">
            <span className="text-xs uppercase tracking-widest text-zinc-500">Production Time: {days} day{days > 1 ? 's' : ''}</span>
            <input type="range" min={1} max={7} value={days} onChange={e => setDays(+e.target.value)} className="w-full mt-2" />
            <span className="text-[11px] text-zinc-600">More time = higher quality</span>
          </label>

          <label className="block md:col-span-2">
            <span className="text-xs uppercase tracking-widest text-zinc-500">Marketing Budget: {fmtMoney(marketing)}</span>
            <input type="range" min={0} max={Math.min(50000, Math.max(0, Math.floor(s.money / 100) * 100))} step={100} value={marketing} onChange={e => setMarketing(+e.target.value)} className="w-full mt-2" />
            <span className="text-[11px] text-zinc-600">Boosts launch-week streams</span>
          </label>
        </div>

        <div className="mt-6 flex items-center justify-between flex-wrap gap-3">
          <div className="text-xs text-zinc-500">
            Costs <span className="text-amber-300">25 energy</span> · advances {days} day{days > 1 ? 's' : ''}
            <div className="mt-1">
              Skills: PRD {Math.round(effectiveSkill(s, 'production'))} · MIX {Math.round(effectiveSkill(s, 'mixing'))} · MST {Math.round(effectiveSkill(s, 'mastering'))} · SNG {Math.round(effectiveSkill(s, 'songwriting'))}
            </div>
          </div>
          <Btn onClick={create} disabled={!title.trim() || !canAfford || !hasEnergy} className="px-8 py-3">
            {!hasEnergy ? 'Too Tired (rest first)' : !canAfford ? 'Not Enough Money' : '🎹 Produce Track'}
          </Btn>
        </div>
      </Section>
    </div>
  )
}
