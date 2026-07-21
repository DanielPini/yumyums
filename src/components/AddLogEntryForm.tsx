import { Fragment, useMemo, useState, type SubmitEvent } from 'react';
import { Plus } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import type { FoodAmount, LogEntry, MealType } from '../types';
import { defaultAmountForFood, foodMacrosForAmount, mealMacrosPerServing, scaleMacros } from '../utils/macros';
import MacroBadges from './MacroBadges';
import AmountInput from './AmountInput';
import Modal from './Modal';
import FoodForm, { type FoodFormValues } from './FoodForm';

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
  const addFood = useAppStore((s) => s.addFood);
  const foodsById = useMemo(() => new Map(foods.map((f) => [f.id, f])), [foods]);
  const sortedFoods = useMemo(() => [...foods].sort((a, b) => a.name.localeCompare(b.name)), [foods]);
  const sortedMeals = useMemo(() => [...meals].sort((a, b) => a.name.localeCompare(b.name)), [meals]);

  const [sourceType, setSourceType] = useState<'food' | 'meal'>('food');
  const [mealType, setMealType] = useState<MealType>(defaultMealType);
  const [foodId, setFoodId] = useState(sortedFoods[0]?.id ?? '');
  const [amount, setAmount] = useState<FoodAmount>(defaultAmountForFood(sortedFoods[0]));
  const [mealId, setMealId] = useState(sortedMeals[0]?.id ?? '');
  const [servings, setServings] = useState(1);
  const [showAddFood, setShowAddFood] = useState(false);

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

  function handleAddFood(values: FoodFormValues) {
    const newId = addFood(values);
    setFoodId(newId);
    setAmount(defaultAmountForFood(values));
    setShowAddFood(false);
  }

  const inputClass =
    'w-full rounded-md border border-border bg-surface px-3 py-1.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100';

  return (
    <Fragment>
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
                : 'border-border text-muted'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-muted">Meal time</label>
        <select className={inputClass} value={mealType} onChange={(e) => setMealType(e.target.value as MealType)}>
          {mealTypes.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      {sourceType === 'food' ? (
        <div className="space-y-2">
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <label className="mb-1 block text-xs font-medium text-muted">Food</label>
              <select
                className={inputClass}
                value={foodId}
                onChange={(e) => {
                  setFoodId(e.target.value);
                  setAmount(defaultAmountForFood(foodsById.get(e.target.value)));
                }}
              >
                {sortedFoods.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted">Quantity</label>
              <AmountInput food={selectedFood} amount={amount} onChange={setAmount} />
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowAddFood(true)}
            className="flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700"
          >
            <Plus size={13} /> Can't find it? Add a new food
          </button>
        </div>
      ) : (
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="mb-1 block text-xs font-medium text-muted">Meal</label>
            <select className={inputClass} value={mealId} onChange={(e) => setMealId(e.target.value)}>
              {sortedMeals.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
          <div className="w-28">
            <label className="mb-1 block text-xs font-medium text-muted">Servings</label>
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
        <div className="rounded-md bg-surface-muted p-3">
          <MacroBadges macros={previewMacros} />
        </div>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onCancel} className="rounded-md px-3 py-1.5 text-sm font-medium text-muted hover:bg-stone-100 dark:hover:bg-stone-800">
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

      {showAddFood && (
        <Modal title="Add food" onClose={() => setShowAddFood(false)}>
          <FoodForm onSubmit={handleAddFood} onCancel={() => setShowAddFood(false)} />
        </Modal>
      )}
    </Fragment>
  );
}
