import { Plus } from 'lucide-react';
import type { Macros } from '../types';
import { roundMacros } from '../utils/macros';

export default function PlannerDayCell({
  dayNumber,
  isToday,
  inCurrentMonth,
  entryLabels,
  totals,
  onAdd,
  onOpen,
}: {
  dayNumber: number;
  isToday: boolean;
  inCurrentMonth: boolean;
  entryLabels: string[];
  totals: Macros;
  onAdd: () => void;
  onOpen: () => void;
}) {
  const m = roundMacros(totals);
  const hasEntries = entryLabels.length > 0;
  const maxShown = 3;
  const shown = entryLabels.slice(0, maxShown);
  const extra = entryLabels.length - shown.length;

  return (
    <div
      className={`flex min-h-[110px] flex-col rounded-lg border p-1.5 text-left sm:min-h-[130px] sm:p-2 ${
        inCurrentMonth
          ? 'border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900'
          : 'border-stone-100 bg-stone-50/50 dark:border-stone-900 dark:bg-stone-950/40'
      }`}
    >
      <div className="flex items-center justify-between">
        <button
          onClick={onOpen}
          className={`flex h-5 w-5 items-center justify-center rounded-full text-xs font-medium sm:h-6 sm:w-6 ${
            isToday
              ? 'bg-brand-500 text-white'
              : inCurrentMonth
                ? 'text-stone-700 hover:bg-stone-100 dark:text-stone-200 dark:hover:bg-stone-800'
                : 'text-stone-300 hover:bg-stone-100 dark:text-stone-600 dark:hover:bg-stone-800'
          }`}
        >
          {dayNumber}
        </button>
        <button
          onClick={onAdd}
          className="rounded p-0.5 text-stone-400 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-900/40"
          aria-label="Add planned food"
        >
          <Plus size={14} />
        </button>
      </div>

      <button onClick={onOpen} className="mt-1 flex-1 space-y-0.5 text-left">
        {shown.map((label, i) => (
          <p key={i} className="truncate text-[11px] leading-tight text-stone-600 dark:text-stone-300">
            {label}
          </p>
        ))}
        {extra > 0 && <p className="text-[11px] leading-tight text-stone-400">+{extra} more</p>}
      </button>

      {hasEntries && (
        <div className="mt-1 border-t border-stone-100 pt-1 dark:border-stone-800">
          <p className="text-xs font-semibold text-stone-700 dark:text-stone-200">{m.calories} kcal</p>
          <p className="text-[10px] font-medium">
            <span className="text-blue-600 dark:text-blue-400">P{m.protein}</span>{' '}
            <span className="text-amber-600 dark:text-amber-400">C{m.carbs}</span>{' '}
            <span className="text-rose-600 dark:text-rose-400">F{m.fat}</span>
          </p>
        </div>
      )}
    </div>
  );
}
