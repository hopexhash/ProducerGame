import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { fmt } from '../systems/format'

/** Number that animates upward when its value increases. */
export function AnimatedNumber({ value, format = fmt, className = '' }: { value: number; format?: (n: number) => string; className?: string }) {
  const [display, setDisplay] = useState(value)
  const prev = useRef(value)

  useEffect(() => {
    const from = prev.current
    const to = value
    prev.current = value
    if (from === to) return
    const duration = 600
    const start = performance.now()
    let raf: number
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplay(from + (to - from) * eased)
      if (t < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [value])

  return <span className={className}>{format(display)}</span>
}

export function ProgressBar({ value, max, className = '', barClass = 'bg-gradient-to-r from-indigo-500 to-purple-500' }: { value: number; max: number; className?: string; barClass?: string }) {
  const pct = Math.max(0, Math.min(100, (value / Math.max(1, max)) * 100))
  return (
    <div className={`h-2 rounded-full bg-white/5 overflow-hidden ${className}`}>
      <motion.div
        className={`h-full rounded-full ${barClass}`}
        initial={false}
        animate={{ width: `${pct}%` }}
        transition={{ type: 'spring', stiffness: 90, damping: 20 }}
      />
    </div>
  )
}

export function StatCard({ label, children, sub, accent = false }: { label: string; children: ReactNode; sub?: ReactNode; accent?: boolean }) {
  return (
    <div className={`glass glass-hover p-4 ${accent ? 'ring-1 ring-indigo-500/30' : ''}`}>
      <div className="text-[11px] uppercase tracking-widest text-zinc-500 mb-1">{label}</div>
      <div className="text-2xl font-bold tabular-nums">{children}</div>
      {sub && <div className="text-xs text-zinc-500 mt-1">{sub}</div>}
    </div>
  )
}

/** Minimal SVG area chart. */
export function AreaChart({ data, height = 120, color = '#818cf8', className = '' }: { data: number[]; height?: number; color?: string; className?: string }) {
  if (data.length < 2) {
    return <div className={`flex items-center justify-center text-xs text-zinc-600 ${className}`} style={{ height }}>Not enough data yet</div>
  }
  const w = 400
  const max = Math.max(...data, 1)
  const min = Math.min(...data, 0)
  const range = Math.max(1, max - min)
  const pts = data.map((v, i) => [
    (i / (data.length - 1)) * w,
    height - 8 - ((v - min) / range) * (height - 20),
  ])
  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')
  const area = `${line} L${w},${height} L0,${height} Z`
  const gid = `grad-${color.replace('#', '')}`
  return (
    <svg viewBox={`0 0 ${w} ${height}`} className={`w-full ${className}`} style={{ height }} preserveAspectRatio="none">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gid})`} />
      <motion.path d={line} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8 }} />
    </svg>
  )
}

export function SongCover({ hue, size = 48, title }: { hue: number; size?: number; title: string }) {
  return (
    <div
      className="rounded-lg shrink-0 flex items-center justify-center font-black text-white/80 select-none"
      style={{
        width: size, height: size,
        background: `linear-gradient(135deg, hsl(${hue} 70% 45%), hsl(${(hue + 60) % 360} 70% 30%))`,
        fontSize: size * 0.4,
      }}
    >
      {title.charAt(0).toUpperCase()}
    </div>
  )
}

export function Section({ title, children, right }: { title: string; children: ReactNode; right?: ReactNode }) {
  return (
    <div className="glass p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-400">{title}</h2>
        {right}
      </div>
      {children}
    </div>
  )
}

export function Btn({ children, onClick, disabled, className = '', small = false }: { children: ReactNode; onClick?: () => void; disabled?: boolean; className?: string; small?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn-primary rounded-xl font-semibold text-white ${small ? 'px-3 py-1.5 text-xs' : 'px-5 py-2.5 text-sm'} ${className}`}
    >
      {children}
    </button>
  )
}

export function GhostBtn({ children, onClick, disabled, className = '' }: { children: ReactNode; onClick?: () => void; disabled?: boolean; className?: string }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded-xl px-4 py-2 text-sm font-medium border border-white/10 hover:border-indigo-400/40 hover:bg-white/5 transition disabled:opacity-40 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  )
}
