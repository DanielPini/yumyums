import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Salad, UtensilsCrossed, Globe2 } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

interface Result {
  id: string;
  label: string;
  sublabel: string;
  icon: React.ReactNode;
  onSelect: () => void;
}

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  const foods = useAppStore((s) => s.foods);
  const meals = useAppStore((s) => s.meals);
  const cuisines = useAppStore((s) => s.cuisines);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const results = useMemo<Result[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const foodResults: Result[] = foods
      .filter((f) => f.name.toLowerCase().includes(q) || f.category.toLowerCase().includes(q))
      .slice(0, 5)
      .map((f) => ({
        id: `food-${f.id}`,
        label: f.name,
        sublabel: `Food · ${f.category}`,
        icon: <Salad size={16} className="text-brand-500" />,
        onSelect: () => navigate(`/foods?q=${encodeURIComponent(f.name)}`),
      }));

    const mealResults: Result[] = meals
      .filter((m) => m.name.toLowerCase().includes(q))
      .slice(0, 5)
      .map((m) => ({
        id: `meal-${m.id}`,
        label: m.name,
        sublabel: 'Meal',
        icon: <UtensilsCrossed size={16} className="text-brand-500" />,
        onSelect: () => navigate(`/meals?q=${encodeURIComponent(m.name)}`),
      }));

    const cuisineResults: Result[] = cuisines
      .filter((c) => c.name.toLowerCase().includes(q))
      .slice(0, 5)
      .map((c) => ({
        id: `cuisine-${c.id}`,
        label: c.name,
        sublabel: 'Cuisine',
        icon: <Globe2 size={16} className="text-brand-500" />,
        onSelect: () => navigate(`/cuisines?q=${encodeURIComponent(c.name)}`),
      }));

    return [...foodResults, ...mealResults, ...cuisineResults];
  }, [query, foods, meals, cuisines, navigate]);

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search foods, meals, cuisines…"
          className="w-full rounded-lg border border-stone-200 bg-white py-2 pl-9 pr-3 text-sm text-stone-900 placeholder:text-stone-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:placeholder:text-stone-500"
        />
      </div>
      {open && query && (
        <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-lg border border-stone-200 bg-white shadow-lg dark:border-stone-700 dark:bg-stone-900">
          {results.length === 0 ? (
            <p className="px-3 py-3 text-sm text-stone-500">No matches for "{query}"</p>
          ) : (
            <ul className="max-h-80 overflow-y-auto py-1">
              {results.map((r) => (
                <li key={r.id}>
                  <button
                    type="button"
                    onClick={() => {
                      r.onSelect();
                      setOpen(false);
                      setQuery('');
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-brand-50 dark:hover:bg-stone-800"
                  >
                    {r.icon}
                    <span className="flex-1 truncate">{r.label}</span>
                    <span className="text-xs text-stone-400">{r.sublabel}</span>
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
