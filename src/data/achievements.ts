export interface AchievementDefinition {
  id: string;
  name: string;
  description: string;
  emoji: string;
}

export const ACHIEVEMENTS: AchievementDefinition[] = [
  { id: 'first_hire',     name: 'Willkommen, Chef!',      description: 'Ersten Mitarbeiter eingestellt.',           emoji: '👤' },
  { id: 'first_upgrade',  name: 'Auf dem Weg nach oben!', description: 'Erste Abteilung verbessert.',               emoji: '⬆️' },
  { id: 'earned_1k',      name: 'Erster Tausender!',      description: '1.000 € insgesamt verdient.',               emoji: '💰' },
  { id: 'earned_100k',    name: 'Großes Geld!',           description: '100.000 € insgesamt verdient.',             emoji: '🤑' },
  { id: 'all_depts_lv5',  name: 'Voller Betrieb!',        description: 'Alle Abteilungen auf Level 5.',             emoji: '🏭' },
  { id: 'research_5',     name: 'Wissenschaftler!',       description: '5 Forschungs-Upgrades gekauft.',            emoji: '🔬' },
  { id: 'max_employees',  name: 'Alles im Griff!',        description: 'Eine Abteilung vollständig besetzt.',       emoji: '👥' },
  { id: 'first_prestige', name: 'Neuanfang!',             description: 'Ersten Prestige durchgeführt.',             emoji: '✨' },
];
