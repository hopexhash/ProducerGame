import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import { useGame } from '../state/GameContext'
import { ACHIEVEMENTS } from '../data/achievements'
import { fmtFull } from '../systems/format'

const TOAST_COLORS: Record<string, string> = {
  stream: 'border-sky-400/40 text-sky-200',
  money: 'border-emerald-400/40 text-emerald-200',
  xp: 'border-indigo-400/40 text-indigo-200',
  follower: 'border-fuchsia-400/40 text-fuchsia-200',
  info: 'border-white/15 text-zinc-200',
  success: 'border-emerald-400/40 text-emerald-200',
  warn: 'border-amber-400/50 text-amber-200',
  levelup: 'border-purple-400/60 text-purple-100',
}

export function Toasts() {
  const { state, dispatch } = useGame()

  useEffect(() => {
    if (!state.toasts.length) return
    const timers = state.toasts.map(t =>
      window.setTimeout(() => dispatch({ type: 'DISMISS_TOAST', id: t.id }), 4200))
    return () => timers.forEach(clearTimeout)
  }, [state.toasts, dispatch])

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 items-end pointer-events-none max-w-[90vw]">
      <AnimatePresence>
        {state.toasts.map(t => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 60, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, scale: 0.9 }}
            className={`glass px-4 py-2.5 text-sm font-medium border ${TOAST_COLORS[t.kind] ?? TOAST_COLORS.info} pointer-events-auto cursor-pointer`}
            onClick={() => dispatch({ type: 'DISMISS_TOAST', id: t.id })}
          >
            {t.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export function LevelUpModal() {
  const { state, dispatch } = useGame()
  const lu = state.pendingLevelUp
  return (
    <AnimatePresence>
      {lu && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={() => dispatch({ type: 'CLEAR_LEVELUP' })}
        >
          <motion.div
            className="glass p-10 text-center max-w-md w-full relative overflow-hidden"
            initial={{ scale: 0.6, y: 60 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 18 }}
            onClick={e => e.stopPropagation()}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-600/20 via-transparent to-purple-600/20 pointer-events-none" />
            <motion.div
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.15, type: 'spring', stiffness: 300 }}
              className="text-5xl mb-3"
            >⚡</motion.div>
            <div className="text-xs uppercase tracking-[0.35em] text-indigo-300 mb-2">Level Up</div>
            <div className="text-6xl font-black text-gradient mb-2">{lu.level}</div>
            <div className="text-xl font-bold mb-4">{lu.title}</div>
            <div className="text-sm text-zinc-400 mb-1">+1 skill point · Energy restored</div>
            {lu.unlocks.length > 0 && (
              <div className="mt-4 text-left glass p-4">
                <div className="text-[11px] uppercase tracking-widest text-zinc-500 mb-2">New Unlocks</div>
                {lu.unlocks.map(u => <div key={u} className="text-sm text-emerald-300">✦ {u}</div>)}
              </div>
            )}
            <button className="btn-primary rounded-xl px-8 py-2.5 mt-6 font-semibold" onClick={() => dispatch({ type: 'CLEAR_LEVELUP' })}>
              Keep Grinding
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function ViralModal() {
  const { state, dispatch } = useGame()
  const v = state.pendingViral
  return (
    <AnimatePresence>
      {v && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={() => dispatch({ type: 'CLEAR_VIRAL' })}
        >
          <motion.div
            className="glass p-10 text-center max-w-md w-full relative overflow-hidden border-fuchsia-500/40"
            initial={{ scale: 0.5, rotate: -3 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 250, damping: 15 }}
            onClick={e => e.stopPropagation()}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-600/25 via-transparent to-sky-600/25 pointer-events-none animate-pulse" />
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.2 }} className="text-5xl mb-3">🔥</motion.div>
            <div className="text-2xl font-black text-gradient mb-1">YOUR SONG IS GOING VIRAL!</div>
            <div className="text-lg font-bold mb-2">"{v.songTitle}"</div>
            <div className="text-sm text-fuchsia-300 mb-4">{v.type}</div>
            <div className="text-3xl font-black text-sky-300 tabular-nums">+{fmtFull(v.streams)} streams today</div>
            <button className="btn-primary rounded-xl px-8 py-2.5 mt-6 font-semibold" onClick={() => dispatch({ type: 'CLEAR_VIRAL' })}>
              LET'S GO
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function EventModal() {
  const { state, dispatch } = useGame()
  const ev = state.activeEvent
  return (
    <AnimatePresence>
      {ev && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        >
          <motion.div
            className="glass p-8 max-w-md w-full"
            initial={{ scale: 0.85, y: 40 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 20 }}
          >
            <div className="text-[11px] uppercase tracking-widest text-amber-400 mb-2">Event</div>
            <div className="text-xl font-bold mb-2">{ev.title}</div>
            <div className="text-sm text-zinc-400 mb-6">{ev.desc}</div>
            <div className="flex flex-col gap-2">
              {ev.choices.map((c, i) => (
                <button
                  key={i}
                  className="text-left rounded-xl px-4 py-3 text-sm font-medium border border-white/10 hover:border-indigo-400/50 hover:bg-indigo-500/10 transition"
                  onClick={() => dispatch({ type: 'EVENT_CHOICE', index: i })}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function AchievementPopups() {
  const { state, dispatch } = useGame()
  const id = state.pendingAchievements[0]
  const def = id ? ACHIEVEMENTS.find(a => a.id === id) : null

  useEffect(() => {
    if (!id) return
    const t = window.setTimeout(() => dispatch({ type: 'CLEAR_ACHIEVEMENT', id }), 3500)
    return () => clearTimeout(t)
  }, [id, dispatch])

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
      <AnimatePresence>
        {def && (
          <motion.div
            key={def.id}
            initial={{ opacity: 0, y: -40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30 }}
            className="glass px-6 py-3 flex items-center gap-3 border-amber-400/40"
          >
            <div className="text-2xl">🏆</div>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-amber-400">Achievement Unlocked</div>
              <div className="font-bold text-sm">{def.name}</div>
              <div className="text-xs text-zinc-400">{def.desc} · +{def.xp} XP</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
