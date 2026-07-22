import type { LogEntry, MealType } from '../types';

/** Guesses which meal is being eaten right now, for pre-filling the meal-time picker. */
export function currentMealType(now: Date = new Date()): MealType {
  const hour = now.getHours();
  if (hour < 11) return 'Breakfast';
  if (hour < 16) return 'Lunch';
  return 'Dinner';
}

/** Canonical meal-time order used everywhere a day's meals are listed or grouped. */
export const MEAL_TYPE_ORDER: MealType[] = ['Breakfast', 'Lunch', 'Snack', 'Dinner'];

/** Sorts log entries by meal time (Breakfast, Lunch, Snack, Dinner), preserving relative order within the same meal time. */
export function sortByMealType<T extends Pick<LogEntry, 'mealType'>>(entries: T[]): T[] {
  return [...entries].sort((a, b) => MEAL_TYPE_ORDER.indexOf(a.mealType) - MEAL_TYPE_ORDER.indexOf(b.mealType));
}
