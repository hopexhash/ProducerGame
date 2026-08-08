import { useRef, useState } from 'react'
import { useGame } from '../../state/GameContext'
import { Btn, GhostBtn, Section } from '../ui'
import { clearSave, exportSave, importSave, saveGame } from '../../systems/save'
import { careerLength, gameDate } from '../../systems/format'

export function Settings() {
  const { state: s, dispatch } = useGame()
  const [msg, setMsg] = useState('')
  const importRef = useRef<HTMLTextAreaElement>(null)
  const [showImport, setShowImport] = useState(false)
  const d = gameDate(s.day)

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      <Section title="Career Info">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div><div className="text-[10px] uppercase text-zinc-500">Producer</div>{s.producerName}</div>
          <div><div className="text-[10px] uppercase text-zinc-500">Home City</div>{s.homeCity}</div>
          <div><div className="text-[10px] uppercase text-zinc-500">Age</div>{s.age}</div>
          <div><div className="text-[10px] uppercase text-zinc-500">Date</div>{d.month} {d.day}, Year {d.year}</div>
          <div><div className="text-[10px] uppercase text-zinc-500">Career Length</div>{careerLength(s.day)}</div>
          <div><div className="text-[10px] uppercase text-zinc-500">Prestige</div>{s.prestige.count}</div>
        </div>
      </Section>

      <Section title="Save Management">
        <div className="text-xs text-zinc-500 mb-4">The game auto-saves to your browser after every action. Refreshing never loses progress.</div>
        <div className="flex flex-wrap gap-2">
          <Btn small onClick={() => { saveGame(s); setMsg('Game saved.') }}>💾 Manual Save</Btn>
          <GhostBtn onClick={() => {
            navigator.clipboard?.writeText(exportSave(s)).then(() => setMsg('Save copied to clipboard.')).catch(() => setMsg(exportSave(s).slice(0, 40) + '… (clipboard blocked — use Export below)'))
          }}>📤 Export Save</GhostBtn>
          <GhostBtn onClick={() => setShowImport(!showImport)}>📥 Import Save</GhostBtn>
          <GhostBtn className="!border-red-500/40 !text-red-300" onClick={() => {
            if (confirm('Reset your entire career? This cannot be undone.')) {
              clearSave()
              dispatch({ type: 'RESET_CAREER' })
            }
          }}>🗑 Reset Career</GhostBtn>
        </div>
        {showImport && (
          <div className="mt-4">
            <textarea ref={importRef} placeholder="Paste exported save code here…"
              className="w-full h-24 rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-xs font-mono focus:outline-none focus:border-indigo-400/60" />
            <Btn small className="mt-2" onClick={() => {
              const code = importRef.current?.value ?? ''
              const loaded = importSave(code)
              if (loaded) { dispatch({ type: 'LOAD_GAME', state: loaded }); setMsg('Save imported successfully.'); setShowImport(false) }
              else setMsg('Invalid save code.')
            }}>Import</Btn>
          </div>
        )}
        {msg && <div className="text-xs text-emerald-300 mt-3">{msg}</div>}
      </Section>
    </div>
  )
}
