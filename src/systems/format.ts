export function fmt(n: number): string {
  const abs = Math.abs(n)
  if (abs >= 1_000_000_000) return (n / 1_000_000_000).toFixed(abs >= 10_000_000_000 ? 0 : 2) + 'B'
  if (abs >= 1_000_000) return (n / 1_000_000).toFixed(abs >= 10_000_000 ? 1 : 2) + 'M'
  if (abs >= 10_000) return (n / 1_000).toFixed(1) + 'K'
  return Math.round(n).toLocaleString()
}

export function fmtMoney(n: number): string {
  return '$' + fmt(n)
}

export function fmtFull(n: number): string {
  return Math.round(n).toLocaleString()
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export function gameDate(day: number): { day: number; month: string; monthIndex: number; year: number } {
  const year = Math.floor(day / 360) + 1
  const monthIndex = Math.floor((day % 360) / 30)
  const dom = (day % 30) + 1
  return { day: dom, month: MONTHS[monthIndex], monthIndex, year }
}

export function careerLength(day: number): string {
  const years = Math.floor(day / 360)
  const months = Math.floor((day % 360) / 30)
  if (years === 0 && months === 0) return `${day} days`
  if (years === 0) return `${months} mo`
  return `${years}y ${months}mo`
}

export function qualityRating(q: number): { label: string; color: string } {
  if (q <= 30) return { label: 'Amateur', color: 'text-zinc-400' }
  if (q <= 50) return { label: 'Decent', color: 'text-zinc-300' }
  if (q <= 65) return { label: 'Good', color: 'text-sky-400' }
  if (q <= 75) return { label: 'Professional', color: 'text-indigo-400' }
  if (q <= 85) return { label: 'Excellent', color: 'text-purple-400' }
  if (q <= 94) return { label: 'Hit Potential', color: 'text-fuchsia-400' }
  return { label: 'Masterpiece', color: 'text-amber-400' }
}
