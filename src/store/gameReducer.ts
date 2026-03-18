import type { GameState, GameAction, DepartmentId } from '../types';
import { createInitialState } from './gameState';
import { computeDepartmentEarnings, computeTotalIncomePerMinute } from '../utils/earnings';
import { upgradeCost } from '../utils/levelMath';
import { UPGRADES } from '../data/upgrades';

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {

    case 'TICK': {
      const deltaMinutes = action.payload.deltaMs / 60_000;
      const earned = computeTotalIncomePerMinute(state) * deltaMinutes;
      return {
        ...state,
        money: state.money + earned,
        totalEarned: state.totalEarned + earned,
        lastTick: state.lastTick + action.payload.deltaMs,
      };
    }

    case 'HIRE_EMPLOYEE': {
      const { departmentId } = action.payload;
      const dept = state.departments[departmentId];
      const earn = computeDepartmentEarnings(dept);
      const cost = earn.hireCost;
      if (state.money < cost || dept.employees >= earn.maxEmployees) return state;

      return {
        ...state,
        money: state.money - cost,
        departments: {
          ...state.departments,
          [departmentId]: { ...dept, employees: dept.employees + 1 },
        },
      };
    }

    case 'UPGRADE_DEPARTMENT': {
      const { departmentId } = action.payload;
      const dept = state.departments[departmentId];
      const cost = upgradeCost(dept.level);
      if (state.money < cost) return state;

      return {
        ...state,
        money: state.money - cost,
        departments: {
          ...state.departments,
          [departmentId]: { ...dept, level: dept.level + 1 },
        },
      };
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

      if (upgDef.departmentId === 'global') {
        return {
          ...state,
          money: state.money - upgDef.cost,
          globalUpgrades: state.globalUpgrades.map(u =>
            u.upgradeId === upgradeId ? { ...u, purchased: true } : u
          ),
        };
      }

      const deptId = upgDef.departmentId as DepartmentId;
      return {
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
      return action.payload.state;
    }

    case 'RESET_GAME': {
      return createInitialState();
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
