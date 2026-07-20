# YumYums

A vegetarian meal planner. Track foods and their quantities/macros, search across foods, meals and cuisines, save favourite meals and cuisines, log what you eat by day, and see calories/protein/carbs/fat vs. your daily goals.

Built with React + TypeScript + Vite, Tailwind CSS, Zustand (state, persisted to `localStorage`), React Router, and Recharts. Everything runs entirely in the browser — no backend or account required, and your data stays on this device.

## Features

- **Planner** — a monthly calendar, and now the app's home screen. Each day cell has a "+" to quickly add planned foods/meals (with an inline "add a new food" flow if it isn't in your pantry yet), and shows a colour-coded macro total (calories + P/C/F) at the bottom of the cell. Clicking a day opens the full day view — a calorie ring, protein/carb/fat progress bars against your daily goals, and Breakfast/Lunch/Dinner/Snack sections to add or remove entries. Daily goals are editable via "Goals" in the header.
- **Foods** — a searchable, filterable pantry of foods with category (including Eggs and Sweets & Desserts), diet type (vegan/vegetarian/eggetarian), and macros per 100g/100ml. Any food can also define a typical item size (e.g. "1 egg" ≈ 50g), so quantities can be entered by weight *or* by item everywhere in the app.
- **Meals** — build meals from foods + quantities (mixing by-weight and by-item ingredients freely), tag them with a cuisine, mark favourites, see computed macros per serving, and write/view a step-by-step recipe for each one (via the book icon on each meal card).
- **Cuisines** — organise foods/meals by cuisine and star your favourites, including Indian, Italian, Mexican, Mediterranean, East Asian, American and Vietnamese.
- **Global search** — the header search box finds matches across foods, meals and cuisines.

Comes pre-seeded with 134 foods, 20 meals (with full recipes — Indian dals and curries, Mexican mole/burritos/quesadillas/enchiladas, Vietnamese pho/bún/bánh mì/gỏi cuốn/bánh xèo, plus the original Italian/Mediterranean/American set) and 7 cuisines, with nutrition figures sourced from USDA-based data, so there's something to explore immediately — edit or delete freely.

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
