import type { GameState } from '../types';
import { SAVE_KEY, SCHEMA_VERSION } from './gameState';
import { computeOfflineEarnings } from '../utils/earnings';

export function saveGame(state: GameState): void {
  try {
    const toSave = { ...state, lastSaved: Date.now() };
    localStorage.setItem(SAVE_KEY, JSON.stringify(toSave));
  } catch {
    // Storage might be full – silently ignore
  }
}

export function loadGame(): { state: GameState; offlineAmount: number; offlineDurationMs: number } | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as GameState;

    // Schema migration: if version mismatch, merge onto fresh state
    if (parsed.version !== SCHEMA_VERSION) {
      return null;
    }

    const { amount, durationMs } = computeOfflineEarnings(parsed);

    return {
      state: { ...parsed, lastTick: Date.now(), lastSaved: Date.now() },
      offlineAmount: amount,
      offlineDurationMs: durationMs,
    };
  } catch {
    return null;
  }
}

export function clearSave(): void {
  localStorage.removeItem(SAVE_KEY);
}
