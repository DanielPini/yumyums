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
  mealsById: Map<string, Meal>,
  options?: { showMealType?: boolean }
): string {
  const base =
    entry.source.type === 'food'
      ? `${foodsById.get(entry.source.foodId)?.name ?? 'Unknown food'} · ${describeAmount(foodsById.get(entry.source.foodId), entry.source.amount)}`
      : `${mealsById.get(entry.source.mealId)?.name ?? 'Unknown meal'} · ${entry.source.servings}× serving`;

  return options?.showMealType ? `${entry.mealType[0]}: ${base}` : base;
}
