import { useMemo, useState, type SubmitEvent } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { Meal, MealIngredient } from '../types';
import { useAppStore } from '../store/useAppStore';
import { defaultAmountForFood, mealMacrosPerServing } from '../utils/macros';
import MacroBadges from './MacroBadges';
import AmountInput from './AmountInput';

export type MealFormValues = Omit<Meal, 'id' | 'createdAt'>;

export default function MealForm({
  initial,
  onSubmit,
  onCancel,
}: {
  initial?: Meal;
  onSubmit: (values: MealFormValues) => void;
  onCancel: () => void;
}) {
  const foods = useAppStore((s) => s.foods);
  const cuisines = useAppStore((s) => s.cuisines);
  const foodsById = useMemo(() => new Map(foods.map((f) => [f.id, f])), [foods]);

  const [name, setName] = useState(initial?.name ?? '');
  const [cuisineId, setCuisineId] = useState<string | null>(initial?.cuisineId ?? null);
  const [favourite, setFavourite] = useState(initial?.favourite ?? false);
  const [ingredients, setIngredients] = useState<MealIngredient[]>(
    initial?.ingredients ?? (foods[0] ? [{ foodId: foods[0].id, amount: defaultAmountForFood() }] : [])
  );
  const [notes, setNotes] = useState(initial?.notes ?? '');

  const previewMeal = useMemo<Meal>(
    () => ({
      id: 'preview',
      name,
      cuisineId,
      favourite,
      ingredients,
      notes,
      createdAt: 0,
    }),
    [name, cuisineId, favourite, ingredients, notes]
  );
  const macrosPerServing = useMemo(
    () => mealMacrosPerServing(previewMeal, foodsById),
    [previewMeal, foodsById]
  );

  function updateIngredient(index: number, patch: Partial<MealIngredient>) {
    setIngredients((prev) => prev.map((ing, i) => (i === index ? { ...ing, ...patch } : ing)));
  }

  function removeIngredient(index: number) {
    setIngredients((prev) => prev.filter((_, i) => i !== index));
  }

  function addIngredient() {
    if (foods.length === 0) return;
    setIngredients((prev) => [...prev, { foodId: foods[0].id, amount: defaultAmountForFood() }]);
  }

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name.trim() || ingredients.length === 0) return;
    onSubmit({
      name: name.trim(),
      cuisineId,
      favourite,
      ingredients,
      notes: notes.trim() || undefined,
    });
  }

  const inputClass =
    'w-full rounded-md border border-stone-200 bg-white px-3 py-1.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100 dark:border-stone-700 dark:bg-stone-950';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-xs font-medium text-stone-500">Meal name</label>
        <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} required autoFocus />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-stone-500">Cuisine</label>
          <select
            className={inputClass}
            value={cuisineId ?? ''}
            onChange={(e) => setCuisineId(e.target.value || null)}
          >
            <option value="">No cuisine</option>
            {cuisines.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end pb-1.5">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={favourite} onChange={(e) => setFavourite(e.target.checked)} className="h-4 w-4 rounded accent-brand-600" />
            Mark as favourite
          </label>
        </div>
      </div>

      <div>
        <div className="mb-1 flex items-center justify-between">
          <label className="block text-xs font-medium text-stone-500">Ingredients</label>
          <button type="button" onClick={addIngredient} className="flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700">
            <Plus size={13} /> Add ingredient
          </button>
        </div>
        <div className="space-y-2">
          {ingredients.map((ing, i) => {
            const food = foodsById.get(ing.foodId);
            return (
              <div key={i} className="flex items-center gap-2">
                <select
                  className={`${inputClass} flex-1`}
                  value={ing.foodId}
                  onChange={(e) => updateIngredient(i, { foodId: e.target.value, amount: defaultAmountForFood() })}
                >
                  {foods.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>
                <AmountInput food={food} amount={ing.amount} onChange={(amount) => updateIngredient(i, { amount })} />
                <button
                  type="button"
                  onClick={() => removeIngredient(i)}
                  className="rounded p-1.5 text-stone-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950"
                  aria-label="Remove ingredient"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            );
          })}
          {ingredients.length === 0 && <p className="text-xs text-stone-400">No ingredients yet.</p>}
        </div>
      </div>

      <div className="rounded-md bg-stone-50 p-3 dark:bg-stone-800/50">
        <p className="mb-1.5 text-xs font-medium text-stone-500">Macros per serving</p>
        <MacroBadges macros={macrosPerServing} />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-stone-500">Notes (optional)</label>
        <textarea className={inputClass} rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onCancel} className="rounded-md px-3 py-1.5 text-sm font-medium text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800">
          Cancel
        </button>
        <button type="submit" className="rounded-md bg-brand-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-700">
          {initial ? 'Save changes' : 'Add meal'}
        </button>
      </div>
    </form>
  );
}
