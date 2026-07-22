# YumYums

A vegetarian meal planner. Track foods and their quantities/macros, search across foods, meals and cuisines, save favourite meals and cuisines, log what you eat by day, and see calories/protein/carbs/fat vs. your daily goals.

Built with React + TypeScript + Vite, Tailwind CSS, Zustand (state, persisted to `localStorage`), React Router, and Recharts. Everything runs entirely in the browser — no backend or account required, and your data stays on this device.

## Features

- **Planner** — a Monday-Sunday week view, and the app's home screen. Each day card has a "+" to quickly add planned foods/meals (defaulting to Breakfast/Lunch/Dinner based on the time of day), with an inline "add a new food" flow if it isn't in your pantry yet, and shows a macro total (calories + P/C/F) at the bottom of the card. The layout adapts to screen size: one column on mobile, weekdays/weekend as two columns on tablets, and Mon-Wed / Thu-Fri / Sat-Sun as three columns on desktop. Clicking a day opens the full day view — a calorie ring, protein/carb/fat progress bars against your daily goals, and Breakfast/Lunch/Dinner/Snack sections to add or remove entries. Daily goals are editable via "Goals" in the header.
- **Foods** — a searchable, filterable pantry of foods with category (including Eggs and Sweets & Desserts), diet type (vegan/vegetarian/eggetarian), and macros per 100g/100ml. Any food can also define a typical item size (e.g. "1 egg" ≈ 50g), so quantities can be entered by weight *or* by item everywhere in the app. Weight-mode quantities default to a realistic serving size per food (e.g. 10g for butter, 200ml for milk, 5g for Vegemite) instead of a flat 100g.
- **Meals** — build meals from foods + quantities (mixing by-weight and by-item ingredients freely), tag them with a cuisine, mark favourites, see computed macros per serving, and write/view a step-by-step recipe for each one (via the book icon on each meal card).
- **Cuisines** — organise foods/meals by cuisine and star your favourites, including Indian, Italian, Mexican, Mediterranean, East Asian, American and Vietnamese.
- **Global search** — the header search box finds matches across foods, meals and cuisines.
- **Appearance** — pick Light, Dark or System via the "Appearance" control (sidebar on desktop, palette icon in the header on mobile), plus an "Increased contrast" accessibility toggle that strengthens borders and secondary text, and 6 selectable color themes (Green, Ocean, Sunset, Berry, Violet, Slate). Your choice is saved and applied instantly, including on next visit.
- **Shopping list** — a deduplicated checklist of every ingredient needed for what's logged today or in the future (meals are expanded into their ingredients, quantities summed across repeats), visible in the sidebar on desktop or via a cart icon in the header on mobile. Check items off as you shop — they dim in place; items from past days drop off automatically as today moves forward.

Comes pre-seeded with 141 foods, 20 meals (with full recipes — Indian dals and curries, Mexican mole/burritos/quesadillas/enchiladas, Vietnamese pho/bún/bánh mì/gỏi cuốn/bánh xèo, plus the original Italian/Mediterranean/American set) and 7 cuisines, with nutrition figures sourced from USDA-based data, so there's something to explore immediately — edit or delete freely.

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
