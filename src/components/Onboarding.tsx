import { useState } from 'react'
import { motion } from 'framer-motion'
import { useGame } from '../state/GameContext'
import { GENRES } from '../data/genres'
import { CITIES } from '../data/names'
import type { Genre } from '../types'
import { Btn } from './ui'

export function Onboarding() {
  const { dispatch } = useGame()
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [age, setAge] = useState(18)
  const [city, setCity] = useState(CITIES[0])
  const [genre, setGenre] = useState<Genre>('Afro House')

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        className="glass p-8 md:p-12 max-w-lg w-full"
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
      >
        {step === 0 && (
          <div className="text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }} className="text-6xl mb-4">🎛️</motion.div>
            <h1 className="text-4xl font-black text-gradient mb-3">PRODUCER LIFE</h1>
            <p className="text-zinc-400 mb-8 text-sm leading-relaxed">
              Start as a completely unknown bedroom producer.<br />
              Make tracks. Gain streams. Sign deals.<br />
              Become one of the biggest producers in the world.
            </p>
            <Btn onClick={() => setStep(1)} className="w-full py-3">Start Your Career</Btn>
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 className="text-xl font-bold mb-6">Who are you?</h2>
            <label className="block mb-4">
              <span className="text-xs uppercase tracking-widest text-zinc-500">Producer Name</span>
              <input
                value={name} onChange={e => setName(e.target.value)} maxLength={24}
                placeholder="e.g. NOVAWAVE"
                className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-indigo-400/60"
              />
            </label>
            <label className="block mb-4">
              <span className="text-xs uppercase tracking-widest text-zinc-500">Age: {age}</span>
              <input type="range" min={16} max={40} value={age} onChange={e => setAge(+e.target.value)} className="w-full mt-2" />
            </label>
            <label className="block mb-4">
              <span className="text-xs uppercase tracking-widest text-zinc-500">Home City</span>
              <select value={city} onChange={e => setCity(e.target.value)}
                className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-indigo-400/60 [&>option]:bg-zinc-900">
                {CITIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </label>
            <label className="block mb-6">
              <span className="text-xs uppercase tracking-widest text-zinc-500">Favorite Genre</span>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {GENRES.map(g => (
                  <button key={g} onClick={() => setGenre(g)}
                    className={`rounded-lg px-2 py-2 text-xs font-medium border transition ${genre === g ? 'border-indigo-400 bg-indigo-500/20 text-indigo-200' : 'border-white/10 text-zinc-400 hover:border-white/25'}`}>
                    {g}
                  </button>
                ))}
              </div>
            </label>
            <Btn onClick={() => name.trim() && setStep(2)} disabled={!name.trim()} className="w-full py-3">Continue</Btn>
          </div>
        )}

        {step === 2 && (
          <div className="text-center">
            <h2 className="text-2xl font-black text-gradient mb-6">WELCOME TO YOUR<br />PRODUCER CAREER</h2>
            <div className="glass p-5 text-left mb-6 text-sm space-y-2">
              <div className="flex justify-between"><span className="text-zinc-500">Starting cash</span><span className="font-bold text-emerald-300">$500</span></div>
              <div className="flex justify-between"><span className="text-zinc-500">Streams</span><span className="font-bold">0</span></div>
              <div className="flex justify-between"><span className="text-zinc-500">Followers</span><span className="font-bold">25</span></div>
              <div className="flex justify-between"><span className="text-zinc-500">Gear</span><span className="font-bold">Old laptop · Cheap headphones</span></div>
            </div>
            <p className="text-sm text-zinc-400 mb-6">
              <span className="text-zinc-300 font-semibold">Goal:</span> become one of the world's greatest music producers.
            </p>
            <Btn className="w-full py-3" onClick={() => dispatch({ type: 'START_GAME', name: name.trim(), age, city, favoriteGenre: genre })}>
              Enter the Studio
            </Btn>
          </div>
        )}
      </motion.div>
    </div>
  )
}
