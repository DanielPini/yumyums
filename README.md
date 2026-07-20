# YumYums

A vegetarian meal planner. Track foods and their quantities/macros, search across foods, meals and cuisines, save favourite meals and cuisines, log what you eat by day, and see calories/protein/carbs/fat vs. your daily goals.

Built with React + TypeScript + Vite, Tailwind CSS, Zustand (state, persisted to `localStorage`), React Router, and Recharts. Everything runs entirely in the browser — no backend or account required, and your data stays on this device.

## Features

- **Foods** — a searchable, filterable pantry of foods with category, diet type (vegan/vegetarian/eggetarian), unit, and macros per 100g/100ml/piece.
- **Meals** — build meals from foods + quantities, tag them with a cuisine, mark favourites, see computed macros per serving.
- **Cuisines** — organise foods/meals by cuisine and star your favourites.
- **Today (log)** — log foods or meals against Breakfast/Lunch/Dinner/Snack for any day, with a calorie ring and protein/carb/fat progress bars against your daily goals (editable via "Goals").
- **Global search** — the header search box finds matches across foods, meals and cuisines.

Comes pre-seeded with ~29 foods, 7 meals and 6 cuisines across Indian, Italian, Mexican, Mediterranean, East Asian and American cooking so there's something to explore immediately — edit or delete freely.

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL. Data is saved automatically to your browser's `localStorage` (key `yumyums-store`), so it persists across restarts but is local to that browser.

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — type-check and build for production (output in `dist/`)
- `npm run preview` — preview the production build locally
- `npm run lint` — run oxlint
