import type { Macros } from '../types';
import { roundMacros } from '../utils/macros';

export default function MacroBadges({ macros, compact = false }: { macros: Macros; compact?: boolean }) {
  const m = roundMacros(macros);
  const items: { label: string; value: string; className: string }[] = [
    { label: 'kcal', value: `${m.calories}`, className: 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-200' },
    { label: 'P', value: `${m.protein}g`, className: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300' },
    { label: 'C', value: `${m.carbs}g`, className: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300' },
    { label: 'F', value: `${m.fat}g`, className: 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300' },
  ];
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((it) => (
        <span
          key={it.label}
          className={`rounded-md px-1.5 py-0.5 text-xs font-medium ${it.className} ${compact ? '' : ''}`}
        >
          {it.label !== 'kcal' && <span className="opacity-70">{it.label} </span>}
          {it.value}
        </span>
      ))}
    </div>
  );
}
