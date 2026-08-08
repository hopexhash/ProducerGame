import { useState } from 'react'
import { useGame } from '../../state/GameContext'
import { Btn, GhostBtn, Section } from '../ui'
import { fmt, fmtMoney } from '../../systems/format'
import { LABEL_REQUIREMENTS } from '../../data/labels'
import type { Skills } from '../../types'

export function Career() {
  const { state: s, dispatch } = useGame()
  const [collabSongPick, setCollabSongPick] = useState<string | null>(null)
  const unreleased = s.songs.filter(x => x.status === 'unreleased' && !x.collabArtist)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="glass p-4"><div className="text-[11px] uppercase tracking-widest text-zinc-500">Reputation</div><div className="text-2xl font-bold text-amber-300 tabular-nums">{fmt(s.reputation)}</div></div>
        <div className="glass p-4"><div className="text-[11px] uppercase tracking-widest text-zinc-500">Superfans</div><div className="text-2xl font-bold text-fuchsia-300 tabular-nums">{fmt(s.superfans)}</div></div>
        <div className="glass p-4"><div className="text-[11px] uppercase tracking-widest text-zinc-500">Contract</div><div className="text-sm font-bold mt-1">{s.activeContract ? s.activeContract.offer.labelName : 'Independent'}</div></div>
        <div className="glass p-4 flex items-center">
          <GhostBtn onClick={() => dispatch({ type: 'NETWORK' })} disabled={s.energy < 15} className="w-full">🤝 Network (-15⚡)</GhostBtn>
        </div>
      </div>

      {/* opportunities */}
      <Section title="Career Opportunities">
        {s.opportunities.length === 0
          ? <div className="text-sm text-zinc-600">No active opportunities. They appear as days pass — busier producers get more calls.</div>
          : (
            <div className="space-y-3">
              {s.opportunities.map(o => (
                <div key={o.id} className="glass p-4 flex flex-wrap items-center gap-4">
                  <div className="flex-1 min-w-[180px]">
                    <div className="font-semibold text-sm">{o.title}</div>
                    <div className="text-xs text-zinc-500 mt-0.5">{o.desc}</div>
                    <div className="text-xs mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5">
                      <span className="text-emerald-300">{fmtMoney(o.reward)}</span>
                      <span className="text-indigo-300">+{o.xp} XP</span>
                      <span className="text-amber-300">+{o.reputation} rep</span>
                      <span className="text-zinc-500">-{o.energyCost}⚡</span>
                      <span className={o.risk > 0.15 ? 'text-red-400' : 'text-zinc-500'}>{Math.round(o.risk * 100)}% risk</span>
                      <span className="text-zinc-600">expires D{o.expiresDay + 1}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Btn small disabled={s.energy < o.energyCost} onClick={() => dispatch({ type: 'ACCEPT_OPPORTUNITY', oppId: o.id })}>Accept</Btn>
                    <GhostBtn className="!px-3 !py-1.5 !text-xs" onClick={() => dispatch({ type: 'DECLINE_OPPORTUNITY', oppId: o.id })}>Pass</GhostBtn>
                  </div>
                </div>
              ))}
            </div>
          )}
      </Section>

      {/* label offers */}
      <Section title="Record Labels">
        {s.activeContract ? (
          <div className="glass p-5">
            <div className="text-lg font-bold text-gradient">{s.activeContract.offer.labelName}</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3 text-sm">
              <div><div className="text-[10px] uppercase text-zinc-500">Releases</div>{s.activeContract.releasesDone} / {s.activeContract.offer.requiredReleases}</div>
              <div><div className="text-[10px] uppercase text-zinc-500">Your royalty</div>{Math.round(s.activeContract.offer.royaltySplit * 100)}%</div>
              <div><div className="text-[10px] uppercase text-zinc-500">Marketing</div>+{Math.round(s.activeContract.offer.marketingBonus * 100)}%</div>
              <div><div className="text-[10px] uppercase text-zinc-500">Playlists</div>+{Math.round(s.activeContract.offer.playlistBonus * 100)}%</div>
            </div>
          </div>
        ) : s.labelOffers.length === 0 ? (
          <div className="text-sm text-zinc-600">
            No offers on the table. Labels notice reputation:
            <span className="text-zinc-400"> Small {LABEL_REQUIREMENTS['Small Label']} · Medium {LABEL_REQUIREMENTS['Medium Label']} · Major {LABEL_REQUIREMENTS['Major Label']} rep</span>
            — you have <span className="text-amber-300">{fmt(s.reputation)}</span>. Networking helps.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-3">
            {s.labelOffers.map(o => (
              <div key={o.id} className="glass p-5">
                <div className="flex justify-between items-start">
                  <div className="font-bold">{o.labelName}</div>
                  <span className="text-[10px] uppercase tracking-wide text-indigo-300">{o.tier}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                  <div><div className="text-[10px] uppercase text-zinc-500">Advance</div><span className="text-emerald-300 font-bold">{fmtMoney(o.advance)}</span></div>
                  <div><div className="text-[10px] uppercase text-zinc-500">Your royalty</div>{Math.round(o.royaltySplit * 100)}%</div>
                  <div><div className="text-[10px] uppercase text-zinc-500">Required releases</div>{o.requiredReleases}</div>
                  <div><div className="text-[10px] uppercase text-zinc-500">Length</div>{Math.round(o.lengthDays / 30)} months</div>
                  <div><div className="text-[10px] uppercase text-zinc-500">Marketing</div>+{Math.round(o.marketingBonus * 100)}%</div>
                  <div><div className="text-[10px] uppercase text-zinc-500">Playlists</div>+{Math.round(o.playlistBonus * 100)}%</div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Btn small onClick={() => dispatch({ type: 'SIGN_CONTRACT', offerId: o.id })}>✒️ Sign</Btn>
                  <GhostBtn className="!px-3 !py-1.5 !text-xs" onClick={() => dispatch({ type: 'DECLINE_OFFER', offerId: o.id })}>Decline</GhostBtn>
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* collaborations */}
      <Section title="Collaborations">
        <div className="text-xs text-zinc-500 mb-3">Add a featured artist to an unreleased track. Bigger artists cost more and take a revenue split, but multiply your reach. Pool refreshes monthly.</div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {s.collabPool.map(a => {
            const locked = s.reputation < a.minReputation
            return (
              <div key={a.id} className={`glass p-4 ${locked ? 'opacity-50' : 'glass-hover'}`}>
                <div className="flex justify-between items-start">
                  <div className="font-bold text-sm">{a.name}</div>
                  <span className="text-[10px] text-fuchsia-300">{a.fameLevel}</span>
                </div>
                <div className="text-xs text-zinc-500 mt-1">{a.genre} · {fmt(a.followers)} followers</div>
                <div className="text-xs mt-2 space-y-0.5">
                  <div>Cost: <span className="text-emerald-300">{fmtMoney(a.cost)}</span></div>
                  <div>Revenue split: {Math.round(a.split * 100)}% to them</div>
                  <div>Expected exposure: <span className="text-sky-300">{a.exposure}</span> (×{a.boost})</div>
                </div>
                {locked
                  ? <div className="text-[11px] text-red-400 mt-3">Requires {fmt(a.minReputation)} reputation</div>
                  : collabSongPick === a.id ? (
                    <div className="mt-3 space-y-1">
                      {unreleased.length === 0 && <div className="text-[11px] text-zinc-500">No unreleased solo tracks — create one first.</div>}
                      {unreleased.map(song => (
                        <button key={song.id}
                          onClick={() => { dispatch({ type: 'START_COLLAB', artistId: a.id, songId: song.id }); setCollabSongPick(null) }}
                          className="w-full text-left text-xs rounded-lg px-3 py-2 border border-white/10 hover:border-indigo-400/50 hover:bg-indigo-500/10">
                          {song.title} <span className="text-zinc-500">(Q{song.quality})</span>
                        </button>
                      ))}
                      <button className="text-[11px] text-zinc-500 hover:text-zinc-300" onClick={() => setCollabSongPick(null)}>cancel</button>
                    </div>
                  ) : (
                    <Btn small className="mt-3 w-full" disabled={s.money < a.cost || s.energy < 20}
                      onClick={() => setCollabSongPick(a.id)}>Collaborate</Btn>
                  )}
              </div>
            )
          })}
        </div>
      </Section>

      {/* skill practice */}
      <Section title="Practice Skills">
        <div className="text-xs text-zinc-500 mb-3">Spend a day sharpening a skill (-12⚡).</div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {(Object.keys(s.skills) as (keyof Skills)[]).map(k => (
            <button key={k} disabled={s.energy < 12 || s.skills[k] >= 100}
              onClick={() => dispatch({ type: 'PRACTICE', skill: k })}
              className="glass glass-hover p-3 text-center disabled:opacity-40 disabled:cursor-not-allowed">
              <div className="text-[10px] uppercase tracking-wide text-zinc-500">{k}</div>
              <div className="font-bold tabular-nums">{Math.round(s.skills[k])}</div>
            </button>
          ))}
        </div>
      </Section>
    </div>
  )
}
