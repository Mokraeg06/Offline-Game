import type { GameState } from '../types';
import { DEPARTMENT_IDS } from '../data/departments';
import { UPGRADES } from '../data/upgrades';

export const SAVE_KEY = 'supermarket_idle_v1';
export const SCHEMA_VERSION = 1;

export function createInitialState(): GameState {
  const departments = {} as GameState['departments'];

  for (const id of DEPARTMENT_IDS) {
    const deptUpgradeIds = UPGRADES
      .filter(u => u.departmentId === id)
      .map(u => ({ upgradeId: u.id, purchased: false }));

    departments[id] = {
      id,
      level: 1,
      employees: 0,
      upgrades: deptUpgradeIds,
    };
  }

  const globalUpgradeIds = UPGRADES
    .filter(u => u.departmentId === 'global')
    .map(u => ({ upgradeId: u.id, purchased: false }));

  return {
    version: SCHEMA_VERSION,
    money: 50,        // starter money so player can hire immediately
    totalEarned: 0,
    lastSaved: Date.now(),
    lastTick: Date.now(),
    departments,
    globalUpgrades: globalUpgradeIds,
    offlineEarningsCap: 3,
    prestigeCount: 0,
    settings: {
      tickRateMs: 1000,
      autoSaveIntervalMs: 30_000,
    },
  };
}
