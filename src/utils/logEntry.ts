import type { Food, LogEntry, Meal } from '../types';

const FRACTION_GLYPHS: Record<string, string> = { '0.25': '¼', '0.5': '½', '0.75': '¾' };

function formatPieceQuantity(quantity: number, pieceLabel: string): string {
  const glyph = FRACTION_GLYPHS[String(quantity)];
  if (glyph) return `${glyph} ${pieceLabel.replace(/^1\s+/, '')}`;
  if (quantity === 1) return pieceLabel;
  return `${quantity}× ${pieceLabel}`;
}

export function describeAmount(food: Food | undefined, amount: { mode: 'weight' | 'piece'; quantity: number }): string {
  if (!food) return `${amount.quantity}`;
  if (amount.mode === 'piece') {
    const pieceText = formatPieceQuantity(amount.quantity, food.pieceLabel ?? 'piece');
    if (food.pieceSize) {
      const grams = Math.round(food.pieceSize * amount.quantity);
      return `${pieceText} (${grams}${food.baseUnit})`;
    }
    return pieceText;
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
