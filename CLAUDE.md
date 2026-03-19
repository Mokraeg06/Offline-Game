# CLAUDE.md — Offline Idle Game (Tankstellen-Tycoon)

## Project Overview

A browser-based idle/incremental game themed around running a German gas station (Tankstelle). Players hire employees, upgrade departments, and earn money while the game ticks — including offline earnings calculated on load. Built with React 19, TypeScript, and Vite; deployed to GitHub Pages.

---

## Tech Stack

| Layer | Tool |
|---|---|
| Framework | React 19 + TypeScript |
| Build | Vite 8 (ESM, `base: '/Offline-Game/'`) |
| State | `useReducer` + React Context (no external state lib) |
| Persistence | `localStorage` (key: `supermarket_idle_v1`) |
| Styling | Plain CSS with CSS custom properties (no CSS-in-JS, no Tailwind) |
| Linting | ESLint 9 with `typescript-eslint` + `react-hooks` plugin |
| Tests | **None** — no test framework is configured |
| Deploy | GitHub Actions → GitHub Pages (triggers on push to `main`) |

---

## Repository Structure

```
src/
├── types/index.ts          # All TypeScript interfaces and union types
├── data/
│   ├── departments.ts      # Static department definitions (DEPARTMENTS map + DEPARTMENT_IDS array)
│   └── upgrades.ts         # Static upgrade definitions (UPGRADES array)
├── store/
│   ├── gameState.ts        # createInitialState(), SAVE_KEY, SCHEMA_VERSION constants
│   ├── gameReducer.ts      # Pure gameReducer(state, action) → state
│   └── persistence.ts      # saveGame(), loadGame(), clearSave() (localStorage)
├── utils/
│   ├── earnings.ts         # computeDepartmentEarnings(), computeTotalIncomePerMinute(), computeOfflineEarnings()
│   ├── levelMath.ts        # upgradeCost(), hireCost(), levelScaling() formulas
│   └── formatting.ts       # formatMoney(), formatNumber(), formatDuration()
├── context/
│   └── GameContext.tsx     # GameProvider, useGame(), useDepartmentEarnings() hooks
├── components/
│   ├── Header/             # Money display + income/min ticker
│   ├── DepartmentGrid/     # Grid of DepartmentCards
│   ├── DepartmentModal/    # Hire/upgrade actions per department
│   ├── ResearchScreen/     # Upgrade purchase UI (Research tab)
│   ├── SettingsModal/      # Reset game + settings (Settings tab)
│   ├── OfflineEarningsModal/ # Shown on load if offline earnings > $1
│   └── shared/             # ProgressBar, Modal (reusable primitives)
├── styles/variables.css    # All CSS custom properties (colors, spacing, typography, layout)
├── App.tsx                 # Root: GameProvider → GameUI (3-tab layout + modals)
└── main.tsx                # React DOM entry point
```

---

## Game Architecture

### State Management

Game state is managed with a single `useReducer` at the `GameProvider` level. UI state (active modal, active tab) lives in a separate `useState`.

```
GameProvider (GameContext.tsx)
├── [state, dispatch]  = useReducer(gameReducer, createInitialState)
├── [uiState, setUIState] = useState(INITIAL_UI)
├── stateRef           — ref kept in sync with state to avoid stale closures in intervals
├── Game loop          — setInterval every tickRateMs (default 1000ms) → dispatches TICK
└── Auto-save          — setInterval every autoSaveIntervalMs (default 30 000ms) → saveGame()
```

### GameState Shape (`src/types/index.ts`)

```ts
GameState {
  version: number           // schema version (currently 1)
  money: number
  totalEarned: number
  lastSaved: number         // Unix timestamp ms
  lastTick: number          // Unix timestamp ms
  departments: Record<DepartmentId, DepartmentState>
  globalUpgrades: DepartmentUpgradeState[]
  offlineEarningsCap: number  // hours (default 3)
  prestigeCount: number
  settings: { tickRateMs, autoSaveIntervalMs }
}
```

### Actions (`GameAction` union)

| Action type | Effect |
|---|---|
| `TICK` | Adds `incomePerMin * deltaMinutes` to `money` and `totalEarned` |
| `HIRE_EMPLOYEE` | Deducts `hireCost`, increments `employees` if affordable and below cap |
| `UPGRADE_DEPARTMENT` | Deducts `upgradeCost`, increments `level` |
| `PURCHASE_UPGRADE` | Validates prerequisites + cost, marks upgrade as purchased |
| `APPLY_OFFLINE_EARNINGS` | Adds offline-computed amount to money; resets timestamps |
| `LOAD_STATE` | Replaces entire state (used on save load) |
| `RESET_GAME` | Returns `createInitialState()` |

---

## Departments

Six departments, identified by `DepartmentId`:

| ID | Name (DE) | Emoji | Base CPM | Max Emp Base |
|---|---|---|---|---|
| `pumps` | Zapfsäulen | ⛽ | 4 | 6 |
| `bakeshop` | Backshop | 🥐 | 3 | 4 |
| `tyres` | Reifenservice | 🔧 | 1 | 3 |
| `carwash` | Autowäsche | 🚿 | 2 | 4 |
| `workshop` | Werkstatt | 🔩 | 0.7 | 3 |
| `shop` | Tankstellenshop | 🛒 | 5 | 5 |

