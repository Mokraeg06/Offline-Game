// ─── Static Data Types ───────────────────────────────────────────────────────

export type DepartmentId =
  | 'bakery'
  | 'fruit'
  | 'meat'
  | 'seafood'
  | 'electronics'
  | 'drinks';

export interface ProductDefinition {
  id: string;
  name: string;
  description: string;
  emoji: string;
  basePrice: number;
  unlockLevel: number;
}

export interface DepartmentDefinition {
  id: DepartmentId;
  name: string;
  emoji: string;
  color: string;       // CSS var value e.g. '#ef4444'
  baseCustomersPerMinute: number;
  maxEmployeesBase: number;
  products: ProductDefinition[];
}

// ─── Upgrade / Research Types ─────────────────────────────────────────────────

export type UpgradeEffectType =
  | 'income_multiplier'
  | 'customer_multiplier'
  | 'max_employees_bonus'
  | 'offline_efficiency';

export interface UpgradeDefinition {
  id: string;
  departmentId: DepartmentId | 'global';
  name: string;
  description: string;
  cost: number;
  effectType: UpgradeEffectType;
  effectValue: number;
  tier: number;
  requiresUpgradeId?: string;
}

// ─── Runtime State ────────────────────────────────────────────────────────────

export interface DepartmentUpgradeState {
  upgradeId: string;
  purchased: boolean;
}

export interface DepartmentState {
  id: DepartmentId;
  level: number;
  employees: number;
  upgrades: DepartmentUpgradeState[];
}

export interface GameState {
  version: number;
  money: number;
  totalEarned: number;
  lastSaved: number;
  lastTick: number;
  departments: Record<DepartmentId, DepartmentState>;
  globalUpgrades: DepartmentUpgradeState[];
  offlineEarningsCap: number; // hours
  prestigeCount: number;
  settings: {
    tickRateMs: number;
    autoSaveIntervalMs: number;
  };
}

// ─── Derived / Computed ───────────────────────────────────────────────────────

export interface DepartmentEarnings {
  departmentId: DepartmentId;
  currentProduct: ProductDefinition;
  nextProduct: ProductDefinition | null;
  effectiveCustomersPerMinute: number;
  totalProductValue: number;
  moneyPerMinute: number;
  maxEmployees: number;
  incomeMultiplier: number;
  customerMultiplier: number;
  hireCost: number;
  upgradeCost: number;
}

// ─── UI State ─────────────────────────────────────────────────────────────────

export type ModalType =
  | 'department'
  | 'research'
  | 'settings'
  | 'offline_earnings'
  | null;

export type NavTab = 'store' | 'research' | 'settings';

export interface UIState {
  activeModal: ModalType;
  activeDepartmentId: DepartmentId | null;
  offlineEarningsAmount: number;
  offlineEarningsDurationMs: number;
  activeTab: NavTab;
}

// ─── Actions ──────────────────────────────────────────────────────────────────

export type GameAction =
  | { type: 'TICK'; payload: { deltaMs: number } }
  | { type: 'HIRE_EMPLOYEE'; payload: { departmentId: DepartmentId } }
  | { type: 'UPGRADE_DEPARTMENT'; payload: { departmentId: DepartmentId } }
  | { type: 'PURCHASE_UPGRADE'; payload: { upgradeId: string } }
  | { type: 'APPLY_OFFLINE_EARNINGS'; payload: { amount: number } }
  | { type: 'LOAD_STATE'; payload: { state: GameState } }
  | { type: 'RESET_GAME' };
