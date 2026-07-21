import { useState } from 'react';
import type { MacroTargets } from '../types';
import Modal from './Modal';

export default function TargetsModal({
  initial,
  onSave,
  onClose,
}: {
  initial: MacroTargets;
  onSave: (t: MacroTargets) => void;
  onClose: () => void;
}) {
  const [calories, setCalories] = useState(String(initial.calories));
  const [protein, setProtein] = useState(String(initial.protein));
  const [carbs, setCarbs] = useState(String(initial.carbs));
  const [fat, setFat] = useState(String(initial.fat));

  const inputClass =
    'w-full rounded-md border border-border bg-surface px-3 py-1.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100';

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
            <label className="mb-1 block text-xs font-medium text-muted">Calories (kcal)</label>
            <input type="number" min="0" className={inputClass} value={calories} onChange={(e) => setCalories(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">Protein (g)</label>
            <input type="number" min="0" className={inputClass} value={protein} onChange={(e) => setProtein(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">Carbs (g)</label>
            <input type="number" min="0" className={inputClass} value={carbs} onChange={(e) => setCarbs(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">Fat (g)</label>
            <input type="number" min="0" className={inputClass} value={fat} onChange={(e) => setFat(e.target.value)} />
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="rounded-md px-3 py-1.5 text-sm font-medium text-muted hover:bg-stone-100 dark:hover:bg-stone-800">
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
