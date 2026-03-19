import React, {
  createContext,
  useContext,
  useReducer,
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import type { GameState, GameAction, UIState, DepartmentId, Toast } from '../types';
import { gameReducer } from '../store/gameReducer';
import { createInitialState } from '../store/gameState';
import { saveGame, loadGame, clearSave } from '../store/persistence';
import { computeDepartmentEarnings, computeTotalIncomePerMinute } from '../utils/earnings';
import { ACHIEVEMENTS } from '../data/achievements';

const INITIAL_UI: UIState = {
  activeModal: null,
  activeDepartmentId: null,
  offlineEarningsAmount: 0,
  offlineEarningsDurationMs: 0,
  activeTab: 'store',
  toasts: [],
};

interface GameContextValue {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  uiState: UIState;
  setUIState: React.Dispatch<React.SetStateAction<UIState>>;
  openDepartment: (id: DepartmentId) => void;
  closeModal: () => void;
  resetGame: () => void;
  prestige: () => void;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  totalIncomePerMinute: number;
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, undefined, createInitialState);
  const [uiState, setUIState] = useState<UIState>(INITIAL_UI);

  // Keep ref to latest state for intervals (stale closure prevention)
  const stateRef = useRef(state);
  useEffect(() => { stateRef.current = state; }, [state]);

  // Track previous achievements to detect newly unlocked ones
  const prevAchievementsRef = useRef<string[]>(state.achievements);

  // Watch for newly unlocked achievements and show toasts
  useEffect(() => {
    const prev = prevAchievementsRef.current;
    const newOnes = state.achievements.filter(id => !prev.includes(id));
    if (newOnes.length > 0) {
      newOnes.forEach(id => {
        const def = ACHIEVEMENTS.find(a => a.id === id);
        if (def) {
          addToast({ message: def.name, emoji: def.emoji });
        }
      });
    }
    prevAchievementsRef.current = state.achievements;
  }, [state.achievements]); // eslint-disable-line react-hooks/exhaustive-deps

  // Load save & offline earnings on mount
  useEffect(() => {
    const loaded = loadGame();
    if (loaded) {
      dispatch({ type: 'LOAD_STATE', payload: { state: loaded.state } });
      if (loaded.offlineAmount > 1) {
        dispatch({ type: 'APPLY_OFFLINE_EARNINGS', payload: { amount: loaded.offlineAmount } });
        setUIState(prev => ({
          ...prev,
          activeModal: 'offline_earnings',
          offlineEarningsAmount: loaded.offlineAmount,
          offlineEarningsDurationMs: loaded.offlineDurationMs,
        }));
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Game loop tick (1 s)
  useEffect(() => {
    const id = setInterval(() => {
      const s = stateRef.current;
      const deltaMs = s.settings.tickRateMs;
      dispatch({ type: 'TICK', payload: { deltaMs } });
    }, state.settings.tickRateMs);
    return () => clearInterval(id);
  }, [state.settings.tickRateMs]);

  // Auto-save (30 s)
  useEffect(() => {
    const id = setInterval(() => {
      saveGame(stateRef.current);
    }, state.settings.autoSaveIntervalMs);
    return () => clearInterval(id);
  }, [state.settings.autoSaveIntervalMs]);

  const totalIncomePerMinute = useMemo(
    () => computeTotalIncomePerMinute(state),
    [state]
  );

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = `${Date.now()}-${Math.random()}`;
    setUIState(prev => ({
      ...prev,
      toasts: [...prev.toasts.slice(-2), { ...toast, id }], // max 3 at once
    }));
    setTimeout(() => {
      setUIState(prev => ({ ...prev, toasts: prev.toasts.filter(t => t.id !== id) }));
    }, 3000);
  }, []);

  const openDepartment = (id: DepartmentId) => {
    setUIState(prev => ({ ...prev, activeModal: 'department', activeDepartmentId: id }));
  };

  const closeModal = () => {
    setUIState(prev => ({ ...prev, activeModal: null, activeDepartmentId: null }));
  };

  const resetGame = () => {
    clearSave();
    dispatch({ type: 'RESET_GAME' });
    setUIState(INITIAL_UI);
  };

  const prestige = () => {
    dispatch({ type: 'PRESTIGE' });
  };

  return (
    <GameContext.Provider value={{
      state, dispatch, uiState, setUIState,
      openDepartment, closeModal, resetGame, prestige, addToast,
      totalIncomePerMinute,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used inside <GameProvider>');
  return ctx;
}

// Convenience hook for one department's computed earnings
export function useDepartmentEarnings(id: DepartmentId) {
  const { state } = useGame();
  return useMemo(
    () => computeDepartmentEarnings(state.departments[id], state.prestigeCount),
    [state.departments[id], state.prestigeCount]  // eslint-disable-line react-hooks/exhaustive-deps
  );
}
