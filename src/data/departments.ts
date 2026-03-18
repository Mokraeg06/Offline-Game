import type { DepartmentDefinition, DepartmentId } from '../types';

export const DEPARTMENTS: Record<DepartmentId, DepartmentDefinition> = {
  bakery: {
    id: 'bakery',
    name: 'Bäckerei',
    emoji: '🥐',
    color: '#f59e0b',
    baseCustomersPerMinute: 2,
    maxEmployeesBase: 5,
    products: [
      { id: 'bread',       name: 'Weißbrot',      description: 'Frisch gebackenes Weißbrot – jeden Tag ein Muss.',        emoji: '🍞', basePrice: 0.5,  unlockLevel: 1  },
      { id: 'croissant',   name: 'Croissant',     description: 'Butterreiches Blätterteiggebäck aus Frankreich.',         emoji: '🥐', basePrice: 1.2,  unlockLevel: 10 },
      { id: 'cake',        name: 'Torte',         description: 'Mehrstöckige Sahnetorte – der Renner an Geburtstagen.',   emoji: '🎂', basePrice: 3.5,  unlockLevel: 25 },
      { id: 'pastry',      name: 'Feingebäck-Box',      description: 'Handgemachte Gebäck-Spezialitäten in der edlen Box.', emoji: '🧁', basePrice: 8.0,  unlockLevel: 50 },
      { id: 'wedding_cake', name: 'Hochzeitstorte',    description: 'Fünfstöckige Meisterwerk-Torte. Der Preis ist es wert.', emoji: '🎀', basePrice: 25.0, unlockLevel: 100},
    ],
  },

  fruit: {
    id: 'fruit',
    name: 'Obst & Gemüse',
    emoji: '🍎',
    color: '#10b981',
    baseCustomersPerMinute: 3,
    maxEmployeesBase: 5,
    products: [
      { id: 'apple',      name: 'Äpfel',         description: 'Knackige heimische Äpfel aus regionalem Anbau.',           emoji: '🍎', basePrice: 0.3,  unlockLevel: 1  },
      { id: 'banana',     name: 'Bananenstaude', description: 'Süße Bananen – beliebt bei Groß und Klein.',               emoji: '🍌', basePrice: 0.8,  unlockLevel: 8  },
      { id: 'berries',    name: 'Beeren-Mix',    description: 'Frische Erdbeeren, Heidelbeeren und Himbeeren.',            emoji: '🍓', basePrice: 2.5,  unlockLevel: 20 },
      { id: 'tropical',   name: 'Tropical-Box',  description: 'Exotische Früchte aus aller Welt, frisch importiert.',     emoji: '🥭', basePrice: 7.0,  unlockLevel: 40 },
      { id: 'exotic',     name: 'Luxus-Obst-Box',  description: 'Handverlesene Raritäten: Drachenfrucht, Rambutan & Co.', emoji: '🍍', basePrice: 20.0, unlockLevel: 80 },
    ],
  },

  meat: {
    id: 'meat',
    name: 'Fleisch',
    emoji: '🥩',
    color: '#ef4444',
    baseCustomersPerMinute: 1.5,
    maxEmployeesBase: 4,
    products: [
      { id: 'sausages',   name: 'Bratwurst',     description: 'Saftige Bratwurst vom heimischen Metzger.',                emoji: '🌭', basePrice: 2.0,  unlockLevel: 1  },
      { id: 'chicken',    name: 'Hähnchen',      description: 'Frisches Hähnchenfleisch aus artgerechter Haltung.',       emoji: '🍗', basePrice: 4.5,  unlockLevel: 12 },
      { id: 'beef',       name: 'Rindersteak',   description: 'Premium-Rindersteak aus Weidehaltung, perfekt zum Grillen.',emoji: '🥩', basePrice: 12.0, unlockLevel: 30 },
      { id: 'premium',    name: 'Premium-Cut',   description: 'Ausgewählte Edelstücke vom Angus-Rind.',                   emoji: '🍖', basePrice: 30.0, unlockLevel: 60 },
      { id: 'wagyu',      name: 'Wagyu-Fleisch', description: 'Köstliches Rindfleisch. Schon der Name lässt den Preis in die Höhe schnellen.', emoji: '🥩', basePrice: 90.0, unlockLevel: 120},
    ],
  },

  seafood: {
    id: 'seafood',
    name: 'Meeresfrüchte',
    emoji: '🦞',
    color: '#3b82f6',
    baseCustomersPerMinute: 1.2,
    maxEmployeesBase: 4,
    products: [
      { id: 'sardines',   name: 'Sardinen',      description: 'Kleine, aber feine Fische direkt vom Atlantik.',           emoji: '🐟', basePrice: 1.5,  unlockLevel: 1  },
      { id: 'salmon',     name: 'Lachs',         description: 'Norwegischer Wildlachs – reich an Omega-3.',               emoji: '🐠', basePrice: 5.0,  unlockLevel: 15 },
      { id: 'lobster',    name: 'Hummer',        description: 'Lebendiger Hummer aus dem Atlantik, direkt zum Kochen.',   emoji: '🦞', basePrice: 15.0, unlockLevel: 35 },
      { id: 'crab',       name: 'Königskrabbe',  description: 'Riesige Königskrabbe – ein Festessen für die Familie.',    emoji: '🦀', basePrice: 45.0, unlockLevel: 70 },
      { id: 'tuna',       name: 'Thunfisch-Sashimi', description: 'Premium-Thunfisch in Sashimi-Qualität, direkt aus Japan.', emoji: '🍣', basePrice: 120.0, unlockLevel: 140},
    ],
  },

  electronics: {
    id: 'electronics',
    name: 'Elektronik',
    emoji: '💻',
    color: '#8b5cf6',
    baseCustomersPerMinute: 0.8,
    maxEmployeesBase: 3,
    products: [
      { id: 'batteries',  name: 'Batterien-Set', description: 'AA- und AAA-Batterien im praktischen Vorteilspack.',       emoji: '🔋', basePrice: 3.0,  unlockLevel: 1  },
      { id: 'headphones', name: 'Kopfhörer',     description: 'Kabellose Kopfhörer mit aktiver Geräuschunterdrückung.',   emoji: '🎧', basePrice: 20.0, unlockLevel: 20 },
      { id: 'tablet',     name: 'Tablet',        description: 'Modernes Tablet mit großem Display für Arbeit und Freizeit.',emoji: '📱', basePrice: 150.0,unlockLevel: 50 },
      { id: 'laptop',     name: 'Laptop',        description: 'Leistungsstarker Laptop für Office und Gaming.',            emoji: '💻', basePrice: 500.0,unlockLevel: 100},
      { id: 'tv',         name: 'Smart-TV 85"',  description: 'Riesiger OLED-Fernseher mit 8K-Auflösung und Smart-OS.',   emoji: '📺', basePrice: 1200.0,unlockLevel:200},
    ],
  },

  drinks: {
    id: 'drinks',
    name: 'Getränke',
    emoji: '🥤',
    color: '#06b6d4',
    baseCustomersPerMinute: 4,
    maxEmployeesBase: 6,
    products: [
      { id: 'water',      name: 'Mineralwasser', description: 'Frisches Quellwasser aus den Alpen, still oder sprudelnd.', emoji: '💧', basePrice: 0.2,  unlockLevel: 1  },
      { id: 'juice',      name: 'Fruchtsaft',    description: '100 % Direktsaft, ohne Zusätze – wie frisch gepresst.',     emoji: '🍊', basePrice: 0.6,  unlockLevel: 5  },
      { id: 'soda',       name: 'Softdrink-Pack',  description: '12er-Pack Softdrinks – für Partys und gemütliche Abende.', emoji: '🥤', basePrice: 1.8,  unlockLevel: 15 },
      { id: 'energy',     name: 'Energy Drink',  description: 'Power-Drink mit Taurin & Koffein – gibt Extra-Energie.',    emoji: '⚡', basePrice: 4.0,  unlockLevel: 30 },
      { id: 'wine',       name: 'Premium-Wein',  description: 'Edles Cru-Classé aus Bordeaux, für besondere Anlässe.',    emoji: '🍷', basePrice: 15.0, unlockLevel: 60 },
    ],
  },
};

export const DEPARTMENT_IDS: DepartmentId[] = [
  'bakery', 'fruit', 'meat', 'seafood', 'electronics', 'drinks'
];
