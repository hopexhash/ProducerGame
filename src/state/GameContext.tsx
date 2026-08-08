import { createContext, useContext, useEffect, useReducer, useRef } from 'react'
import type { ReactNode, Dispatch } from 'react'
import type { GameState } from '../types'
import { reducer } from './reducer'
import type { Action } from './reducer'
import { newGame } from '../systems/engine'
import { loadGame, saveGame } from '../systems/save'

interface Ctx {
  state: GameState
  dispatch: Dispatch<Action>
}

const GameContext = createContext<Ctx | null>(null)

function init(): GameState {
  const saved = loadGame()
  if (saved) return saved
  const fresh = newGame('', 18, '', 'Afro House')
  fresh.started = false
  return fresh
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, init)
  const saveTimer = useRef<number | null>(null)

  // Auto-save (debounced) on every state change
  useEffect(() => {
    if (!state.started) return
    if (saveTimer.current) window.clearTimeout(saveTimer.current)
    saveTimer.current = window.setTimeout(() => saveGame(state), 400)
    return () => { if (saveTimer.current) window.clearTimeout(saveTimer.current) }
  }, [state])

  return <GameContext.Provider value={{ state, dispatch }}>{children}</GameContext.Provider>
}

export function useGame(): Ctx {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame outside provider')
  return ctx
}
