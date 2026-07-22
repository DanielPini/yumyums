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
      className={`flex h-[140px] flex-col overflow-hidden rounded-lg border p-1.5 text-left sm:aspect-[6/5] sm:h-auto sm:p-[clamp(0.375rem,1.6cqw,0.875rem)] ${
        inCurrentMonth ? 'border-border-strong bg-surface' : 'border-border bg-surface-muted'
      }`}
    >
      <div className="flex shrink-0 items-center justify-between">
        <button
          onClick={onOpen}
          className={`flex aspect-square h-5 shrink-0 items-center justify-center rounded-full text-[11px] font-medium sm:h-7 sm:text-sm ${
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
          className="shrink-0 rounded p-0.5 text-subtle hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-900/40"
          aria-label="Add planned food"
        >
          <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
        </button>
      </div>

      <div className="mt-1 min-h-0 flex-1 overflow-y-auto">
        <button onClick={onOpen} className="w-full space-y-0.5 text-left">
          {shown.map((label, i) => (
            <p
              key={i}
              className="truncate text-[11px] leading-tight text-stone-600 sm:text-[clamp(0.6875rem,1.9cqw,0.9375rem)] dark:text-stone-300"
            >
              {label}
            </p>
          ))}
          {extra > 0 && (
            <p className="text-[11px] leading-tight text-subtle sm:text-[clamp(0.6875rem,1.9cqw,0.9375rem)]">+{extra} more</p>
          )}
        </button>

        {hasEntries && (
          <div className="mt-1 border-t border-border pt-1">
            <p className="text-xs font-semibold text-stone-700 sm:text-[clamp(0.75rem,2cqw,1rem)] dark:text-stone-200">
              {m.calories} kcal
            </p>
            <p className="text-[10px] font-medium sm:text-[clamp(0.625rem,1.65cqw,0.8125rem)]">
              <span className="text-blue-600 dark:text-blue-400">P{m.protein}</span>{' '}
              <span className="text-amber-600 dark:text-amber-400">C{m.carbs}</span>{' '}
              <span className="text-rose-600 dark:text-rose-400">F{m.fat}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
