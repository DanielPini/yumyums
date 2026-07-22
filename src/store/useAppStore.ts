import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuid } from 'uuid';
import type { Cuisine, Food, LogEntry, MacroTargets, Meal } from '../types';
import { seedCuisines, seedFoods, seedMeals } from '../data/seedData';

/** Adds any seed items not already present (by id) in the persisted list, so growing the seed data in code reaches existing users without wiping their own edits/additions. */
function mergeSeedById<T extends { id: string }>(persisted: T[] | undefined, seed: T[]): T[] {
  const existing = Array.isArray(persisted) ? persisted : [];
  const existingIds = new Set(existing.map((item) => item.id));
  return [...existing, ...seed.filter((item) => !existingIds.has(item.id))];
}

/** Drops any persisted food from an earlier, incompatible schema (pre by-weight/by-piece refactor) instead of letting it crash the UI. */
function dropLegacyFoods(foods: Food[]): Food[] {
  return foods.filter((f) => f && typeof f === 'object' && 'baseUnit' in f && 'macrosPer100' in f);
}

/** Drops any persisted meal referencing the pre-refactor ingredient shape (quantity instead of amount). */
function dropLegacyMeals(meals: Meal[]): Meal[] {
  return meals.filter((m) => Array.isArray(m.ingredients) && m.ingredients.every((i) => i && typeof i === 'object' && 'amount' in i));
}

/** Drops any persisted log entry referencing the pre-refactor food-amount shape (quantity instead of amount). */
function dropLegacyLogEntries(log: LogEntry[]): LogEntry[] {
  return log.filter((l) => l.source.type === 'meal' || (l.source.type === 'food' && 'amount' in l.source));
}

/**
 * Re-syncs display-only fields (pieceLabel, defaultMode) from the current seed data onto
 * already-persisted foods that match by id. Unlike the rest of a food's data, these are app
 * vocabulary/formatting choices rather than user edits, so — unlike macros or names — they
 * should always reflect the latest seed data even for users who persisted an older copy.
 */
function syncSeedDisplayFields(foods: Food[], seed: Food[]): Food[] {
  const seedById = new Map(seed.map((f) => [f.id, f]));
  return foods.map((f) => {
    const seedFood = seedById.get(f.id);
    if (!seedFood) return f;
    return { ...f, pieceLabel: seedFood.pieceLabel, defaultMode: seedFood.defaultMode };
  });
}

/** Food ids retired from the seed catalog, mapped to their replacement — keeps old log entries/meals referencing them intact instead of silently losing their macros. */
const REMOVED_FOOD_REDIRECTS: Record<string, string> = {
  'food-egg-boiled': 'food-egg',
  'food-egg-fried': 'food-egg',
  'food-egg-scrambled': 'food-egg',
};

function redirectFoodId(id: string): string {
  return REMOVED_FOOD_REDIRECTS[id] ?? id;
}

/** Drops foods retired from the seed catalog and redirects any meal ingredients or log entries that referenced them. */
function migrateRemovedFoods(foods: Food[], meals: Meal[], log: LogEntry[]): { foods: Food[]; meals: Meal[]; log: LogEntry[] } {
  return {
    foods: foods.filter((f) => !(f.id in REMOVED_FOOD_REDIRECTS)),
    meals: meals.map((m) => ({ ...m, ingredients: m.ingredients.map((i) => ({ ...i, foodId: redirectFoodId(i.foodId) })) })),
    log: log.map((entry) =>
      entry.source.type === 'food' ? { ...entry, source: { ...entry.source, foodId: redirectFoodId(entry.source.foodId) } } : entry
    ),
  };
}

interface AppState {
  foods: Food[];
  meals: Meal[];
  cuisines: Cuisine[];
  log: LogEntry[];
  macroTargets: MacroTargets;
  /** Default number of people meals are cooked for — used to scale the shopping list, independent of personal serving/macro tracking. */
  householdSize: number;

  addFood: (food: Omit<Food, 'id' | 'createdAt'>) => string;
  updateFood: (id: string, food: Omit<Food, 'id' | 'createdAt'>) => void;
  deleteFood: (id: string) => void;

  addMeal: (meal: Omit<Meal, 'id' | 'createdAt'>) => void;
  updateMeal: (id: string, meal: Omit<Meal, 'id' | 'createdAt'>) => void;
  deleteMeal: (id: string) => void;
  toggleMealFavourite: (id: string) => void;

  addCuisine: (name: string) => string;
  deleteCuisine: (id: string) => void;
  toggleCuisineFavourite: (id: string) => void;

