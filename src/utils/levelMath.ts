/**
 * Cost to upgrade a department from its current level to level+1.
 * Exponential curve: baseCost * 1.15^(level-1)
 */
export function upgradeCost(level: number): number {
  const baseCost = 100;
  return Math.floor(baseCost * Math.pow(1.18, level - 1));
}

/**
 * Cost to hire the next employee (0-indexed current count).
 */
export function hireCost(currentEmployees: number): number {
  return Math.floor(50 * Math.pow(1.12, currentEmployees));
}

/**
 * Level scaling multiplier applied to product base price.
 * Linear 15% per level.
 */
export function levelScaling(level: number): number {
  return 1 + (level - 1) * 0.15;
}
