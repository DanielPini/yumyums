import type { Food, LogEntry, Macros, Meal, MealIngredient } from '../types';

const ZERO: Macros = { calories: 0, protein: 0, carbs: 0, fat: 0 };

export function addMacros(a: Macros, b: Macros): Macros {
  return {
    calories: a.calories + b.calories,
    protein: a.protein + b.protein,
    carbs: a.carbs + b.carbs,
    fat: a.fat + b.fat,
  };
}

export function scaleMacros(m: Macros, factor: number): Macros {
  return {
    calories: m.calories * factor,
    protein: m.protein * factor,
    carbs: m.carbs * factor,
    fat: m.fat * factor,
  };
}

/** Macros for a given quantity of a food, in the food's own unit. */
export function foodMacrosForQuantity(food: Food, quantity: number): Macros {
  const base = food.unit === 'piece' ? quantity : quantity / 100;
  return scaleMacros(food.macrosPer, base);
}

export function mealMacrosPerServing(meal: Meal, foodsById: Map<string, Food>): Macros {
  return meal.ingredients.reduce<Macros>((total, ing: MealIngredient) => {
    const food = foodsById.get(ing.foodId);
    if (!food) return total;
    return addMacros(total, foodMacrosForQuantity(food, ing.quantity));
  }, ZERO);
}

export function roundMacros(m: Macros): Macros {
  return {
    calories: Math.round(m.calories),
    protein: Math.round(m.protein * 10) / 10,
    carbs: Math.round(m.carbs * 10) / 10,
    fat: Math.round(m.fat * 10) / 10,
  };
}

export const emptyMacros = (): Macros => ({ ...ZERO });

export function logEntryMacros(
  entry: LogEntry,
  foodsById: Map<string, Food>,
  mealsById: Map<string, Meal>
): Macros {
  if (entry.source.type === 'food') {
    const food = foodsById.get(entry.source.foodId);
    if (!food) return ZERO;
    return foodMacrosForQuantity(food, entry.source.quantity);
  }
  const meal = mealsById.get(entry.source.mealId);
  if (!meal) return ZERO;
  return scaleMacros(mealMacrosPerServing(meal, foodsById), entry.source.servings);
}
