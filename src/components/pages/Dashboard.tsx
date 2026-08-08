import { useGame } from '../../state/GameContext'
import { xpForLevel, titleForLevel } from '../../data/levels'
import { GENRES } from '../../data/genres'
import { AnimatedNumber, AreaChart, Btn, ProgressBar, Section, StatCard, GhostBtn } from '../ui'
import { fmt, fmtMoney, gameDate } from '../../systems/format'
import type { Page } from '../App'

export function Dashboard({ go }: { go: (p: Page) => void }) {
  const { state: s, dispatch } = useGame()
  const trending = GENRES.reduce((a, b) => (s.genreTrends[a] >= s.genreTrends[b] ? a : b))
  const d = gameDate(s.day)
  const releasedCount = s.songs.filter(x => x.status === 'released').length

  return (
    <div className="space-y-4">
      {/* hero */}
      <div className="glass p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/15 via-transparent to-purple-600/15 pointer-events-none" />
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-widest text-zinc-500">Level {s.level}{s.prestige.count > 0 && <span className="text-fuchsia-400 ml-2">★ Prestige {s.prestige.count}</span>}</div>
            <div className="text-3xl font-black text-gradient">{titleForLevel(s.level)}</div>
            <div className="text-sm text-zinc-400 mt-1">{s.producerName} · {s.homeCity} · Age {s.age}</div>
          </div>
          <div className="min-w-[200px] flex-1 max-w-xs">
            <div className="flex justify-between text-xs text-zinc-500 mb-1">
              <span>XP</span><span className="tabular-nums">{fmt(s.xp)} / {fmt(xpForLevel(s.level))}</span>
            </div>
            <ProgressBar value={s.xp} max={xpForLevel(s.level)} />
          </div>
        </div>
      </div>

      {/* stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Total Streams" accent><AnimatedNumber value={s.totalStreams} className="text-sky-300" /></StatCard>
        <StatCard label="Balance"><AnimatedNumber value={s.money} format={fmtMoney} className="text-emerald-300" /></StatCard>
        <StatCard label="Monthly Listeners"><AnimatedNumber value={s.monthlyListeners} /></StatCard>
        <StatCard label="Followers"><AnimatedNumber value={s.followers} className="text-fuchsia-300" /></StatCard>
      </div>

      {/* quick actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {([
          ['🎹 Create Track', 'create'],
          ['🚀 Release Music', 'songs'],
          ['🎚️ Studio', 'studio'],
          ['💼 Career', 'career'],
          ['📊 Analytics', 'analytics'],
          ['📱 Social Media', 'social'],
          ['🛒 Store', 'studio'],
          ['🏆 Charts', 'charts'],
        ] as [string, Page][]).map(([label, page]) => (
          <button key={label} onClick={() => go(page)}
            className="glass glass-hover p-4 text-sm font-semibold text-left">
            {label}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* daily streams graph */}
        <div className="lg:col-span-2">
          <Section title="Daily Streams" right={<span className="text-xs text-sky-300 tabular-nums">today: {fmt(s.streamsToday)}</span>}>
            <AreaChart data={s.history.slice(-60).map(h => h.streams)} color="#38bdf8" />
          </Section>
        </div>

        {/* day / status column */}
        <div className="space-y-4">
          <Section title="Today">
            <div className="text-xl font-bold">{d.month} {d.day}, Year {d.year}</div>
            <div className="text-xs text-zinc-500 mb-3">Day {s.day + 1} of your career</div>
            <div className="flex justify-between text-xs text-zinc-500 mb-1"><span>Energy</span><span>{Math.round(s.energy)} / {s.energyMax}</span></div>
            <ProgressBar value={s.energy} max={s.energyMax} barClass="bg-gradient-to-r from-emerald-500 to-lime-400" className="mb-3" />
            <div className="flex justify-between text-xs text-zinc-500 mb-1"><span>Creativity</span><span>{Math.round(s.creativity)} / 100</span></div>
            <ProgressBar value={s.creativity} max={100} barClass="bg-gradient-to-r from-fuchsia-500 to-purple-400" className="mb-4" />
            <div className="flex gap-2">
              <Btn small onClick={() => dispatch({ type: 'REST' })}>😴 Rest</Btn>
              <GhostBtn className="!px-3 !py-1.5 !text-xs" onClick={() => dispatch({ type: 'SKIP_DAY' })}>⏭ Next Day</GhostBtn>
            </div>
          </Section>

          <Section title="Trending Now">
            <div className="text-lg font-bold text-gradient">{trending}</div>
            <div className="text-xs text-zinc-500">×{s.genreTrends[trending].toFixed(2)} stream multiplier this month</div>
          </Section>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* daily tasks */}
        <Section title="Daily Tasks">
          <div className="space-y-3">
            {s.dailyTasks.map(t => (
              <div key={t.id}>
                <div className="flex justify-between text-sm mb-1">
                  <span className={t.done ? 'line-through text-zinc-600' : ''}>{t.done ? '✓ ' : ''}{t.desc}</span>
                  <span className="text-xs text-indigo-300">+{t.rewardXp} XP</span>
                </div>
                <ProgressBar value={t.progress} max={t.target} barClass={t.done ? 'bg-emerald-500' : 'bg-gradient-to-r from-indigo-500 to-purple-500'} />
              </div>
            ))}
          </div>
        </Section>

        {/* opportunities preview */}
        <Section title="Opportunities" right={<button className="text-xs text-indigo-300 hover:underline" onClick={() => go('career')}>view all →</button>}>
          {s.opportunities.length === 0
            ? <div className="text-sm text-zinc-600">Nothing right now. Keep grinding — opportunities find busy producers.</div>
            : s.opportunities.slice(0, 3).map(o => (
              <div key={o.id} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                <div>
                  <div className="text-sm font-medium">{o.title}</div>
                  <div className="text-xs text-zinc-500">{fmtMoney(o.reward)} · +{o.xp} XP</div>
                </div>
              </div>
            ))}
        </Section>

        {/* news feed */}
        <Section title="Industry News">
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {s.news.slice(0, 8).map((n, i) => (
              <div key={i} className={`text-xs leading-relaxed ${n.personal ? 'text-indigo-300' : 'text-zinc-400'}`}>
                <span className="text-zinc-600 mr-1">D{n.day + 1}</span>{n.text}
              </div>
            ))}
          </div>
        </Section>
      </div>

      {/* top songs */}
      {releasedCount > 0 && (
        <Section title="Your Top Songs" right={<button className="text-xs text-indigo-300 hover:underline" onClick={() => go('songs')}>library →</button>}>
          <div className="grid md:grid-cols-3 gap-3">
            {[...s.songs].filter(x => x.status === 'released').sort((a, b) => b.streams - a.streams).slice(0, 3).map(song => (
              <div key={song.id} className="glass p-4">
                <div className="font-bold uppercase tracking-wide text-sm mb-1">{song.title}</div>
                <div className="text-2xl font-black tabular-nums text-sky-300">{fmt(song.streams)}</div>
                <div className="text-xs text-zinc-500">+{fmt(song.dailyStreams)} today</div>
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  )
}
