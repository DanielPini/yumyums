import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuid } from 'uuid';
import type { Cuisine, Food, LogEntry, MacroTargets, Meal } from '../types';
import { seedCuisines, seedFoods, seedMeals } from '../data/seedData';

interface AppState {
  foods: Food[];
  meals: Meal[];
  cuisines: Cuisine[];
  log: LogEntry[];
  macroTargets: MacroTargets;

  addFood: (food: Omit<Food, 'id' | 'createdAt'>) => void;
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

      addFood: (food) =>
        set((state) => ({
          foods: [...state.foods, { ...food, id: uuid(), createdAt: Date.now() }],
        })),
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
    { name: 'yumyums-store' }
  )
);
