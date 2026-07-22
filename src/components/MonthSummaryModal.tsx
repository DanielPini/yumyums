import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Trophy } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { todayStr } from '../utils/date';
import { getMonthSummary } from '../utils/monthSummary';
import { roundMacros } from '../utils/macros';
import Modal from './Modal';

export default function MonthSummaryModal({ onClose }: { onClose: () => void }) {
  const today = todayStr();
  const [year, setYear] = useState(() => Number(today.slice(0, 4)));
  const [month, setMonth] = useState(() => Number(today.slice(5, 7)) - 1);

  const log = useAppStore((s) => s.log);
  const foods = useAppStore((s) => s.foods);
  const meals = useAppStore((s) => s.meals);

  const foodsById = useMemo(() => new Map(foods.map((f) => [f.id, f])), [foods]);
  const mealsById = useMemo(() => new Map(meals.map((m) => [m.id, m])), [meals]);

  const summary = useMemo(
    () => getMonthSummary(log, foodsById, mealsById, year, month),
    [log, foodsById, mealsById, year, month]
  );

  const monthLabel = new Date(year, month, 1).toLocaleDateString(undefined, { month: 'long', year: 'numeric' });

  function goToPrevMonth() {
    if (month === 0) {
      setYear((y) => y - 1);
      setMonth(11);
    } else {
      setMonth((m) => m - 1);
    }
  }

  function goToNextMonth() {
    if (month === 11) {
      setYear((y) => y + 1);
      setMonth(0);
    } else {
      setMonth((m) => m + 1);
    }
  }

  const totals = roundMacros(summary.totals);
  const hasData = summary.entryCount > 0;
  const { protein, carbs, fat } = summary.avgPct;
  const hasPct = protein !== null && carbs !== null && fat !== null;

  return (
    <Modal title="Month summary" onClose={onClose}>
      <div className="space-y-5">
        <div className="flex items-center justify-center gap-2">
          <button onClick={goToPrevMonth} className="rounded-md p-1.5 text-muted hover:bg-stone-100 dark:hover:bg-stone-800" aria-label="Previous month">
            <ChevronLeft size={16} />
          </button>
          <h3 className="w-40 text-center text-sm font-semibold">{monthLabel}</h3>
          <button onClick={goToNextMonth} className="rounded-md p-1.5 text-muted hover:bg-stone-100 dark:hover:bg-stone-800" aria-label="Next month">
            <ChevronRight size={16} />
          </button>
        </div>

        {!hasData ? (
          <p className="text-center text-sm text-subtle">Nothing logged in {monthLabel} yet.</p>
        ) : (
          <>
            <p className="text-center text-sm text-muted">
              This month you logged <span className="font-semibold text-ink">{summary.distinctMealCount}</span> different meal
              {summary.distinctMealCount === 1 ? '' : 's'} with{' '}
              <span className="font-semibold text-ink">{summary.distinctIngredientCount}</span> different ingredient
              {summary.distinctIngredientCount === 1 ? '' : 's'}.
            </p>

            <div>
              <h4 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-subtle">
                <Trophy size={13} /> Top meals
              </h4>
              {summary.topMeals.length === 0 ? (
                <p className="text-sm text-subtle">No saved meals logged this month — just individual foods.</p>
              ) : (
                <ol className="space-y-1.5">
                  {summary.topMeals.map(({ meal, count }, i) => (
                    <li key={meal.id} className="flex items-center gap-2.5 rounded-md bg-surface-muted px-3 py-2">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700 dark:bg-brand-900/50 dark:text-brand-200">
                        {i + 1}
                      </span>
                      <span className="flex-1 truncate text-sm">{meal.name}</span>
                      <span className="shrink-0 text-xs text-subtle">{count}× logged</span>
                    </li>
                  ))}
                </ol>
              )}
            </div>

            <div>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-subtle">Average macro split</h4>
              <div className="rounded-md bg-surface-muted p-3">
                <p className="mb-2 text-sm text-muted">
                  {Math.round(totals.calories).toLocaleString()} kcal logged across {summary.daysLogged} day
                  {summary.daysLogged === 1 ? '' : 's'}
                </p>
                {!hasPct ? (
                  <p className="text-sm text-subtle">Not enough data yet.</p>
                ) : (
                  <div className="flex overflow-hidden rounded-full">
                    <div className="flex h-6 items-center justify-center bg-blue-500 text-[11px] font-medium text-white" style={{ width: `${protein}%` }}>
                      {protein >= 10 && `P ${protein}%`}
                    </div>
                    <div className="flex h-6 items-center justify-center bg-amber-500 text-[11px] font-medium text-white" style={{ width: `${carbs}%` }}>
                      {carbs >= 10 && `C ${carbs}%`}
                    </div>
                    <div className="flex h-6 items-center justify-center bg-rose-500 text-[11px] font-medium text-white" style={{ width: `${fat}%` }}>
                      {fat >= 10 && `F ${fat}%`}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
