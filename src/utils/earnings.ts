import type { DepartmentState, DepartmentEarnings, GameState } from '../types';
import type { DepartmentId } from '../types';
import { DEPARTMENTS } from '../data/departments';
import { UPGRADES } from '../data/upgrades';
import { levelScaling, hireCost, upgradeCost } from './levelMath';

export function computeDepartmentEarnings(
  deptState: DepartmentState,
): DepartmentEarnings {
  const def = DEPARTMENTS[deptState.id];

  // Current product = highest unlocked
  const unlockedProducts = def.products.filter(p => p.unlockLevel <= deptState.level);
  const currentProduct = unlockedProducts[unlockedProducts.length - 1] ?? def.products[0];

  // Next product
  const nextProduct = def.products.find(p => p.unlockLevel > deptState.level) ?? null;

  // Collect purchased upgrade effects for this department + global
  let incomeMultiplier = 1;
  let customerMultiplier = 1;
  let maxEmpBonus = 0;

  const purchasedIds = new Set(
    deptState.upgrades.filter(u => u.purchased).map(u => u.upgradeId)
  );

  for (const upg of UPGRADES) {
    if (!purchasedIds.has(upg.id)) continue;
    if (upg.departmentId !== deptState.id && upg.departmentId !== 'global') continue;
    if (upg.departmentId === 'global' && upg.effectType !== 'income_multiplier') continue;

    switch (upg.effectType) {
      case 'income_multiplier':   incomeMultiplier   *= upg.effectValue; break;
      case 'customer_multiplier': customerMultiplier *= upg.effectValue; break;
      case 'max_employees_bonus': maxEmpBonus        += upg.effectValue; break;
    }
  }

  const maxEmployees = def.maxEmployeesBase + maxEmpBonus;

  // Base customers per minute scales softly with level
  const baseCPM = def.baseCustomersPerMinute * Math.log2(deptState.level + 1);
  const effectiveCustomersPerMinute = deptState.employees * baseCPM * customerMultiplier;

  const totalProductValue = currentProduct.basePrice * levelScaling(deptState.level) * incomeMultiplier;
  const moneyPerMinute = totalProductValue * effectiveCustomersPerMinute;

  return {
    departmentId: deptState.id,
    currentProduct,
    nextProduct,
    effectiveCustomersPerMinute,
    totalProductValue,
    moneyPerMinute,
    maxEmployees,
    incomeMultiplier,
    customerMultiplier,
    hireCost: hireCost(deptState.employees),
    upgradeCost: upgradeCost(deptState.level),
  };
}

export function computeTotalIncomePerMinute(state: GameState): number {
  let total = 0;
  for (const id of Object.keys(state.departments) as DepartmentId[]) {
    total += computeDepartmentEarnings(state.departments[id]).moneyPerMinute;
  }
  return total;
}

export function computeOfflineEarnings(
  state: GameState,
): { amount: number; durationMs: number } {
  const now = Date.now();
  const elapsed = now - state.lastSaved;

  // Check if offline cap upgrade is purchased
  const hasCapUpgrade = state.globalUpgrades.some(
    u => u.upgradeId === 'global_offline_cap' && u.purchased
  );
  const capHours = state.offlineEarningsCap + (hasCapUpgrade ? 1 : 0);
  const capMs = capHours * 60 * 60 * 1000;
  const durationMs = Math.min(elapsed, capMs);
  const durationMinutes = durationMs / 60_000;

  // Offline efficiency
  const hasEfficiencyUpgrade = state.globalUpgrades.some(
    u => u.upgradeId === 'global_offline_efficiency' && u.purchased
  );
  const efficiency = hasEfficiencyUpgrade ? 0.75 : 0.5;

  const incomePerMin = computeTotalIncomePerMinute(state);
  const amount = incomePerMin * durationMinutes * efficiency;

  return { amount, durationMs };
}
