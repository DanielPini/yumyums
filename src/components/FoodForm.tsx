import { useState, type SubmitEvent } from 'react';
import type { BaseUnit, DietType, Food, FoodCategory } from '../types';
import { useAppStore } from '../store/useAppStore';

const categories: FoodCategory[] = [
  'Grain',
  'Vegetable',
  'Fruit',
  'Legume',
  'Dairy',
  'Eggs',
  'Nuts & Seeds',
  'Protein',
  'Sweets & Desserts',
  'Fat & Oil',
  'Spice & Condiment',
  'Beverage',
  'Other',
];

const dietTypes: DietType[] = ['vegetarian', 'vegan', 'eggetarian'];
const baseUnits: BaseUnit[] = ['g', 'ml'];

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
  const [baseUnit, setBaseUnit] = useState<BaseUnit>(initial?.baseUnit ?? 'g');
  const [calories, setCalories] = useState(String(initial?.macrosPer100.calories ?? ''));
  const [protein, setProtein] = useState(String(initial?.macrosPer100.protein ?? ''));
  const [carbs, setCarbs] = useState(String(initial?.macrosPer100.carbs ?? ''));
  const [fat, setFat] = useState(String(initial?.macrosPer100.fat ?? ''));
  const [defaultServing, setDefaultServing] = useState(String(initial?.defaultServing ?? 100));
  const [hasPiece, setHasPiece] = useState(!!initial?.pieceSize);
  const [pieceSize, setPieceSize] = useState(String(initial?.pieceSize ?? ''));
  const [pieceLabel, setPieceLabel] = useState(initial?.pieceLabel ?? '');
  const [cuisineIds, setCuisineIds] = useState<string[]>(initial?.cuisineIds ?? []);
  const [notes, setNotes] = useState(initial?.notes ?? '');

  function toggleCuisine(id: string) {
    setCuisineIds((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));
  }

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({
      name: name.trim(),
      category,
      dietType,
      baseUnit,
      macrosPer100: {
        calories: Number(calories) || 0,
        protein: Number(protein) || 0,
        carbs: Number(carbs) || 0,
        fat: Number(fat) || 0,
      },
      defaultServing: Number(defaultServing) > 0 ? Number(defaultServing) : undefined,
      pieceSize: hasPiece && Number(pieceSize) > 0 ? Number(pieceSize) : undefined,
      pieceLabel: hasPiece && pieceLabel.trim() ? pieceLabel.trim() : undefined,
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
          <label className="mb-1 block text-xs font-medium text-stone-500">Weight unit</label>
          <select className={inputClass} value={baseUnit} onChange={(e) => setBaseUnit(e.target.value as BaseUnit)}>
            {baseUnits.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <p className="mb-1 text-xs font-medium text-stone-500">Macros per 100{baseUnit}</p>
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
        <label className="mb-1 block text-xs font-medium text-stone-500">
          Default serving size ({baseUnit}) — used to pre-fill quantity when logging by weight
        </label>
        <input
          type="number"
          min="0"
          step="any"
          className={`${inputClass} max-w-[8rem]`}
          value={defaultServing}
          onChange={(e) => setDefaultServing(e.target.value)}
        />
      </div>

      <div className="rounded-md border border-stone-200 p-3 dark:border-stone-700">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={hasPiece} onChange={(e) => setHasPiece(e.target.checked)} className="h-4 w-4 rounded accent-brand-600" />
          Also has a typical item size (e.g. "1 egg", "1 slice")
        </label>
        {hasPiece && (
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-[11px] text-stone-400">Weight of 1 item ({baseUnit})</label>
              <input type="number" min="0" step="any" className={inputClass} value={pieceSize} onChange={(e) => setPieceSize(e.target.value)} />
            </div>
            <div>
              <label className="mb-1 block text-[11px] text-stone-400">Item label</label>
              <input className={inputClass} placeholder="1 egg" value={pieceLabel} onChange={(e) => setPieceLabel(e.target.value)} />
            </div>
          </div>
        )}
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
