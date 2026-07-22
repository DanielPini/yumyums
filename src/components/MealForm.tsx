import { useMemo, useState, type SubmitEvent } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { Meal, MealIngredient } from '../types';
import { useAppStore } from '../store/useAppStore';
import { defaultAmountForFood, mealMacrosPerServing } from '../utils/macros';
import MacroBadges from './MacroBadges';
import AmountInput from './AmountInput';
import FoodSearchSelect from './FoodSearchSelect';

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
  const sortedFoods = useMemo(() => [...foods].sort((a, b) => a.name.localeCompare(b.name)), [foods]);

  const [name, setName] = useState(initial?.name ?? '');
  const [cuisineId, setCuisineId] = useState<string | null>(initial?.cuisineId ?? null);
  const [favourite, setFavourite] = useState(initial?.favourite ?? false);
  const [ingredients, setIngredients] = useState<MealIngredient[]>(
    initial?.ingredients ?? [{ foodId: '', amount: { mode: 'weight', quantity: 100 } }]
  );
  const [recipeSteps, setRecipeSteps] = useState<string[]>(initial?.recipeSteps ?? []);
  const [notes, setNotes] = useState(initial?.notes ?? '');
  const [focusIndex, setFocusIndex] = useState<number | null>(null);

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
    setFocusIndex(ingredients.length);
    setIngredients((prev) => [...prev, { foodId: '', amount: { mode: 'weight', quantity: 100 } }]);
  }

  function updateStep(index: number, value: string) {
    setRecipeSteps((prev) => prev.map((s, i) => (i === index ? value : s)));
  }

  function removeStep(index: number) {
    setRecipeSteps((prev) => prev.filter((_, i) => i !== index));
  }

  function addStep() {
    setRecipeSteps((prev) => [...prev, '']);
  }

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const validIngredients = ingredients.filter((ing) => ing.foodId);
    if (!name.trim() || validIngredients.length === 0) return;
    const cleanedSteps = recipeSteps.map((s) => s.trim()).filter(Boolean);
    onSubmit({
      name: name.trim(),
      cuisineId,
      favourite,
      ingredients: validIngredients,
      recipeSteps: cleanedSteps.length > 0 ? cleanedSteps : undefined,
      notes: notes.trim() || undefined,
    });
  }

  const inputClass =
    'w-full rounded-md border border-border bg-surface px-3 py-1.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-xs font-medium text-muted">Meal name</label>
        <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} required autoFocus />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">Cuisine</label>
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
          <label className="block text-xs font-medium text-muted">Ingredients</label>
          <button type="button" onClick={addIngredient} className="flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700">
            <Plus size={13} /> Add ingredient
          </button>
        </div>
        <div className="space-y-2">
          {ingredients.map((ing, i) => {
            const food = foodsById.get(ing.foodId);
            return (
              <div key={i} className="flex items-center gap-2">
                <FoodSearchSelect
                  className="flex-1"
                  foods={sortedFoods}
                  value={ing.foodId}
                  onChange={(id) => updateIngredient(i, { foodId: id, amount: defaultAmountForFood(foodsById.get(id)) })}
                  autoFocus={i === focusIndex}
                />
                {food && <AmountInput food={food} amount={ing.amount} onChange={(amount) => updateIngredient(i, { amount })} />}
                <button
                  type="button"
                  onClick={() => removeIngredient(i)}
                  className="rounded p-1.5 text-subtle hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950"
                  aria-label="Remove ingredient"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            );
          })}
          {ingredients.length === 0 && <p className="text-xs text-subtle">No ingredients yet.</p>}
        </div>
      </div>

      <div className="rounded-md bg-surface-muted p-3">
        <p className="mb-1.5 text-xs font-medium text-muted">Macros per serving</p>
        <MacroBadges macros={macrosPerServing} />
      </div>

      <div>
        <div className="mb-1 flex items-center justify-between">
          <label className="block text-xs font-medium text-muted">Recipe steps</label>
          <button type="button" onClick={addStep} className="flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700">
            <Plus size={13} /> Add step
          </button>
        </div>
        <div className="space-y-2">
          {recipeSteps.map((step, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="mt-2 w-5 shrink-0 text-right text-xs text-subtle">{i + 1}.</span>
              <textarea
                className={`${inputClass} flex-1`}
                rows={2}
                value={step}
                onChange={(e) => updateStep(i, e.target.value)}
                placeholder={`Step ${i + 1}`}
              />
              <button
                type="button"
                onClick={() => removeStep(i)}
                className="mt-1.5 rounded p-1.5 text-subtle hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950"
                aria-label="Remove step"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          {recipeSteps.length === 0 && <p className="text-xs text-subtle">No recipe steps yet.</p>}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-muted">Notes (optional)</label>
        <textarea className={inputClass} rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onCancel} className="rounded-md px-3 py-1.5 text-sm font-medium text-muted hover:bg-stone-100 dark:hover:bg-stone-800">
          Cancel
        </button>
        <button type="submit" className="rounded-md bg-brand-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-700">
          {initial ? 'Save changes' : 'Add meal'}
        </button>
      </div>
    </form>
  );
}
