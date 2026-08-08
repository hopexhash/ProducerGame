import { useState } from 'react'
import { motion } from 'framer-motion'
import { useGame } from '../../state/GameContext'
import { HYPE_ACTIVITIES } from '../../state/reducer'
import { Btn, GhostBtn, ProgressBar, Section, SongCover } from '../ui'
import { fmt, fmtMoney, gameDate, qualityRating } from '../../systems/format'
import type { Song } from '../../types'

type SortKey = 'streams' | 'newest' | 'quality' | 'revenue'

export function Songs() {
  const { state: s, dispatch } = useGame()
  const [sort, setSort] = useState<SortKey>('newest')
  const [hypeTarget, setHypeTarget] = useState<string | null>(null)

  const unreleased = s.songs.filter(x => x.status === 'unreleased')
  const released = [...s.songs.filter(x => x.status === 'released')].sort((a, b) => {
    if (sort === 'streams') return b.streams - a.streams
    if (sort === 'quality') return b.quality - a.quality
    if (sort === 'revenue') return b.revenue - a.revenue
    return (b.releaseDay ?? 0) - (a.releaseDay ?? 0)
  })

  const hypeSong = hypeTarget ? s.songs.find(x => x.id === hypeTarget) : null

  return (
    <div className="space-y-4">
      {unreleased.length > 0 && (
        <Section title={`Unreleased (${unreleased.length})`}>
          <div className="space-y-3">
            {unreleased.map(song => {
              const rating = qualityRating(song.quality)
              return (
                <motion.div key={song.id} layout className="glass p-4 flex flex-wrap items-center gap-4">
                  <SongCover hue={song.coverHue} title={song.title} />
                  <div className="flex-1 min-w-[140px]">
                    <div className="font-bold uppercase tracking-wide text-sm">{song.title}</div>
                    <div className="text-xs text-zinc-500">{song.genre} · {song.bpm} BPM · Quality <span className={rating.color}>{song.quality} ({rating.label})</span></div>
                    {song.collabArtist && <div className="text-xs text-fuchsia-300">feat. {song.collabArtist} · ×{song.collabBoost} boost · {Math.round(song.collabSplit * 100)}% split</div>}
                    <div className="mt-2 max-w-[200px]">
                      <div className="flex justify-between text-[10px] text-zinc-500 mb-0.5"><span>Hype</span><span>{song.hype}/100</span></div>
                      <ProgressBar value={song.hype} max={100} barClass="bg-gradient-to-r from-amber-500 to-orange-400" />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <GhostBtn onClick={() => setHypeTarget(hypeTarget === song.id ? null : song.id)}>🔥 Build Hype</GhostBtn>
                    <Btn onClick={() => dispatch({ type: 'RELEASE_SONG', songId: song.id, channel: s.activeContract ? s.activeContract.offer.tier : 'Independent' })}>
                      🚀 Release{s.activeContract ? ` on ${s.activeContract.offer.labelName}` : ' Independently'}
                    </Btn>
                  </div>
                </motion.div>
              )
            })}
          </div>
          {s.activeContract && (
            <div className="text-xs text-indigo-300 mt-3">
              Signed to {s.activeContract.offer.labelName} — releases go through the label ({s.activeContract.releasesDone}/{s.activeContract.offer.requiredReleases} delivered, +{Math.round(s.activeContract.offer.marketingBonus * 100)}% marketing, +{Math.round(s.activeContract.offer.playlistBonus * 100)}% playlist reach).
            </div>
          )}
        </Section>
      )}

      {hypeSong && hypeSong.status === 'unreleased' && (
        <Section title={`Build Hype — ${hypeSong.title}`} right={<button className="text-xs text-zinc-500 hover:text-zinc-300" onClick={() => setHypeTarget(null)}>close ✕</button>}>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {Object.entries(HYPE_ACTIVITIES).map(([id, a]) => (
              <button key={id}
                onClick={() => dispatch({ type: 'HYPE_SONG', songId: hypeSong.id, activity: id })}
                disabled={s.energy < a.energy || s.money < a.money}
                className="glass glass-hover p-3 text-left disabled:opacity-40 disabled:cursor-not-allowed">
                <div className="text-sm font-semibold">{a.label}</div>
                <div className="text-xs text-zinc-500">-{a.energy} energy{a.money > 0 ? ` · ${fmtMoney(a.money)}` : ''}</div>
                <div className="text-xs text-amber-300">+{a.hype[0]}–{a.hype[1]} hype</div>
              </button>
            ))}
          </div>
        </Section>
      )}

      <Section
        title={`Released (${released.length})`}
        right={
          <select value={sort} onChange={e => setSort(e.target.value as SortKey)}
            className="rounded-lg bg-white/5 border border-white/10 px-2 py-1 text-xs focus:outline-none [&>option]:bg-zinc-900">
            <option value="newest">Newest</option>
            <option value="streams">Most streams</option>
            <option value="quality">Highest quality</option>
            <option value="revenue">Most revenue</option>
          </select>
        }
      >
        {released.length === 0
          ? <div className="text-sm text-zinc-600">No releases yet. Create a track and put it out into the world.</div>
          : (
            <div className="space-y-2">
              {released.map(song => <ReleasedRow key={song.id} song={song} />)}
            </div>
          )}
      </Section>
    </div>
  )
}

function ReleasedRow({ song }: { song: Song }) {
  const rating = qualityRating(song.quality)
  const rd = song.releaseDay !== null ? gameDate(song.releaseDay) : null
  const certColor = song.certification === 'Diamond' ? 'text-cyan-300' : song.certification === 'Platinum' ? 'text-zinc-200' : 'text-amber-400'
  return (
    <motion.div layout className="glass p-3 flex flex-wrap items-center gap-3">
      <SongCover hue={song.coverHue} title={song.title} size={44} />
      <div className="flex-1 min-w-[140px]">
        <div className="font-bold uppercase tracking-wide text-sm flex items-center gap-2">
          {song.title}
          {song.certification !== 'None' && <span className={`text-[10px] font-bold ${certColor}`}>◈ {song.certification.toUpperCase()}</span>}
          {song.viral && <span className="text-[10px] text-orange-300 animate-pulse">🔥 VIRAL ×{song.viral.multiplier}</span>}
        </div>
        <div className="text-xs text-zinc-500">
          {song.genre} · <span className={rating.color}>{song.quality}</span>
          {rd && <> · {rd.month.slice(0, 3)} {rd.day}, Y{rd.year}</>}
          {song.labelName ? ` · ${song.labelName}` : ' · Independent'}
          {song.chartPeak && <span className="text-indigo-300"> · Peak #{song.chartPeak}</span>}
        </div>
        {song.playlists.length > 0 && (
          <div className="text-[10px] text-emerald-300 mt-0.5">In: {song.playlists.map(p => p.name).join(' · ')}</div>
        )}
      </div>
      <div className="text-right">
        <div className="font-black tabular-nums text-sky-300">{fmt(song.streams)}</div>
        <div className="text-[10px] text-zinc-500">+{fmt(song.dailyStreams)} today · {fmtMoney(song.revenue)} earned</div>
      </div>
    </motion.div>
  )
}
