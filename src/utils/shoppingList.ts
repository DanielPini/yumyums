import type { LogEntry, Meal } from '../types';

/**
 * Unique food ids needed for everything logged today or later — expanding meal entries into
 * their ingredients. Entries dated before `todayDate` are excluded, so the list naturally drops
 * past days as soon as they're no longer "today or later".
 */
export function getUpcomingShoppingFoodIds(log: LogEntry[], meals: Meal[], todayDate: string): string[] {
  const mealsById = new Map(meals.map((m) => [m.id, m]));
  const ids = new Set<string>();

  for (const entry of log) {
    if (entry.date < todayDate) continue;
    if (entry.source.type === 'food') {
      ids.add(entry.source.foodId);
    } else {
      const meal = mealsById.get(entry.source.mealId);
      if (!meal) continue;
      for (const ingredient of meal.ingredients) ids.add(ingredient.foodId);
    }
  }

  return [...ids];
}
