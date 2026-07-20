import { useState } from 'react';
import type { Food, FoodCategory, DietType, Unit } from '../types';
import { useAppStore } from '../store/useAppStore';

const categories: FoodCategory[] = [
  'Grain',
  'Vegetable',
  'Fruit',
  'Legume',
  'Dairy',
  'Nuts & Seeds',
  'Protein',
  'Fat & Oil',
  'Spice & Condiment',
  'Beverage',
  'Other',
];

const dietTypes: DietType[] = ['vegetarian', 'vegan', 'eggetarian'];
const units: Unit[] = ['g', 'ml', 'piece'];

export type FoodFormValues = Omit<Food, 'id' | 'createdAt'>;

export default function FoodForm({
  initial,
  onSubmit,
  onCancel,
}: {
  initial?: Food;
  onSubmit: (values: FoodFormValues) => void;
  onCancel: () => void;
}) {
  const cuisines = useAppStore((s) => s.cuisines);

  const [name, setName] = useState(initial?.name ?? '');
  const [category, setCategory] = useState<FoodCategory>(initial?.category ?? 'Vegetable');
  const [dietType, setDietType] = useState<DietType>(initial?.dietType ?? 'vegetarian');
  const [unit, setUnit] = useState<Unit>(initial?.unit ?? 'g');
  const [calories, setCalories] = useState(String(initial?.macrosPer.calories ?? ''));
  const [protein, setProtein] = useState(String(initial?.macrosPer.protein ?? ''));
  const [carbs, setCarbs] = useState(String(initial?.macrosPer.carbs ?? ''));
  const [fat, setFat] = useState(String(initial?.macrosPer.fat ?? ''));
  const [cuisineIds, setCuisineIds] = useState<string[]>(initial?.cuisineIds ?? []);
  const [notes, setNotes] = useState(initial?.notes ?? '');

  function toggleCuisine(id: string) {
    setCuisineIds((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({
      name: name.trim(),
      category,
      dietType,
      unit,
      macrosPer: {
        calories: Number(calories) || 0,
        protein: Number(protein) || 0,
        carbs: Number(carbs) || 0,
        fat: Number(fat) || 0,
      },
      cuisineIds,
      notes: notes.trim() || undefined,
    });
  }

  const inputClass =
    'w-full rounded-md border border-stone-200 bg-white px-3 py-1.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100 dark:border-stone-700 dark:bg-stone-950';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-xs font-medium text-stone-500">Name</label>
        <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} required autoFocus />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-stone-500">Category</label>
          <select className={inputClass} value={category} onChange={(e) => setCategory(e.target.value as FoodCategory)}>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-stone-500">Diet</label>
          <select className={inputClass} value={dietType} onChange={(e) => setDietType(e.target.value as DietType)}>
            {dietTypes.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-stone-500">Unit</label>
          <select className={inputClass} value={unit} onChange={(e) => setUnit(e.target.value as Unit)}>
            {units.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <p className="mb-1 text-xs font-medium text-stone-500">
          Macros per {unit === 'piece' ? '1 piece' : `100${unit}`}
        </p>
        <div className="grid grid-cols-4 gap-3">
          <div>
            <label className="mb-1 block text-[11px] text-stone-400">Calories</label>
            <input type="number" min="0" step="any" className={inputClass} value={calories} onChange={(e) => setCalories(e.target.value)} required />
          </div>
          <div>
            <label className="mb-1 block text-[11px] text-stone-400">Protein (g)</label>
            <input type="number" min="0" step="any" className={inputClass} value={protein} onChange={(e) => setProtein(e.target.value)} required />
          </div>
          <div>
            <label className="mb-1 block text-[11px] text-stone-400">Carbs (g)</label>
            <input type="number" min="0" step="any" className={inputClass} value={carbs} onChange={(e) => setCarbs(e.target.value)} required />
          </div>
          <div>
            <label className="mb-1 block text-[11px] text-stone-400">Fat (g)</label>
            <input type="number" min="0" step="any" className={inputClass} value={fat} onChange={(e) => setFat(e.target.value)} required />
          </div>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-stone-500">Cuisines</label>
        <div className="flex flex-wrap gap-1.5">
          {cuisines.map((c) => (
            <button
              type="button"
              key={c.id}
              onClick={() => toggleCuisine(c.id)}
              className={`rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
                cuisineIds.includes(c.id)
                  ? 'border-brand-400 bg-brand-50 text-brand-700 dark:border-brand-600 dark:bg-brand-900/40 dark:text-brand-200'
                  : 'border-stone-200 text-stone-500 hover:border-stone-300 dark:border-stone-700'
              }`}
            >
              {c.name}
            </button>
          ))}
          {cuisines.length === 0 && <p className="text-xs text-stone-400">No cuisines yet — add one on the Cuisines page.</p>}
        </div>
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
          {initial ? 'Save changes' : 'Add food'}
        </button>
      </div>
    </form>
  );
}
