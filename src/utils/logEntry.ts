import type { Food, LogEntry, Meal } from '../types';

export function describeAmount(food: Food | undefined, amount: { mode: 'weight' | 'piece'; quantity: number }): string {
  if (!food) return `${amount.quantity}`;
  if (amount.mode === 'piece') {
    const label = food.pieceLabel ?? 'piece';
    return `${amount.quantity}× ${label}`;
  }
  return `${amount.quantity}${food.baseUnit}`;
}

export function describeLogEntry(
  entry: LogEntry,
  foodsById: Map<string, Food>,
  mealsById: Map<string, Meal>
): string {
  if (entry.source.type === 'food') {
    const food = foodsById.get(entry.source.foodId);
    return `${food?.name ?? 'Unknown food'} · ${describeAmount(food, entry.source.amount)}`;
  }
  const meal = mealsById.get(entry.source.mealId);
  return `${meal?.name ?? 'Unknown meal'} · ${entry.source.servings}× serving`;
}
