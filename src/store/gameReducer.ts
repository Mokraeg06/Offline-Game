import type { GameState, GameAction, DepartmentId } from '../types';
import { createInitialState, PRESTIGE_THRESHOLD } from './gameState';
import { computeDepartmentEarnings, computeTotalIncomePerMinute } from '../utils/earnings';
import { upgradeCost } from '../utils/levelMath';
import { UPGRADES } from '../data/upgrades';

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {

    case 'TICK': {
      const deltaMinutes = action.payload.deltaMs / 60_000;
      const earned = computeTotalIncomePerMinute(state) * deltaMinutes;
      const next = {
        ...state,
        money: state.money + earned,
        totalEarned: state.totalEarned + earned,
        lastTick: state.lastTick + action.payload.deltaMs,
      };
      return checkAchievements(next);
    }

    case 'HIRE_EMPLOYEE': {
      const { departmentId } = action.payload;
      const dept = state.departments[departmentId];
      const earn = computeDepartmentEarnings(dept);
      const cost = earn.hireCost;
      if (state.money < cost || dept.employees >= earn.maxEmployees) return state;

      const next = {
        ...state,
        money: state.money - cost,
        departments: {
          ...state.departments,
          [departmentId]: { ...dept, employees: dept.employees + 1 },
        },
      };
      return checkAchievements(next);
    }

    case 'UPGRADE_DEPARTMENT': {
      const { departmentId } = action.payload;
      const dept = state.departments[departmentId];
      const cost = upgradeCost(dept.level);
      if (state.money < cost) return state;

      const next = {
        ...state,
        money: state.money - cost,
        departments: {
          ...state.departments,
          [departmentId]: { ...dept, level: dept.level + 1 },
        },
      };
      return checkAchievements(next);
    }

    case 'PURCHASE_UPGRADE': {
      const { upgradeId } = action.payload;
      const upgDef = UPGRADES.find(u => u.id === upgradeId);
      if (!upgDef || state.money < upgDef.cost) return state;

      // Check prerequisite
      if (upgDef.requiresUpgradeId) {
        const reqPurchased = isUpgradePurchased(state, upgDef.requiresUpgradeId, upgDef.departmentId as DepartmentId | 'global');
        if (!reqPurchased) return state;
      }

      // Check not already purchased
      if (isUpgradePurchased(state, upgradeId, upgDef.departmentId as DepartmentId | 'global')) return state;

      let next: GameState;
      if (upgDef.departmentId === 'global') {
        next = {
          ...state,
          money: state.money - upgDef.cost,
          globalUpgrades: state.globalUpgrades.map(u =>
            u.upgradeId === upgradeId ? { ...u, purchased: true } : u
          ),
        };
      } else {
        const deptId = upgDef.departmentId as DepartmentId;
        next = {
          ...state,
          money: state.money - upgDef.cost,
          departments: {
            ...state.departments,
            [deptId]: {
              ...state.departments[deptId],
              upgrades: state.departments[deptId].upgrades.map(u =>
                u.upgradeId === upgradeId ? { ...u, purchased: true } : u
              ),
            },
          },
        };
      }
      return checkAchievements(next);
    }

    case 'APPLY_OFFLINE_EARNINGS': {
      return {
        ...state,
        money: state.money + action.payload.amount,
        totalEarned: state.totalEarned + action.payload.amount,
        lastSaved: Date.now(),
        lastTick: Date.now(),
      };
    }

    case 'LOAD_STATE': {
      // Migrate old saves that don't have achievements
      const loaded = action.payload.state;
      return {
        ...loaded,
        achievements: loaded.achievements ?? [],
      };
    }

    case 'RESET_GAME': {
      return createInitialState();
    }

    case 'PRESTIGE': {
      const threshold = PRESTIGE_THRESHOLD * Math.pow(state.prestigeCount + 1, 1.5);
      if (state.totalEarned < threshold) return state;

      const newPrestigeCount = state.prestigeCount + 1;
      const initial = createInitialState();
      const newAchievements = state.achievements.includes('first_prestige')
        ? state.achievements
        : [...state.achievements, 'first_prestige'];

      return {
        ...initial,
        prestigeCount: newPrestigeCount,
        achievements: newAchievements,
        // Keep global upgrades after prestige
        globalUpgrades: state.globalUpgrades,
      };
    }

    default:
      return state;
  }
}

function isUpgradePurchased(
  state: GameState,
  upgradeId: string,
  departmentId: DepartmentId | 'global',
): boolean {
  if (departmentId === 'global') {
    return state.globalUpgrades.some(u => u.upgradeId === upgradeId && u.purchased);
  }
  return state.departments[departmentId]?.upgrades.some(
    u => u.upgradeId === upgradeId && u.purchased
  ) ?? false;
}

function checkAchievements(state: GameState): GameState {
  const has = (id: string) => state.achievements.includes(id);
  const newlyUnlocked: string[] = [];

  if (!has('first_hire') && Object.values(state.departments).some(d => d.employees > 0)) {
    newlyUnlocked.push('first_hire');
  }
  if (!has('first_upgrade') && Object.values(state.departments).some(d => d.level > 1)) {
    newlyUnlocked.push('first_upgrade');
  }
  if (!has('earned_1k') && state.totalEarned >= 1_000) {
    newlyUnlocked.push('earned_1k');
  }
  if (!has('earned_100k') && state.totalEarned >= 100_000) {
    newlyUnlocked.push('earned_100k');
  }
  if (!has('all_depts_lv5') && Object.values(state.departments).every(d => d.level >= 5)) {
    newlyUnlocked.push('all_depts_lv5');
  }

  const purchasedCount = [
    ...Object.values(state.departments).flatMap(d => d.upgrades),
    ...state.globalUpgrades,
  ].filter(u => u.purchased).length;
  if (!has('research_5') && purchasedCount >= 5) {
    newlyUnlocked.push('research_5');
  }

  if (!has('max_employees') && Object.values(state.departments).some(d => {
    const earn = computeDepartmentEarnings(d);
    return d.employees > 0 && d.employees >= earn.maxEmployees;
  })) {
    newlyUnlocked.push('max_employees');
  }

  if (newlyUnlocked.length === 0) return state;
  return { ...state, achievements: [...state.achievements, ...newlyUnlocked] };
}
