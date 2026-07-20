import { useState } from 'react';
import { ChevronLeft, ChevronRight, Settings2 } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { addDays, formatDisplayDate, todayStr } from '../utils/date';
import Modal from '../components/Modal';
import DayPlan from '../components/DayPlan';

export default function LogPage() {
  const [date, setDate] = useState(todayStr());
  const [editingTargets, setEditingTargets] = useState(false);

  const macroTargets = useAppStore((s) => s.macroTargets);
  const setMacroTargets = useAppStore((s) => s.setMacroTargets);

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

      <DayPlan date={date} />

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
