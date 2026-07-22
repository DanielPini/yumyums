import type { Food, FoodAmount, LogEntry, Meal } from '../types';
import { formatPieceQuantity } from './logEntry';

export interface ShoppingAmount {
  /** Summed weight/volume quantity, in the food's own baseUnit (g or ml). */
  weightQty: number;
  /** Summed piece count, in the food's own pieceLabel unit. */
  pieceQty: number;
}

/**
 * Total quantity needed per food for everything logged today or later, keyed by foodId — meal
 * entries are expanded into their ingredients, scaled by how many people that batch was cooked
 * for (not by the logger's own servings-eaten, which drives their personal macro totals
 * instead). Entries missing an explicit peopleServed fall back to `householdSize`. Entries dated
 * before `todayDate` are excluded, so totals naturally drop past days as soon as they're no
 * longer "today or later".
 */
export function getUpcomingShoppingAmounts(
  log: LogEntry[],
  meals: Meal[],
  todayDate: string,
  householdSize: number
): Map<string, ShoppingAmount> {
  const mealsById = new Map(meals.map((m) => [m.id, m]));
  const totals = new Map<string, ShoppingAmount>();

  function add(foodId: string, amount: FoodAmount, multiplier: number) {
    const existing = totals.get(foodId) ?? { weightQty: 0, pieceQty: 0 };
    if (amount.mode === 'weight') existing.weightQty += amount.quantity * multiplier;
    else existing.pieceQty += amount.quantity * multiplier;
    totals.set(foodId, existing);
  }

  for (const entry of log) {
    if (entry.date < todayDate) continue;
    if (entry.source.type === 'food') {
      add(entry.source.foodId, entry.source.amount, 1);
    } else {
      const meal = mealsById.get(entry.source.mealId);
      if (!meal) continue;
      const peopleServed = entry.source.peopleServed ?? householdSize;
      for (const ingredient of meal.ingredients) {
        add(ingredient.foodId, ingredient.amount, peopleServed);
      }
    }
  }

  return totals;
}

function roundQty(n: number): number {
  return Math.round(n * 10) / 10;
}

/** Human-readable total, e.g. "450g", "3 banana(s)", or "150g + 2 slice(s)" for a food logged in mixed units. */
export function formatShoppingAmount(food: Food, amount: ShoppingAmount): string {
  const parts: string[] = [];
  if (amount.weightQty > 0) {
    parts.push(`${roundQty(amount.weightQty)}${food.baseUnit}`);
  }
  if (amount.pieceQty > 0) {
    parts.push(formatPieceQuantity(roundQty(amount.pieceQty), food.pieceLabel ?? 'piece'));
  }
  return parts.join(' + ');
}