Each department has 5 products that unlock at increasing levels. The **current product** is the highest one whose `unlockLevel ≤ dept.level`.

### Earnings Formula

```
baseCPM          = def.baseCustomersPerMinute * log2(level + 1)
effectiveCPM     = employees * baseCPM * customerMultiplier
totalProductValue = currentProduct.basePrice * levelScaling(level) * incomeMultiplier
moneyPerMinute   = totalProductValue * effectiveCPM
```

Where `levelScaling(level) = 1 + (level - 1) * 0.15` (linear +15% per level).

### Cost Formulas (`src/utils/levelMath.ts`)

```ts
upgradeCost(level)    = floor(100 * 1.18^(level-1))   // exponential
hireCost(employees)   = floor(50  * 1.12^employees)    // exponential
```

---

## Upgrade System

Upgrades live in `src/data/upgrades.ts` and follow a 3-tier pattern per department:

| Tier | Effect | Cost |
|---|---|---|
| 1 | `income_multiplier ×2` | `baseCost` |
| 2 | `max_employees_bonus +2` | `baseCost × 3` |
| 3 | `customer_multiplier ×3` | `baseCost × 10` |

Each tier requires the previous to be purchased (`requiresUpgradeId`).

Three **global upgrades** also exist:
- `global_offline_efficiency` — offline earnings efficiency 50% → 75%
- `global_offline_cap` — offline cap 3h → 4h (requires `global_offline_efficiency`)
- `global_income` — all departments +10% income

---

## Persistence & Offline Earnings

- Save key: `supermarket_idle_v1` in `localStorage`
- Schema version check: on mismatch, save is discarded (returns `null`)
- On load, offline earnings are calculated as:
  ```
  elapsed    = now - lastSaved  (capped at offlineEarningsCap hours)
  efficiency = 0.5  (0.75 with global_offline_efficiency upgrade)
  amount     = incomePerMin * (elapsed / 60000) * efficiency
  ```
- If `amount > 1`, the `OfflineEarningsModal` is shown automatically

---

## Styling Conventions

- All colours, spacing, radii, and font sizes live in `src/styles/variables.css` as CSS custom properties — **do not hardcode values**.
- Each component has a co-located `.css` file (`ComponentName.css` in the same folder).
- Dark-only theme: background `#0f172a` / `#1e293b`.
- Layout constants: `--header-height: 64px`, `--nav-height: 60px` (used for `padding-bottom` in scrollable views).
- Department accent colours are set inline via the `color` field on `DepartmentDefinition` (not from CSS variables).

---

## Development Commands

```bash
npm run dev       # Start Vite dev server (hot reload)
npm run build     # TypeScript compile + Vite production build → dist/
npm run lint      # ESLint check
npm run preview   # Serve the dist/ folder locally
```

No test runner is configured. There are no unit or integration tests.

---

## Deployment

- **Auto-deploy**: pushing to `main` triggers `.github/workflows/deploy.yml`
- Pipeline: `npm ci` → `npm run build` → upload `dist/` → deploy to GitHub Pages
- Vite `base` is set to `/Offline-Game/` — all asset paths are relative to this prefix.
- Do **not** change `base` in `vite.config.ts` without updating the GitHub Pages configuration.

---

## Key Conventions for AI Assistants

1. **TypeScript types first** — all new data shapes belong in `src/types/index.ts`. Never use `any`.
2. **Static data is immutable** — `DEPARTMENTS` and `UPGRADES` are constant definitions. Do not mutate them at runtime.
3. **Pure reducer** — `gameReducer` must remain a pure function with no side effects. Side effects (timers, localStorage) belong in `GameContext.tsx`.
4. **No external state libraries** — the project intentionally uses only React's built-in `useReducer`/`useState`. Do not add Redux, Zustand, etc.
5. **No test framework** — do not add tests unless the user explicitly requests them and chooses a framework.
6. **German UI strings** — all in-game text (department names, product names, button labels, descriptions) is in German. Keep new content in German.
7. **CSS variables only** — use values from `src/styles/variables.css`; do not introduce new hardcoded colour or spacing values.
8. **Co-locate CSS** — each component's styles live alongside it in `ComponentName.css`.
9. **`SAVE_KEY` compatibility** — the localStorage key (`supermarket_idle_v1`) and `SCHEMA_VERSION` must stay in sync. Increment `SCHEMA_VERSION` and handle migration in `loadGame()` whenever `GameState` shape changes.
10. **`stateRef` pattern** — when reading state inside a `setInterval`, always use `stateRef.current` to avoid stale closures.
11. **`useDepartmentEarnings(id)`** — prefer this hook over calling `computeDepartmentEarnings` directly inside components.
12. **No router** — navigation between tabs is handled entirely through `uiState.activeTab`; do not add `react-router`.
