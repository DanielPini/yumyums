import { useState, type SubmitEvent } from 'react';
import type { MacroTargets } from '../types';
import { CALORIES_PER_GRAM } from '../utils/macros';
import Modal from './Modal';

/** Grams and % of calories for one macro, kept in sync — editing either recomputes the other against the current calorie target. */
function MacroRow({
  label,
  grams,
  calories,
  perG,
  onChangeGrams,
}: {
  label: string;
  grams: string;
  calories: number;
  perG: number;
  onChangeGrams: (grams: string) => void;
}) {
  const gramsNum = Number(grams) || 0;
  const pct = calories > 0 ? Math.round(((gramsNum * perG) / calories) * 100) : 0;

  function onChangePct(pctStr: string) {
    const pctNum = Number(pctStr) || 0;
    const newGrams = (calories * pctNum) / 100 / perG;
    onChangeGrams(String(Math.round(newGrams)));
  }

  const inputClass =
    'w-full rounded-md border border-border bg-surface px-3 py-1.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100';

  return (
    <div className="grid grid-cols-[1fr_auto_auto] items-center gap-2">
      <label className="text-sm font-medium text-muted">{label}</label>
      <div className="flex items-center gap-1">
        <input
          type="number"
          min="0"
          className={`${inputClass} w-20`}
          value={grams}
          onChange={(e) => onChangeGrams(e.target.value)}
        />
        <span className="text-xs text-subtle">g</span>
      </div>
      <div className="flex items-center gap-1">
        <input
          type="number"
          min="0"
          max="100"
          className={`${inputClass} w-16`}
          value={pct}
          onChange={(e) => onChangePct(e.target.value)}
        />
        <span className="text-xs text-subtle">%</span>
      </div>
    </div>
  );
}

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

  const caloriesNum = Number(calories) || 0;
  const pctOfTarget = (grams: string, perG: number) =>
    caloriesNum > 0 ? Math.round(((Number(grams) || 0) * perG * 100) / caloriesNum) : 0;
  const pctTotal =
    pctOfTarget(protein, CALORIES_PER_GRAM.protein) +
    pctOfTarget(carbs, CALORIES_PER_GRAM.carbs) +
    pctOfTarget(fat, CALORIES_PER_GRAM.fat);

  const inputClass =
    'w-full rounded-md border border-border bg-surface px-3 py-1.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100';

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    onSave({
      calories: caloriesNum,
      protein: Number(protein) || 0,
      carbs: Number(carbs) || 0,
      fat: Number(fat) || 0,
    });
  }

  return (
    <Modal title="Daily macro goals" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">Calories (kcal)</label>
          <input type="number" min="0" className={inputClass} value={calories} onChange={(e) => setCalories(e.target.value)} />
        </div>

        <div className="space-y-2">
          <div className="grid grid-cols-[1fr_auto_auto] gap-2 text-[11px] text-subtle">
            <span />
            <span className="w-20 text-center">grams</span>
            <span className="w-16 text-center">% of cal.</span>
          </div>
          <MacroRow label="Protein" grams={protein} calories={caloriesNum} perG={CALORIES_PER_GRAM.protein} onChangeGrams={setProtein} />
          <MacroRow label="Carbs" grams={carbs} calories={caloriesNum} perG={CALORIES_PER_GRAM.carbs} onChangeGrams={setCarbs} />
          <MacroRow label="Fat" grams={fat} calories={caloriesNum} perG={CALORIES_PER_GRAM.fat} onChangeGrams={setFat} />
          <p className="text-right text-xs font-medium text-subtle">Total: {pctTotal}% of calories</p>
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
