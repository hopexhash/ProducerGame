import { useGame } from '../../state/GameContext'
import { ACHIEVEMENTS, AWARDS } from '../../data/achievements'
import { Btn, Section } from '../ui'

export function Trophies() {
  const { state: s, dispatch } = useGame()
  const unlockedCount = s.achievementsUnlocked.length

  return (
    <div className="space-y-4">
      <Section title={`Trophy Room — Awards (${s.awardsUnlocked.length}/${AWARDS.length})`}>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {AWARDS.map(a => {
            const owned = s.awardsUnlocked.includes(a.id)
            return (
              <div key={a.id} className={`glass p-4 text-center ${owned ? 'ring-1 ring-amber-400/40' : 'opacity-35 grayscale'}`}>
                <div className="text-3xl mb-2">{a.icon}</div>
                <div className="font-bold text-sm">{a.name}</div>
                <div className="text-[11px] text-zinc-500 mt-1">{a.desc}</div>
              </div>
            )
          })}
        </div>
      </Section>

      <Section title={`Achievements (${unlockedCount}/${ACHIEVEMENTS.length})`}>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
          {ACHIEVEMENTS.map(a => {
            const owned = s.achievementsUnlocked.includes(a.id)
            return (
              <div key={a.id} className={`glass px-4 py-3 flex items-center gap-3 ${owned ? '' : 'opacity-40'}`}>
                <span className="text-lg">{owned ? '🏆' : '🔒'}</span>
                <div>
                  <div className="font-semibold text-sm">{a.name}</div>
                  <div className="text-[11px] text-zinc-500">{a.desc} · +{a.xp} XP</div>
                </div>
              </div>
            )
          })}
        </div>
      </Section>

      {s.level >= 50 && (
        <Section title="Prestige Mode">
          <div className="glass p-6 text-center ring-1 ring-fuchsia-500/40">
            <div className="text-3xl mb-2">🌌</div>
            <div className="text-xl font-black text-gradient mb-2">PRESTIGE {s.prestige.count + 1} AVAILABLE</div>
            <div className="text-sm text-zinc-400 mb-4">
              Restart your career keeping permanent bonuses:<br />
              +5% streams · +5% XP · +3 creativity · +10% royalty revenue (stacking)
            </div>
            <div className="text-xs text-zinc-500 mb-4">
              Current: +{Math.round(s.prestige.streamBonus * 100)}% streams · +{Math.round(s.prestige.xpBonus * 100)}% XP · +{s.prestige.creativityBonus} creativity · +{Math.round(s.prestige.royaltyBonus * 100)}% royalties
            </div>
            <Btn onClick={() => { if (confirm('Prestige resets your career (songs, money, gear) but keeps permanent bonuses. Continue?')) dispatch({ type: 'PRESTIGE' }) }}>
              ✨ Prestige Now
            </Btn>
          </div>
        </Section>
      )}
    </div>
  )
}
