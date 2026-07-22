import type { Food, FoodAmount, LogEntry, Macros, Meal, MealIngredient } from '../types';

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

/** Converts any FoodAmount (by weight or by piece) into base units (grams/ml) for a food. */
export function amountToBaseUnits(food: Food, amount: FoodAmount): number {
  if (amount.mode === 'weight') return amount.quantity;
  return (food.pieceSize ?? 0) * amount.quantity;
}

/** Amount pre-filled when a food is first selected: a single piece whenever the food has one (unless explicitly overridden to weight), otherwise the food's recommended serving weight (falls back to 100 if unset). */
export function defaultAmountForFood(food?: Pick<Food, 'defaultServing' | 'defaultMode' | 'pieceSize'>): FoodAmount {
  if (food?.pieceSize && food.defaultMode !== 'weight') {
    return { mode: 'piece', quantity: 1 };
  }
  return { mode: 'weight', quantity: food?.defaultServing ?? 100 };
}

/** Macros for a given amount of a food (by weight or by piece — every food supports weight). */
export function foodMacrosForAmount(food: Food, amount: FoodAmount): Macros {
  const baseUnits = amountToBaseUnits(food, amount);
  return scaleMacros(food.macrosPer100, baseUnits / 100);
}

export function mealMacrosPerServing(meal: Meal, foodsById: Map<string, Food>): Macros {
  return meal.ingredients.reduce<Macros>((total, ing: MealIngredient) => {
    const food = foodsById.get(ing.foodId);
    if (!food) return total;
    return addMacros(total, foodMacrosForAmount(food, ing.amount));
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

export const CALORIES_PER_GRAM = { protein: 4, carbs: 4, fat: 9 };

export interface MacroPercentages {
  protein: number | null;
  carbs: number | null;
  fat: number | null;
}

/** Share of total macro-derived calories each macro represents. Null values (not 0) when nothing is logged, so callers can distinguish "no data" from "0%". */
export function macroPercentages(m: Macros): MacroPercentages {
  const macroCalories = m.protein * CALORIES_PER_GRAM.protein + m.carbs * CALORIES_PER_GRAM.carbs + m.fat * CALORIES_PER_GRAM.fat;
  if (macroCalories <= 0) return { protein: null, carbs: null, fat: null };
  return {
    protein: Math.round((m.protein * CALORIES_PER_GRAM.protein * 100) / macroCalories),
    carbs: Math.round((m.carbs * CALORIES_PER_GRAM.carbs * 100) / macroCalories),
    fat: Math.round((m.fat * CALORIES_PER_GRAM.fat * 100) / macroCalories),
  };
}

export function logEntryMacros(
  entry: LogEntry,
  foodsById: Map<string, Food>,
  mealsById: Map<string, Meal>
): Macros {
  if (entry.source.type === 'food') {
    const food = foodsById.get(entry.source.foodId);
    if (!food) return ZERO;
    return foodMacrosForAmount(food, entry.source.amount);
  }
  const meal = mealsById.get(entry.source.mealId);
  if (!meal) return ZERO;
  return scaleMacros(mealMacrosPerServing(meal, foodsById), entry.source.servings);
}