  addLogEntry: (entry: Omit<LogEntry, 'id' | 'createdAt'>) => void;
  updateLogEntry: (id: string, entry: Omit<LogEntry, 'id' | 'createdAt'>) => void;
  removeLogEntry: (id: string) => void;

  setMacroTargets: (targets: MacroTargets) => void;
  setHouseholdSize: (size: number) => void;
  adjustHouseholdSize: (delta: number) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      foods: seedFoods,
      meals: seedMeals,
      cuisines: seedCuisines,
      log: [],
      macroTargets: { calories: 2000, protein: 100, carbs: 250, fat: 65 },
      householdSize: 1,

      addFood: (food) => {
        const id = uuid();
        set((state) => ({
          foods: [...state.foods, { ...food, id, createdAt: Date.now() }],
        }));
        return id;
      },
      updateFood: (id, food) =>
        set((state) => ({
          foods: state.foods.map((f) => (f.id === id ? { ...f, ...food } : f)),
        })),
      deleteFood: (id) =>
        set((state) => ({
          foods: state.foods.filter((f) => f.id !== id),
          meals: state.meals.map((m) => ({
            ...m,
            ingredients: m.ingredients.filter((i) => i.foodId !== id),
          })),
          log: state.log.filter((l) => !(l.source.type === 'food' && l.source.foodId === id)),
        })),

      addMeal: (meal) =>
        set((state) => ({
          meals: [...state.meals, { ...meal, id: uuid(), createdAt: Date.now() }],
        })),
      updateMeal: (id, meal) =>
        set((state) => ({
          meals: state.meals.map((m) => (m.id === id ? { ...m, ...meal } : m)),
        })),
      deleteMeal: (id) =>
        set((state) => ({
          meals: state.meals.filter((m) => m.id !== id),
          log: state.log.filter((l) => !(l.source.type === 'meal' && l.source.mealId === id)),
        })),
      toggleMealFavourite: (id) =>
        set((state) => ({
          meals: state.meals.map((m) => (m.id === id ? { ...m, favourite: !m.favourite } : m)),
        })),

      addCuisine: (name) => {
        const id = uuid();
        set((state) => ({
          cuisines: [...state.cuisines, { id, name, favourite: false }],
        }));
        return id;
      },
      deleteCuisine: (id) =>
        set((state) => ({
          cuisines: state.cuisines.filter((c) => c.id !== id),
          meals: state.meals.map((m) => (m.cuisineId === id ? { ...m, cuisineId: null } : m)),
          foods: state.foods.map((f) => ({
            ...f,
            cuisineIds: f.cuisineIds.filter((cid) => cid !== id),
          })),
        })),
      toggleCuisineFavourite: (id) =>
        set((state) => ({
          cuisines: state.cuisines.map((c) => (c.id === id ? { ...c, favourite: !c.favourite } : c)),
        })),

      addLogEntry: (entry) =>
        set((state) => ({
          log: [...state.log, { ...entry, id: uuid(), createdAt: Date.now() }],
        })),
      updateLogEntry: (id, entry) =>
        set((state) => ({
          log: state.log.map((l) => (l.id === id ? { ...l, ...entry } : l)),
        })),
      removeLogEntry: (id) =>
        set((state) => ({ log: state.log.filter((l) => l.id !== id) })),

      setMacroTargets: (targets) => set({ macroTargets: targets }),
      setHouseholdSize: (size) => set({ householdSize: Math.max(1, size) }),
      adjustHouseholdSize: (delta) => set((state) => ({ householdSize: Math.max(1, state.householdSize + delta) })),
    }),
    {
      name: 'yumyums-store',
      merge: (persistedState, currentState) => {
        const persisted = (persistedState ?? {}) as Partial<AppState>;
        const safeFoods = dropLegacyFoods(persisted.foods ?? []);
        const safeMeals = dropLegacyMeals(persisted.meals ?? []);
        const safeLog = dropLegacyLogEntries(persisted.log ?? []);
        const mergedFoods = syncSeedDisplayFields(mergeSeedById(safeFoods, seedFoods), seedFoods);
        const mergedMeals = mergeSeedById(safeMeals, seedMeals);
        const migrated = migrateRemovedFoods(mergedFoods, mergedMeals, safeLog);
        return {
          ...currentState,
          ...persisted,
          foods: migrated.foods,
          meals: migrated.meals,
          cuisines: mergeSeedById(persisted.cuisines, seedCuisines),
          log: migrated.log,
        };
      },
    }
  )
);
