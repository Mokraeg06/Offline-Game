import React, {
  createContext,
  useContext,
  useReducer,
  useState,
  useRef,
  useEffect,
  useMemo,
} from 'react';
import type { GameState, GameAction, UIState, DepartmentId } from '../types';
import { gameReducer } from '../store/gameReducer';
import { createInitialState } from '../store/gameState';
import { saveGame, loadGame, clearSave } from '../store/persistence';
import { computeDepartmentEarnings, computeTotalIncomePerMinute } from '../utils/earnings';

const INITIAL_UI: UIState = {
  activeModal: null,
  activeDepartmentId: null,
  offlineEarningsAmount: 0,
  offlineEarningsDurationMs: 0,
  activeTab: 'store',
};

interface GameContextValue {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  uiState: UIState;
  setUIState: React.Dispatch<React.SetStateAction<UIState>>;
  openDepartment: (id: DepartmentId) => void;
  closeModal: () => void;
  resetGame: () => void;
  totalIncomePerMinute: number;
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, undefined, createInitialState);
  const [uiState, setUIState] = useState<UIState>(INITIAL_UI);

  // Keep ref to latest state for intervals (stale closure prevention)
  const stateRef = useRef(state);
  useEffect(() => { stateRef.current = state; }, [state]);

  // Load save & offline earnings on mount
  useEffect(() => {
    const loaded = loadGame();
    if (loaded) {
      dispatch({ type: 'LOAD_STATE', payload: { state: loaded.state } });
      if (loaded.offlineAmount > 1) {
        // Apply offline earnings immediately, show modal
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

  return (
    <GameContext.Provider value={{
      state, dispatch, uiState, setUIState,
      openDepartment, closeModal, resetGame,
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
    () => computeDepartmentEarnings(state.departments[id]),
    [state.departments[id]]  // eslint-disable-line react-hooks/exhaustive-deps
  );
}
