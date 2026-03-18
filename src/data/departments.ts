import type { DepartmentDefinition, DepartmentId } from '../types';

export const DEPARTMENTS: Record<DepartmentId, DepartmentDefinition> = {
  pumps: {
    id: 'pumps',
    name: 'Zapfsäulen',
    emoji: '⛽',
    color: '#f97316',
    baseCustomersPerMinute: 4,
    maxEmployeesBase: 6,
    products: [
      { id: 'e10',      name: 'Super E10',      description: 'Der günstige Alltagskraftstoff. Läuft in fast jedem Tank.',      emoji: '🟢', basePrice: 1.85,  unlockLevel: 1   },
      { id: 'super95',  name: 'Super Plus',     description: 'Mehr Oktanzahl für mehr Leistung – Fahrer schätzen es.',        emoji: '🟡', basePrice: 2.05,  unlockLevel: 10  },
      { id: 'diesel',   name: 'Diesel',         description: 'Unverzichtbar für LKW, Vans und viele Pkw.',                    emoji: '⚫', basePrice: 1.95,  unlockLevel: 20  },
      { id: 'v_power',  name: 'V-Power Racing', description: 'Premium-Kraftstoff für Leistungsmotoren. Reinigt den Motor.',   emoji: '🔴', basePrice: 2.35,  unlockLevel: 50  },
      { id: 'hydrogen', name: 'Wasserstoff H₂', description: 'Zukunftstechnologie an der Säule. Emissionsfrei tanken.',       emoji: '💧', basePrice: 12.0,  unlockLevel: 120 },
    ],
  },

  bakeshop: {
    id: 'bakeshop',
    name: 'Backshop',
    emoji: '🥐',
    color: '#f59e0b',
    baseCustomersPerMinute: 3,
    maxEmployeesBase: 4,
    products: [
      { id: 'pretzel',    name: 'Brezel',          description: 'Knusprig gebackene Laugenbrezel – der Klassiker an der Tanke.', emoji: '🥨', basePrice: 1.20,  unlockLevel: 1   },
      { id: 'sandwich',   name: 'Belegtes Brötchen', description: 'Frisch belegt mit Käse oder Schinken – schnelles Frühstück.',  emoji: '🥪', basePrice: 2.80, unlockLevel: 8   },
      { id: 'croissant',  name: 'Butter-Croissant',  description: 'Buttrig, flockig, frisch aus dem Ofen – zum Espresso ein Muss.', emoji: '🥐', basePrice: 2.20, unlockLevel: 18  },
      { id: 'hotdog',     name: 'Hot Dog',            description: 'Würstchen im Brötchen mit Senf und Ketchup – Klassiker.',       emoji: '🌭', basePrice: 3.90, unlockLevel: 40  },
      { id: 'pizza_slice', name: 'Pizza-Slice',       description: 'Große Scheibe Pizza, frisch aufgebacken – Highlight des Shops.', emoji: '🍕', basePrice: 5.50, unlockLevel: 90  },
    ],
  },

  tyres: {
    id: 'tyres',
    name: 'Reifenservice',
    emoji: '🔧',
    color: '#64748b',
    baseCustomersPerMinute: 1,
    maxEmployeesBase: 3,
    products: [
      { id: 'pressure',   name: 'Reifendruckcheck', description: 'Schneller Check und Auffüllen – sicher auf der Straße.',    emoji: '🔵', basePrice: 2.0,   unlockLevel: 1   },
      { id: 'nitrogen',   name: 'Stickstoff-Füllung', description: 'Stickstoff hält den Druck länger konstant – beliebt bei Vielfahrern.', emoji: '💨', basePrice: 8.0, unlockLevel: 12  },
      { id: 'tyre_swap',  name: 'Reifenwechsel',    description: 'Sommer auf Winter (oder umgekehrt) – schnell und günstig.', emoji: '🔄', basePrice: 35.0,  unlockLevel: 28  },
      { id: 'balancing',  name: 'Auswuchten',       description: 'Präzises Auswuchten aller vier Räder – kein Vibrieren mehr.', emoji: '⚖️', basePrice: 60.0, unlockLevel: 55  },
      { id: 'run_flat',   name: 'Run-Flat-Montage', description: 'Hochwertige Run-Flat-Reifen: fahr auch ohne Luft weiter.',  emoji: '🏎️', basePrice: 180.0, unlockLevel: 130 },
    ],
  },

  carwash: {
    id: 'carwash',
    name: 'Autowäsche',
    emoji: '🚿',
    color: '#3b82f6',
    baseCustomersPerMinute: 2,
    maxEmployeesBase: 4,
    products: [
      { id: 'basic_wash',   name: 'Schnellwäsche',   description: 'Außenwäsche in 3 Minuten – sauber für den Alltag.',       emoji: '💦', basePrice: 6.0,   unlockLevel: 1   },
      { id: 'comfort_wash', name: 'Komfort-Wäsche',  description: 'Mit Unterbodenspülung und Heißlufttrocknung.',             emoji: '🫧', basePrice: 12.0,  unlockLevel: 10  },
      { id: 'premium_wash', name: 'Premium-Wäsche',  description: 'Schaumwäsche + Felgenreiniger + Innenreinigung.',          emoji: '✨', basePrice: 20.0,  unlockLevel: 25  },
      { id: 'full_wash',    name: 'Vollwäsche',      description: 'Von innen und außen strahlend sauber – Rundum-Service.',   emoji: '🌟', basePrice: 38.0,  unlockLevel: 60  },
      { id: 'detailing',    name: 'Profi-Detailing', description: 'Hochglanzpolitur + Keramikversiegelung – wie neu!',        emoji: '💎', basePrice: 150.0, unlockLevel: 140 },
    ],
  },

  workshop: {
    id: 'workshop',
    name: 'Werkstatt',
    emoji: '🔩',
    color: '#8b5cf6',
    baseCustomersPerMinute: 0.7,
    maxEmployeesBase: 3,
    products: [
      { id: 'oil_change',   name: 'Ölwechsel',        description: 'Motoröl und Filter wechseln – Grundlage jeder Wartung.',  emoji: '🛢️', basePrice: 45.0,  unlockLevel: 1   },
      { id: 'brake_check',  name: 'Bremscheck',       description: 'Bremsen prüfen und justieren – für maximale Sicherheit.', emoji: '🔴', basePrice: 80.0,  unlockLevel: 15  },
      { id: 'tuev_prep',    name: 'TÜV-Vorbereitung', description: 'Alles gecheckt, damit der TÜV problemlos klappt.',        emoji: '📋', basePrice: 120.0, unlockLevel: 35  },
      { id: 'engine_tune',  name: 'Motor-Tuning',     description: 'Leistungssteigerung durch professionelles Chiptuning.',   emoji: '⚡', basePrice: 350.0, unlockLevel: 75  },
      { id: 'full_service', name: 'Vollservice',      description: 'Komplettinspektion nach Herstellervorgaben – Premium.',   emoji: '🏆', basePrice: 900.0, unlockLevel: 160 },
    ],
  },

  shop: {
    id: 'shop',
    name: 'Tankstellenshop',
    emoji: '🛒',
    color: '#10b981',
    baseCustomersPerMinute: 5,
    maxEmployeesBase: 5,
    products: [
      { id: 'snacks',     name: 'Snacks & Chips',  description: 'Chips, Gummibärchen, Schokolade – für den kleinen Hunger.',   emoji: '🍫', basePrice: 1.50,  unlockLevel: 1   },
      { id: 'drinks',     name: 'Kaltgetränke',    description: 'Wasser, Cola, Energydrinks – immer kalt im Kühlregal.',       emoji: '🥤', basePrice: 2.50,  unlockLevel: 6   },
      { id: 'coffee',     name: 'Kaffee to go',    description: 'Frisch gebrühter Kaffee aus der Profi-Maschine – unverzichtbar.', emoji: '☕', basePrice: 3.20, unlockLevel: 15  },
      { id: 'motor_oil',  name: 'Motoröl & Pflege', description: 'Markenöle und Pflegemittel im Regal – Mitnahme-Geschäft pur.', emoji: '🛢️', basePrice: 14.0, unlockLevel: 35  },
      { id: 'gift_card',  name: 'Geschenkkarten',  description: 'Tankkarten und Geschenkgutscheine – hohe Marge, wenig Arbeit.', emoji: '🎁', basePrice: 50.0, unlockLevel: 80  },
    ],
  },
};

export const DEPARTMENT_IDS: DepartmentId[] = [
  'pumps', 'bakeshop', 'tyres', 'carwash', 'workshop', 'shop'
];
