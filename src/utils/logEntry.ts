import type { Food, LogEntry, Meal } from '../types';

const FRACTION_GLYPHS: Record<string, string> = { '0.25': '¼', '0.5': '½', '0.75': '¾' };

/** Inserts "(s)" after the first word of a piece label, e.g. "can (400g)" -> "can(s) (400g)". */
function pluralizePieceLabel(pieceLabel: string): string {
  const spaceIdx = pieceLabel.indexOf(' ');
  if (spaceIdx === -1) return `${pieceLabel}(s)`;
  return `${pieceLabel.slice(0, spaceIdx)}(s)${pieceLabel.slice(spaceIdx)}`;
}

/**
 * Formats a piece quantity against a food's piece label, which carries no leading count itself
 * (e.g. "banana", or "can (400g)" when the size needs to be explicit because it varies by
 * product). Fractions render as a glyph ("½ onion"); whole quantities get their own count
 * ("1 can (400g)", "3 banana(s)").
 */
export function formatPieceQuantity(quantity: number, pieceLabel: string): string {
  const glyph = FRACTION_GLYPHS[String(quantity)];
  if (glyph) return `${glyph} ${pieceLabel}`;
  if (quantity === 1) return `1 ${pieceLabel}`;
  return `${quantity} ${pluralizePieceLabel(pieceLabel)}`;
}

export function describeAmount(food: Food | undefined, amount: { mode: 'weight' | 'piece'; quantity: number }): string {
  if (!food) return `${amount.quantity}`;
  if (amount.mode === 'piece') {
    return formatPieceQuantity(amount.quantity, food.pieceLabel ?? 'piece');
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
