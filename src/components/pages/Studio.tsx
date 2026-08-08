import { useGame } from '../../state/GameContext'
import { EQUIPMENT, STUDIO_TIERS } from '../../data/equipment'
import { PLUGINS } from '../../data/plugins'
import { Btn, Section } from '../ui'
import { fmtMoney } from '../../systems/format'
import { effectiveSkill, gearBonuses } from '../../systems/quality'

export function Studio() {
  const { state: s, dispatch } = useGame()
  const spent = s.equipmentOwned.reduce((a, id) => a + (EQUIPMENT.find(e => e.id === id)?.cost ?? 0), 0)
  const tier = [...STUDIO_TIERS].reverse().find(t => spent >= t.minSpent) ?? STUDIO_TIERS[0]
  const gear = gearBonuses(s)

  return (
    <div className="space-y-4">
      <div className="glass p-6">
        <div className="text-xs uppercase tracking-widest text-zinc-500">Your Studio</div>
        <div className="text-3xl font-black text-gradient">{tier.name}</div>
        <div className="text-sm text-zinc-400 mt-1">
          {s.equipmentOwned.length === 0
            ? 'Old laptop · cheap headphones · free DAW plugins · bedroom desk'
            : `${s.equipmentOwned.length} upgrades · ${fmtMoney(spent)} invested`}
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-4 text-center">
          {([['Production', 'production'], ['Mixing', 'mixing'], ['Mastering', 'mastering'], ['Songwriting', 'songwriting'], ['Networking', 'networking'], ['Marketing', 'marketing']] as const).map(([label, k]) => (
            <div key={k} className="glass p-2">
              <div className="text-[10px] uppercase tracking-wide text-zinc-500">{label}</div>
              <div className="font-bold tabular-nums">{Math.round(effectiveSkill(s, k))}</div>
              {gear[k] > 0 && <div className="text-[10px] text-emerald-400">+{gear[k]} gear</div>}
            </div>
          ))}
        </div>
      </div>

      <Section title="Equipment Upgrades">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {EQUIPMENT.map(eq => {
            const owned = s.equipmentOwned.includes(eq.id)
            return (
              <div key={eq.id} className={`glass p-4 flex flex-col ${owned ? 'opacity-60 ring-1 ring-emerald-500/30' : 'glass-hover'}`}>
                <div className="flex justify-between items-start mb-1">
                  <div className="font-semibold text-sm">{eq.name}</div>
                  <span className="text-[10px] uppercase text-zinc-600">{eq.category}</span>
                </div>
                <div className="text-xs text-zinc-500 flex-1">{eq.desc}</div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-bold text-emerald-300 text-sm">{fmtMoney(eq.cost)}</span>
                  {owned
                    ? <span className="text-xs text-emerald-400 font-semibold">✓ OWNED</span>
                    : <Btn small disabled={s.money < eq.cost} onClick={() => dispatch({ type: 'BUY_EQUIPMENT', equipmentId: eq.id })}>Buy</Btn>}
                </div>
              </div>
            )
          })}
        </div>
      </Section>

      <Section title="Plugin Store">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {PLUGINS.map(pl => {
            const owned = s.pluginsOwned.includes(pl.id)
            return (
              <div key={pl.id} className={`glass p-4 flex flex-col ${owned ? 'opacity-60 ring-1 ring-emerald-500/30' : 'glass-hover'}`}>
                <div className="font-semibold text-sm mb-1">🎛 {pl.name}</div>
                <div className="text-xs text-zinc-500 flex-1">{pl.desc}</div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-bold text-emerald-300 text-sm">{fmtMoney(pl.cost)}</span>
                  {owned
                    ? <span className="text-xs text-emerald-400 font-semibold">✓ OWNED</span>
                    : <Btn small disabled={s.money < pl.cost} onClick={() => dispatch({ type: 'BUY_PLUGIN', pluginId: pl.id })}>Buy</Btn>}
                </div>
              </div>
            )
          })}
        </div>
      </Section>
    </div>
  )
}
