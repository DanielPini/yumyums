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

interface AppState {
  foods: Food[];
  meals: Meal[];
  cuisines: Cuisine[];
  log: LogEntry[];
  macroTargets: MacroTargets;

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
  removeLogEntry: (id: string) => void;

  setMacroTargets: (targets: MacroTargets) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      foods: seedFoods,
      meals: seedMeals,
      cuisines: seedCuisines,
      log: [],
      macroTargets: { calories: 2000, protein: 100, carbs: 250, fat: 65 },

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
      removeLogEntry: (id) =>
        set((state) => ({ log: state.log.filter((l) => l.id !== id) })),

      setMacroTargets: (targets) => set({ macroTargets: targets }),
    }),
    {
      name: 'yumyums-store',
      merge: (persistedState, currentState) => {
        const persisted = (persistedState ?? {}) as Partial<AppState>;
        const safeFoods = dropLegacyFoods(persisted.foods ?? []);
        const safeMeals = dropLegacyMeals(persisted.meals ?? []);
        const safeLog = dropLegacyLogEntries(persisted.log ?? []);
        return {
          ...currentState,
          ...persisted,
          foods: mergeSeedById(safeFoods, seedFoods),
          meals: mergeSeedById(safeMeals, seedMeals),
          cuisines: mergeSeedById(persisted.cuisines, seedCuisines),
          log: safeLog,
        };
      },
    }
  )
);
