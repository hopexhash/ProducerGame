import { useEffect } from 'react'
import { useGame } from '../../state/GameContext'
import { AnimatedNumber, AreaChart, Section, SongCover, StatCard } from '../ui'
import { fmt, fmtFull } from '../../systems/format'

export function Analytics() {
  const { state: s, dispatch } = useGame()

  // visiting analytics advances the tutorial "view your streams" step
  useEffect(() => {
    if (s.tutorialStep === 2) dispatch({ type: 'TUTORIAL_ADVANCE', step: 3 })
  }, [s.tutorialStep, dispatch])

  const last30 = s.history.slice(-30)
  const streamsThisMonth = last30.reduce((a, h) => a + h.streams, 0)
  const streamsThisYear = s.history.slice(-120).reduce((a, h) => a + h.streams, 0)
  const topSongs = [...s.songs].filter(x => x.status === 'released').sort((a, b) => b.streams - a.streams).slice(0, 5)
  const countries = Object.entries(s.countryWeights).sort((a, b) => b[1] - a[1])

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Total Streams" accent><AnimatedNumber value={s.totalStreams} className="text-sky-300" /></StatCard>
        <StatCard label="Streams Today"><AnimatedNumber value={s.streamsToday} /></StatCard>
        <StatCard label="Monthly Listeners"><AnimatedNumber value={s.monthlyListeners} /></StatCard>
        <StatCard label="Followers"><AnimatedNumber value={s.followers} className="text-fuchsia-300" /></StatCard>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        <StatCard label="Streams This Month" sub="last 30 days">{fmt(streamsThisMonth)}</StatCard>
        <StatCard label="Streams (recent window)" sub="last 120 days">{fmt(streamsThisYear)}</StatCard>
        <StatCard label="Superfans" sub="your stream floor">{fmt(s.superfans)}</StatCard>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Section title="Daily Streams — Last 60 Days">
          <AreaChart data={s.history.slice(-60).map(h => h.streams)} color="#38bdf8" height={160} />
        </Section>
        <Section title="Follower Growth">
          <AreaChart data={s.history.slice(-60).map(h => h.followers)} color="#c084fc" height={160} />
        </Section>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Section title="Top Songs">
          {topSongs.length === 0
            ? <div className="text-sm text-zinc-600">Release music to see your top songs.</div>
            : (
              <div className="space-y-2">
                {topSongs.map((song, i) => (
                  <div key={song.id} className="flex items-center gap-3 py-1.5">
                    <span className="text-zinc-600 font-bold w-5 text-right">{i + 1}</span>
                    <SongCover hue={song.coverHue} title={song.title} size={38} />
                    <div className="flex-1">
                      <div className="font-bold uppercase tracking-wide text-sm">{song.title}</div>
                      <div className="text-[11px] text-zinc-500">{fmtFull(song.streams)} streams · +{fmt(song.dailyStreams)} today</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
        </Section>

        <Section title="Top Countries">
          <div className="space-y-2.5">
            {countries.map(([name, weight]) => (
              <div key={name}>
                <div className="flex justify-between text-xs mb-1">
                  <span>{name}</span>
                  <span className="text-zinc-500 tabular-nums">{fmt(Math.round(s.totalStreams * weight / 100))} · {weight}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-sky-500 to-indigo-500" style={{ width: `${weight}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </div>
  )
}
