import type { GameState } from '../types'
import { SAVE_VERSION } from './engine'

const KEY = 'producer-life-save-v1'

export function saveGame(state: GameState): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch (e) {
    console.error('Save failed', e)
  }
}

export function loadGame(): GameState | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as GameState
    if (!parsed || typeof parsed.day !== 'number' || parsed.version !== SAVE_VERSION) return null
    // never restore transient modals from disk in a weird half-state
    parsed.toasts = []
    return parsed
  } catch {
    return null
  }
}

export function clearSave(): void {
  localStorage.removeItem(KEY)
}

export function exportSave(state: GameState): string {
  return btoa(unescape(encodeURIComponent(JSON.stringify(state))))
}

export function importSave(encoded: string): GameState | null {
  try {
    const parsed = JSON.parse(decodeURIComponent(escape(atob(encoded.trim())))) as GameState
    if (!parsed || typeof parsed.day !== 'number') return null
    parsed.toasts = []
    return parsed
  } catch {
    return null
  }
}
