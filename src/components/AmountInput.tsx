import type { Food, FoodAmount } from '../types';

const inputClass =
  'w-full rounded-md border border-stone-200 bg-white px-3 py-1.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100 dark:border-stone-700 dark:bg-stone-950';

/** Quantity + weight/piece mode toggle for a food. Every food supports by-weight; by-piece only when the food defines a pieceSize. */
export default function AmountInput({
  food,
  amount,
  onChange,
}: {
  food: Food | undefined;
  amount: FoodAmount;
  onChange: (amount: FoodAmount) => void;
}) {
  const hasPiece = !!food?.pieceSize;
  const pieceLabel = food?.pieceLabel ?? '1 piece';

  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        min="0"
        step="any"
        className={`${inputClass} w-24`}
        value={amount.quantity}
        onChange={(e) => onChange({ mode: amount.mode, quantity: Number(e.target.value) || 0 })}
      />
      {hasPiece ? (
        <div className="flex shrink-0 overflow-hidden rounded-md border border-stone-200 text-xs dark:border-stone-700">
          <button
            type="button"
            onClick={() => onChange({ mode: 'weight', quantity: amount.quantity })}
            className={`px-2 py-1.5 font-medium ${
              amount.mode === 'weight'
                ? 'bg-brand-500 text-white'
                : 'bg-white text-stone-500 hover:bg-stone-50 dark:bg-stone-900 dark:hover:bg-stone-800'
            }`}
          >
            {food?.baseUnit}
          </button>
          <button
            type="button"
            onClick={() => onChange({ mode: 'piece', quantity: amount.quantity })}
            className={`px-2 py-1.5 font-medium ${
              amount.mode === 'piece'
                ? 'bg-brand-500 text-white'
                : 'bg-white text-stone-500 hover:bg-stone-50 dark:bg-stone-900 dark:hover:bg-stone-800'
            }`}
          >
            {pieceLabel}
          </button>
        </div>
      ) : (
        <span className="w-10 shrink-0 text-xs text-stone-400">{food?.baseUnit}</span>
      )}
    </div>
  );
}
