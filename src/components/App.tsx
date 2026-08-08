import { useState } from 'react'
import { useGame } from '../state/GameContext'
import { Onboarding } from './Onboarding'
import { Dashboard } from './pages/Dashboard'
import { CreateSong } from './pages/CreateSong'
import { Songs } from './pages/Songs'
import { Studio } from './pages/Studio'
import { Career } from './pages/Career'
import { Analytics } from './pages/Analytics'
import { Charts } from './pages/Charts'
import { Social } from './pages/Social'
import { Trophies } from './pages/Trophies'
import { Settings } from './pages/Settings'
import { AchievementPopups, EventModal, LevelUpModal, Toasts, ViralModal } from './Overlays'
import { TutorialBanner } from './Tutorial'
import { fmt, fmtMoney, gameDate } from '../systems/format'
import { titleForLevel } from '../data/levels'

export type Page = 'dashboard' | 'create' | 'songs' | 'studio' | 'career' | 'analytics' | 'charts' | 'social' | 'trophies' | 'settings'

const NAV: { id: Page; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
  { id: 'create', label: 'Create Track', icon: '🎹' },
  { id: 'songs', label: 'Song Library', icon: '💿' },
  { id: 'studio', label: 'Studio & Store', icon: '🎚️' },
  { id: 'career', label: 'Career', icon: '💼' },
  { id: 'analytics', label: 'Analytics', icon: '📊' },
  { id: 'charts', label: 'Charts', icon: '🏆' },
  { id: 'social', label: 'Social Media', icon: '📱' },
  { id: 'trophies', label: 'Trophies', icon: '🎖️' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
]

export default function App() {
  const { state: s } = useGame()
  const [page, setPage] = useState<Page>('dashboard')

  if (!s.started) return <Onboarding />

  const d = gameDate(s.day)

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* sidebar */}
      <aside className="lg:w-60 shrink-0 lg:h-screen lg:sticky lg:top-0 flex lg:flex-col border-b lg:border-b-0 lg:border-r border-white/5 bg-black/30 backdrop-blur-xl z-40">
        <div className="hidden lg:block p-5">
          <div className="text-lg font-black text-gradient">PRODUCER LIFE</div>
          <div className="text-[11px] text-zinc-500 mt-0.5">{s.producerName} · Lv {s.level} {titleForLevel(s.level)}</div>
        </div>
        <nav className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible flex-1 px-2 lg:px-3 py-2 gap-1">
          {NAV.map(n => (
            <button key={n.id} onClick={() => setPage(n.id)}
              className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium whitespace-nowrap transition ${page === n.id ? 'bg-indigo-500/20 text-indigo-200 ring-1 ring-indigo-400/30' : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'}`}>
              <span>{n.icon}</span><span className="hidden sm:inline">{n.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* main */}
      <div className="flex-1 min-w-0">
        {/* top bar */}
        <header className="sticky top-0 z-30 backdrop-blur-xl bg-black/40 border-b border-white/5 px-4 py-2.5 flex items-center gap-4 text-sm overflow-x-auto">
          <span className="text-zinc-400 whitespace-nowrap">📅 {d.month.slice(0, 3)} {d.day}, Y{d.year}</span>
          <span className="text-emerald-300 font-semibold whitespace-nowrap tabular-nums">{fmtMoney(s.money)}</span>
          <span className="text-sky-300 whitespace-nowrap tabular-nums">🎧 {fmt(s.totalStreams)}</span>
          <span className="text-fuchsia-300 whitespace-nowrap tabular-nums">👥 {fmt(s.followers)}</span>
          <span className={`whitespace-nowrap tabular-nums ${s.energy < 25 ? 'text-red-400' : 'text-lime-300'}`}>⚡ {Math.round(s.energy)}</span>
          <span className="text-amber-300 whitespace-nowrap tabular-nums">⭐ {fmt(s.reputation)}</span>
        </header>

        <main className="p-4 lg:p-6 max-w-6xl mx-auto">
          <TutorialBanner go={setPage} />
          {page === 'dashboard' && <Dashboard go={setPage} />}
          {page === 'create' && <CreateSong go={setPage} />}
          {page === 'songs' && <Songs />}
          {page === 'studio' && <Studio />}
          {page === 'career' && <Career />}
          {page === 'analytics' && <Analytics />}
          {page === 'charts' && <Charts />}
          {page === 'social' && <Social />}
          {page === 'trophies' && <Trophies />}
          {page === 'settings' && <Settings />}
        </main>
      </div>

      <Toasts />
      <LevelUpModal />
      <ViralModal />
      <EventModal />
      <AchievementPopups />
    </div>
  )
}
