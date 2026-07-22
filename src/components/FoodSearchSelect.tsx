import { useEffect, useMemo, useRef, useState } from 'react';
import type { Food } from '../types';

const inputClass =
  'w-full rounded-md border border-border bg-surface px-3 py-1.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100';

/** Type-to-filter food picker, replacing a plain <select> so long food lists stay usable. */
export default function FoodSearchSelect({
  foods,
  value,
  onChange,
  className = '',
  autoFocus = false,
}: {
  foods: Food[];
  value: string;
  onChange: (foodId: string) => void;
  className?: string;
  autoFocus?: boolean;
}) {
  const selectedFood = foods.find((f) => f.id === value);
  const [query, setQuery] = useState(selectedFood?.name ?? '');
  const [open, setOpen] = useState(autoFocus);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(selectedFood?.name ?? '');
  }, [selectedFood?.name]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery(selectedFood?.name ?? '');
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [selectedFood]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const pool = q ? foods.filter((f) => f.name.toLowerCase().includes(q)) : foods;
    return pool.slice(0, 30);
  }, [foods, query]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <input
        type="text"
        autoFocus={autoFocus}
        className={inputClass}
        value={query}
        placeholder="Search foods…"
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={(e) => {
          setOpen(true);
          e.target.select();
        }}
      />
      {open && (
        <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-lg border border-border bg-surface shadow-lg">
          {results.length === 0 ? (
            <p className="px-3 py-3 text-sm text-muted">No foods match "{query}"</p>
          ) : (
            <ul className="max-h-60 overflow-y-auto py-1">
              {results.map((f) => (
                <li key={f.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(f.id);
                      setQuery(f.name);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center justify-between gap-2 px-3 py-1.5 text-left text-sm hover:bg-brand-50 dark:hover:bg-stone-800 ${
                      f.id === value ? 'bg-brand-50 dark:bg-stone-800' : ''
                    }`}
                  >
                    <span className="truncate">{f.name}</span>
                    <span className="shrink-0 text-xs text-subtle">{f.category}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
