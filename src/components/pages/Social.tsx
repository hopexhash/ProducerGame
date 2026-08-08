import { useState } from 'react'
import { useGame } from '../../state/GameContext'
import { SOCIAL_PLATFORMS, SOCIAL_POST_TYPES } from '../../state/reducer'
import { AnimatedNumber, Btn, ProgressBar, Section, StatCard } from '../ui'

const PLATFORM_ICONS: Record<string, string> = { TuneTok: '🎵', SoundGram: '📸', MusicTube: '▶️' }

export function Social() {
  const { state: s, dispatch } = useGame()
  const [platform, setPlatform] = useState(SOCIAL_PLATFORMS[0])
  const [postType, setPostType] = useState(SOCIAL_POST_TYPES[0])
  const locked = s.level < 2

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Followers" accent><AnimatedNumber value={s.followers} className="text-fuchsia-300" /></StatCard>
        <StatCard label="Hype" sub="boosts your next release">
          <span className="text-amber-300">{s.hype}</span><span className="text-zinc-600 text-base">/100</span>
        </StatCard>
      </div>

      <Section title="Create Post">
        {locked && <div className="text-sm text-amber-300 mb-4">🔒 Reach Level 2 to unlock social media.</div>}
        <div className="mb-4">
          <span className="text-xs uppercase tracking-widest text-zinc-500">Platform</span>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {SOCIAL_PLATFORMS.map(p => (
              <button key={p} onClick={() => setPlatform(p)}
                className={`rounded-xl px-3 py-3 text-sm font-semibold border transition ${platform === p ? 'border-fuchsia-400 bg-fuchsia-500/15 text-fuchsia-200' : 'border-white/10 text-zinc-400 hover:border-white/25'}`}>
                {PLATFORM_ICONS[p]} {p}
              </button>
            ))}
          </div>
        </div>
        <div className="mb-6">
          <span className="text-xs uppercase tracking-widest text-zinc-500">Post Type</span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
            {SOCIAL_POST_TYPES.map(t => (
              <button key={t} onClick={() => setPostType(t)}
                className={`rounded-lg px-2 py-2 text-xs font-medium border transition ${postType === t ? 'border-indigo-400 bg-indigo-500/20 text-indigo-200' : 'border-white/10 text-zinc-400 hover:border-white/25'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="text-xs text-zinc-500">-5 energy · advances 1 day · gains followers &amp; hype<br />Memes are high-variance. Small chance any post blows up.</div>
          <Btn disabled={locked || s.energy < 5} onClick={() => dispatch({ type: 'SOCIAL_POST', platform, postType })}>
            📤 Post to {platform}
          </Btn>
        </div>
      </Section>

      <Section title="Energy">
        <div className="flex justify-between text-xs text-zinc-500 mb-1"><span>Energy</span><span>{Math.round(s.energy)} / {s.energyMax}</span></div>
        <ProgressBar value={s.energy} max={s.energyMax} barClass="bg-gradient-to-r from-emerald-500 to-lime-400" />
      </Section>
    </div>
  )
}
