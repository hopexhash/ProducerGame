import { useGame } from '../../state/GameContext'
import { Section } from '../ui'
import { fmt } from '../../systems/format'

export function Charts() {
  const { state: s } = useGame()

  return (
    <div className="space-y-4">
      <div className="glass p-6">
        <div className="text-xs uppercase tracking-widest text-zinc-500">Global Top 100</div>
        <div className="text-3xl font-black text-gradient">Week {s.chartWeek + 1}</div>
        <div className="text-sm text-zinc-400 mt-1">Charts update every in-game week. Your songs compete on weekly streams.</div>
      </div>

      <Section title="This Week's Chart">
        <div className="space-y-1 max-h-[65vh] overflow-y-auto pr-1">
          {s.chart.map((e, i) => (
            <div key={i}
              className={`flex items-center gap-3 rounded-xl px-3 py-2 ${e.isPlayer ? 'bg-indigo-500/15 ring-1 ring-indigo-400/40' : i % 2 ? 'bg-white/[0.02]' : ''}`}>
              <span className={`w-8 text-right font-black tabular-nums ${i === 0 ? 'text-amber-300' : i < 10 ? 'text-zinc-200' : 'text-zinc-600'}`}>{i + 1}</span>
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-semibold truncate ${e.isPlayer ? 'text-indigo-200' : ''}`}>
                  {e.title} {e.isPlayer && <span className="text-[10px] text-indigo-300">● YOU</span>}
                </div>
                <div className="text-[11px] text-zinc-500 truncate">{e.artist} · {e.genre}</div>
              </div>
              <div className="text-xs tabular-nums text-zinc-400">{fmt(e.weeklyStreams)}<span className="text-zinc-600">/wk</span></div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  )
}
