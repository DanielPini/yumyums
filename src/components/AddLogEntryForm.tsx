import { useMemo, useState, type SubmitEvent } from 'react';
import { useAppStore } from '../store/useAppStore';
import type { FoodAmount, LogEntry, MealType } from '../types';
import { defaultAmountForFood, foodMacrosForAmount, mealMacrosPerServing, scaleMacros } from '../utils/macros';
import MacroBadges from './MacroBadges';
import AmountInput from './AmountInput';

const mealTypes: MealType[] = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

export default function AddLogEntryForm({
  date,
  defaultMealType,
  onSubmit,
  onCancel,
}: {
  date: string;
  defaultMealType: MealType;
  onSubmit: (entry: Omit<LogEntry, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}) {
  const foods = useAppStore((s) => s.foods);
  const meals = useAppStore((s) => s.meals);
  const foodsById = useMemo(() => new Map(foods.map((f) => [f.id, f])), [foods]);

  const [sourceType, setSourceType] = useState<'food' | 'meal'>('food');
  const [mealType, setMealType] = useState<MealType>(defaultMealType);
  const [foodId, setFoodId] = useState(foods[0]?.id ?? '');
  const [amount, setAmount] = useState<FoodAmount>(defaultAmountForFood());
  const [mealId, setMealId] = useState(meals[0]?.id ?? '');
  const [servings, setServings] = useState(1);

  const selectedFood = foodsById.get(foodId);
  const selectedMeal = meals.find((m) => m.id === mealId);

  const previewMacros =
    sourceType === 'food' && selectedFood
      ? foodMacrosForAmount(selectedFood, amount)
      : sourceType === 'meal' && selectedMeal
        ? scaleMacros(mealMacrosPerServing(selectedMeal, foodsById), servings)
        : null;

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sourceType === 'food' && foodId) {
      onSubmit({ date, mealType, source: { type: 'food', foodId, amount } });
    } else if (sourceType === 'meal' && mealId) {
      onSubmit({ date, mealType, source: { type: 'meal', mealId, servings } });
    }
  }

  const inputClass =
    'w-full rounded-md border border-stone-200 bg-white px-3 py-1.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100 dark:border-stone-700 dark:bg-stone-950';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-2">
        {(['food', 'meal'] as const).map((t) => (
          <button
            type="button"
            key={t}
            onClick={() => setSourceType(t)}
            className={`flex-1 rounded-md border px-3 py-1.5 text-sm font-medium capitalize ${
              sourceType === t
                ? 'border-brand-400 bg-brand-50 text-brand-700 dark:border-brand-600 dark:bg-brand-900/40 dark:text-brand-200'
                : 'border-stone-200 text-stone-500 dark:border-stone-700'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-stone-500">Meal time</label>
        <select className={inputClass} value={mealType} onChange={(e) => setMealType(e.target.value as MealType)}>
          {mealTypes.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      {sourceType === 'food' ? (
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <label className="mb-1 block text-xs font-medium text-stone-500">Food</label>
            <select
              className={inputClass}
              value={foodId}
              onChange={(e) => {
                setFoodId(e.target.value);
                setAmount(defaultAmountForFood());
              }}
            >
              {foods.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-stone-500">Quantity</label>
            <AmountInput food={selectedFood} amount={amount} onChange={setAmount} />
          </div>
        </div>
      ) : (
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="mb-1 block text-xs font-medium text-stone-500">Meal</label>
            <select className={inputClass} value={mealId} onChange={(e) => setMealId(e.target.value)}>
              {meals.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
          <div className="w-28">
            <label className="mb-1 block text-xs font-medium text-stone-500">Servings</label>
            <input
              type="number"
              min="0"
              step="any"
              className={inputClass}
              value={servings}
              onChange={(e) => setServings(Number(e.target.value) || 0)}
            />
          </div>
        </div>
      )}

      {previewMacros && (
        <div className="rounded-md bg-stone-50 p-3 dark:bg-stone-800/50">
          <MacroBadges macros={previewMacros} />
        </div>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onCancel} className="rounded-md px-3 py-1.5 text-sm font-medium text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800">
          Cancel
        </button>
        <button
          type="submit"
          disabled={(sourceType === 'food' && !foodId) || (sourceType === 'meal' && !mealId)}
          className="rounded-md bg-brand-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50"
        >
          Log it
        </button>
      </div>
    </form>
  );
}
