import type { UpgradeDefinition, DepartmentId } from '../types';

function deptUpgrades(deptId: DepartmentId, baseCost: number): UpgradeDefinition[] {
  const t1id = `${deptId}_income_1`;
  const t2id = `${deptId}_employees_2`;
  const t3id = `${deptId}_customers_3`;
  return [
    {
      id: t1id,
      departmentId: deptId,
      name: 'Umsatz steigern I',
      description: `Verdoppelt die Einnahmen der ${deptId}-Abteilung.`,
      cost: baseCost,
      effectType: 'income_multiplier',
      effectValue: 2,
      tier: 1,
    },
    {
      id: t2id,
      departmentId: deptId,
      name: 'Mehr Personal II',
      description: `+2 maximale Mitarbeiter in dieser Abteilung.`,
      cost: baseCost * 3,
      effectType: 'max_employees_bonus',
      effectValue: 2,
      tier: 2,
      requiresUpgradeId: t1id,
    },
    {
      id: t3id,
      departmentId: deptId,
      name: 'Kundenstrom III',
      description: `Verdreifacht die Kunden pro Minute in dieser Abteilung.`,
      cost: baseCost * 10,
      effectType: 'customer_multiplier',
      effectValue: 3,
      tier: 3,
      requiresUpgradeId: t2id,
    },
  ];
}

export const UPGRADES: UpgradeDefinition[] = [
  // Per-department tiers (base cost scales with dept earning power)
  ...deptUpgrades('pumps',    1000),
  ...deptUpgrades('bakeshop',  500),
  ...deptUpgrades('tyres',    1500),
  ...deptUpgrades('carwash',   800),
  ...deptUpgrades('workshop', 3000),
  ...deptUpgrades('shop',      400),

  // Global upgrades
  {
    id: 'global_offline_efficiency',
    departmentId: 'global',
    name: 'Nachtbetrieb',
    description: 'Offline-Einnahmen werden 1,5× effizienter gesammelt.',
    cost: 5000,
    effectType: 'offline_efficiency',
    effectValue: 1.5,
    tier: 1,
  },
  {
    id: 'global_offline_cap',
    departmentId: 'global',
    name: 'Großes Lagertank',
    description: 'Offline-Einnahmen-Limit steigt von 4 auf 5 Stunden.',
    cost: 15000,
    effectType: 'offline_efficiency',
    effectValue: 1,
    tier: 2,
    requiresUpgradeId: 'global_offline_efficiency',
  },
  {
    id: 'global_income',
    departmentId: 'global',
    name: 'Grosse Eröffnung',
    description: 'Alle Abteilungen erzielen 10 % mehr Einnahmen.',
    cost: 50000,
    effectType: 'income_multiplier',
    effectValue: 1.1,
    tier: 1,
  },
];
