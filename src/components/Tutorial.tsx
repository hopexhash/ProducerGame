import { motion } from 'framer-motion'
import { useGame } from '../state/GameContext'
import type { Page } from './App'

const STEPS: { text: string; page: Page; cta: string }[] = [
  { text: 'Welcome to the studio! Start by producing your very first track.', page: 'create', cta: 'Create Track' },
  { text: 'Track finished! Now release it to the world from your song library.', page: 'songs', cta: 'Release It' },
  { text: 'Your song is live! Check the Analytics page to watch your streams come in.', page: 'analytics', cta: 'View Streams' },
  { text: 'Streams earn royalties over time. Advance days from the Dashboard to let them grow, then invest in better gear.', page: 'studio', cta: 'Open Studio' },
  { text: 'Buy your first piece of equipment to boost your skills (the Audio Interface is affordable).', page: 'studio', cta: 'Upgrade Gear' },
]

export function TutorialBanner({ go }: { go: (p: Page) => void }) {
  const { state: s, dispatch } = useGame()
  if (s.tutorialStep >= 5) {
    if (s.tutorialStep === 5) {
      // graduate the tutorial once
      setTimeout(() => dispatch({ type: 'TUTORIAL_ADVANCE', step: 6 }), 0)
      return (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="glass px-4 py-3 mb-4 border-emerald-400/40 flex items-center gap-3">
          <span className="text-xl">🎓</span>
          <div className="text-sm"><span className="font-bold text-emerald-300">Tutorial complete!</span> The whole career is open to you now. Good luck out there.</div>
        </motion.div>
      )
    }
    return null
  }
  // step 3 needs a manual acknowledge to move to gear step
  const step = STEPS[s.tutorialStep]
  if (!step) return null
  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
      className="glass px-4 py-3 mb-4 border-indigo-400/40 flex flex-wrap items-center gap-3">
      <span className="text-xl">🧭</span>
      <div className="text-sm flex-1 min-w-[200px]">
        <span className="text-[10px] uppercase tracking-widest text-indigo-300 block">Tutorial {s.tutorialStep + 1}/5</span>
        {step.text}
      </div>
      <button
        className="btn-primary rounded-lg px-4 py-1.5 text-xs font-semibold"
        onClick={() => {
          if (s.tutorialStep === 3) dispatch({ type: 'TUTORIAL_ADVANCE', step: 4 })
          go(step.page)
        }}
      >{step.cta} →</button>
    </motion.div>
  )
}
