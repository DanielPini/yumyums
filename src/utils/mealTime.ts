import type { MealType } from '../types';

/** Guesses which meal is being eaten right now, for pre-filling the meal-time picker. */
export function currentMealType(now: Date = new Date()): MealType {
  const hour = now.getHours();
  if (hour < 11) return 'Breakfast';
  if (hour < 16) return 'Lunch';
  return 'Dinner';
}
