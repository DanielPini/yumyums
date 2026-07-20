# YumYums

A vegetarian meal planner. Track foods and their quantities/macros, search across foods, meals and cuisines, save favourite meals and cuisines, log what you eat by day, and see calories/protein/carbs/fat vs. your daily goals.

Built with React + TypeScript + Vite, Tailwind CSS, Zustand (state, persisted to `localStorage`), React Router, and Recharts. Everything runs entirely in the browser — no backend or account required, and your data stays on this device.

## Features

- **Foods** — a searchable, filterable pantry of foods with category (including Eggs and Sweets & Desserts), diet type (vegan/vegetarian/eggetarian), and macros per 100g/100ml. Any food can also define a typical item size (e.g. "1 egg" ≈ 50g), so quantities can be entered by weight *or* by item everywhere in the app.
- **Meals** — build meals from foods + quantities (mixing by-weight and by-item ingredients freely), tag them with a cuisine, mark favourites, see computed macros per serving.
- **Cuisines** — organise foods/meals by cuisine and star your favourites.
- **Today (log)** — log foods or meals against Breakfast/Lunch/Dinner/Snack for any day, with a calorie ring and protein/carb/fat progress bars against your daily goals (editable via "Goals").
- **Planner** — a monthly calendar for forward meal planning. Each day has a "+" to quickly add planned foods/meals, and shows a running macro total at the bottom of the cell; clicking a day opens the full day view (same as Today) to review or edit what's planned.
- **Global search** — the header search box finds matches across foods, meals and cuisines.

Comes pre-seeded with ~95 foods, 8 meals and 6 cuisines across Indian, Italian, Mexican, Mediterranean, East Asian and American cooking, with nutrition figures sourced from USDA-based data, so there's something to explore immediately — edit or delete freely.

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
