import { Plus } from 'lucide-react';
import type { Macros } from '../types';
import { roundMacros } from '../utils/macros';
import { dayLabel, dayNumber } from '../utils/week';

export default function WeekDayCard({
  date,
  isToday,
  entryLabels,
  totals,
  onAdd,
  onOpen,
}: {
  date: string;
  isToday: boolean;
  entryLabels: string[];
  totals: Macros;
  onAdd: () => void;
  onOpen: () => void;
}) {
  const m = roundMacros(totals);
  const hasEntries = entryLabels.length > 0;
  const maxShown = 6;
  const shown = entryLabels.slice(0, maxShown);
  const extra = entryLabels.length - shown.length;

  return (
    <div
      className={`flex min-h-[92px] flex-col rounded-lg border p-3 text-left ${
        isToday ? 'border-brand-400 bg-brand-50/50 dark:border-brand-600 dark:bg-brand-900/10' : 'border-border-strong bg-surface'
      }`}
    >
      <div className="flex items-center justify-between">
        <button onClick={onOpen} className="flex items-baseline gap-1.5 text-left">
          <span
            className={`text-sm font-semibold ${isToday ? 'text-brand-700 dark:text-brand-300' : 'text-stone-700 dark:text-stone-200'}`}
          >
            {dayLabel(date)}
          </span>
          <span className="text-xs text-subtle">{dayNumber(date)}</span>
        </button>
        <button
          onClick={onAdd}
          className="rounded p-1 text-subtle hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-900/40"
          aria-label="Add planned food"
        >
          <Plus size={16} />
        </button>
      </div>

      <button onClick={onOpen} className="mt-2 flex-1 space-y-1 text-left">
        {shown.length === 0 && <p className="text-sm text-subtle">Nothing logged yet.</p>}
        {shown.map((label, i) => (
          <p key={i} className="truncate text-sm text-stone-600 dark:text-stone-300">
            {label}
          </p>
        ))}
        {extra > 0 && <p className="text-sm text-subtle">+{extra} more</p>}
      </button>

      {hasEntries && (
        <div className="mt-2 border-t border-border pt-2">
          <p className="text-sm font-semibold text-stone-700 dark:text-stone-200">{m.calories} kcal</p>
          <p className="text-xs font-medium">
            <span className="text-blue-600 dark:text-blue-400">P{m.protein}</span>{' '}
            <span className="text-amber-600 dark:text-amber-400">C{m.carbs}</span>{' '}
            <span className="text-rose-600 dark:text-rose-400">F{m.fat}</span>
          </p>
        </div>
      )}
    </div>
  );
}
