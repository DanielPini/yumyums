import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Settings2, Trash2 } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import type { MealType } from '../types';
import { addDays, formatDisplayDate, todayStr } from '../utils/date';
import { addMacros, emptyMacros, logEntryMacros } from '../utils/macros';
import MacroSummary from '../components/MacroSummary';
import MacroBadges from '../components/MacroBadges';
import Modal from '../components/Modal';
import AddLogEntryForm from '../components/AddLogEntryForm';

const mealTypes: MealType[] = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

export default function LogPage() {
  const [date, setDate] = useState(todayStr());
  const [addingFor, setAddingFor] = useState<MealType | null>(null);
  const [editingTargets, setEditingTargets] = useState(false);

  const log = useAppStore((s) => s.log);
  const foods = useAppStore((s) => s.foods);
  const meals = useAppStore((s) => s.meals);
  const macroTargets = useAppStore((s) => s.macroTargets);
  const setMacroTargets = useAppStore((s) => s.setMacroTargets);
  const addLogEntry = useAppStore((s) => s.addLogEntry);
  const removeLogEntry = useAppStore((s) => s.removeLogEntry);

  const foodsById = useMemo(() => new Map(foods.map((f) => [f.id, f])), [foods]);
  const mealsById = useMemo(() => new Map(meals.map((m) => [m.id, m])), [meals]);

  const entriesForDay = useMemo(() => log.filter((l) => l.date === date), [log, date]);

  const dayTotals = useMemo(
    () => entriesForDay.reduce((total, e) => addMacros(total, logEntryMacros(e, foodsById, mealsById)), emptyMacros()),
    [entriesForDay, foodsById, mealsById]
  );

  function entryLabel(entry: (typeof entriesForDay)[number]) {
    if (entry.source.type === 'food') {
      const food = foodsById.get(entry.source.foodId);
      const unit = food?.unit === 'piece' ? 'pc' : food?.unit ?? '';
      return `${food?.name ?? 'Unknown food'} · ${entry.source.quantity}${unit}`;
    }
    const meal = mealsById.get(entry.source.mealId);
    return `${meal?.name ?? 'Unknown meal'} · ${entry.source.servings}× serving`;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDate((d) => addDays(d, -1))}
            className="rounded-md p-1.5 text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800"
            aria-label="Previous day"
          >
            <ChevronLeft size={18} />
          </button>
          <h1 className="w-36 text-center text-lg font-semibold">{formatDisplayDate(date)}</h1>
          <button
            onClick={() => setDate((d) => addDays(d, 1))}
            className="rounded-md p-1.5 text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800"
            aria-label="Next day"
          >
            <ChevronRight size={18} />
          </button>
          {date !== todayStr() && (
            <button onClick={() => setDate(todayStr())} className="ml-1 text-xs font-medium text-brand-600 hover:text-brand-700">
              Today
            </button>
          )}
        </div>
        <button
          onClick={() => setEditingTargets(true)}
          className="flex items-center gap-1.5 rounded-md border border-stone-200 px-2.5 py-1.5 text-sm text-stone-500 hover:bg-stone-100 dark:border-stone-700 dark:hover:bg-stone-800"
        >
          <Settings2 size={15} /> Goals
        </button>
      </div>

      <MacroSummary totals={dayTotals} targets={macroTargets} />

      <div className="space-y-4">
        {mealTypes.map((mealType) => {
          const entries = entriesForDay.filter((e) => e.mealType === mealType);
          const mealTotals = entries.reduce((total, e) => addMacros(total, logEntryMacros(e, foodsById, mealsById)), emptyMacros());
          return (
            <div key={mealType} className="rounded-lg border border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900">
              <div className="flex items-center justify-between border-b border-stone-100 px-4 py-2.5 dark:border-stone-800">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold">{mealType}</h3>
                  {entries.length > 0 && <span className="text-xs text-stone-400">{Math.round(mealTotals.calories)} kcal</span>}
                </div>
                <button
                  onClick={() => setAddingFor(mealType)}
                  className="flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700"
                >
                  <Plus size={14} /> Add
                </button>
              </div>
              {entries.length === 0 ? (
                <p className="px-4 py-3 text-sm text-stone-400">Nothing logged yet.</p>
              ) : (
                <ul className="divide-y divide-stone-100 dark:divide-stone-800">
                  {entries.map((entry) => (
                    <li key={entry.id} className="flex items-center justify-between gap-3 px-4 py-2.5">
                      <div className="min-w-0">
                        <p className="truncate text-sm">{entryLabel(entry)}</p>
                        <div className="mt-1">
                          <MacroBadges macros={logEntryMacros(entry, foodsById, mealsById)} />
                        </div>
                      </div>
                      <button
                        onClick={() => removeLogEntry(entry.id)}
                        className="shrink-0 rounded p-1 text-stone-300 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950"
                        aria-label="Remove entry"
                      >
                        <Trash2 size={14} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>

      {addingFor && (
        <Modal title={`Add to ${addingFor}`} onClose={() => setAddingFor(null)}>
          {foods.length === 0 ? (
            <p className="text-sm text-stone-500">Add some foods first on the Foods page.</p>
          ) : (
            <AddLogEntryForm
              date={date}
              defaultMealType={addingFor}
              onSubmit={(entry) => {
                addLogEntry(entry);
                setAddingFor(null);
              }}
              onCancel={() => setAddingFor(null)}
            />
          )}
        </Modal>
      )}

      {editingTargets && (
        <TargetsModal
          initial={macroTargets}
          onSave={(t) => {
            setMacroTargets(t);
            setEditingTargets(false);
          }}
          onClose={() => setEditingTargets(false)}
        />
      )}
    </div>
  );
}

function TargetsModal({
  initial,
  onSave,
  onClose,
}: {
  initial: { calories: number; protein: number; carbs: number; fat: number };
  onSave: (t: { calories: number; protein: number; carbs: number; fat: number }) => void;
  onClose: () => void;
}) {
  const [calories, setCalories] = useState(String(initial.calories));
  const [protein, setProtein] = useState(String(initial.protein));
  const [carbs, setCarbs] = useState(String(initial.carbs));
  const [fat, setFat] = useState(String(initial.fat));

  const inputClass =
    'w-full rounded-md border border-stone-200 bg-white px-3 py-1.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100 dark:border-stone-700 dark:bg-stone-950';

  return (
    <Modal title="Daily macro goals" onClose={onClose}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSave({
            calories: Number(calories) || 0,
            protein: Number(protein) || 0,
            carbs: Number(carbs) || 0,
            fat: Number(fat) || 0,
          });
        }}
        className="space-y-4"
      >
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-stone-500">Calories (kcal)</label>
            <input type="number" min="0" className={inputClass} value={calories} onChange={(e) => setCalories(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-stone-500">Protein (g)</label>
            <input type="number" min="0" className={inputClass} value={protein} onChange={(e) => setProtein(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-stone-500">Carbs (g)</label>
            <input type="number" min="0" className={inputClass} value={carbs} onChange={(e) => setCarbs(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-stone-500">Fat (g)</label>
            <input type="number" min="0" className={inputClass} value={fat} onChange={(e) => setFat(e.target.value)} />
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="rounded-md px-3 py-1.5 text-sm font-medium text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800">
            Cancel
          </button>
          <button type="submit" className="rounded-md bg-brand-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-700">
            Save goals
          </button>
        </div>
      </form>
    </Modal>
  );
}
