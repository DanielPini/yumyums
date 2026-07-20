import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Plus, Search, Star, Trash2 } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import Modal from '../components/Modal';

function pluralize(count: number, noun: string): string {
  return `${count} ${noun}${count === 1 ? '' : 's'}`;
}

export default function CuisinesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') ?? '';
  const [newName, setNewName] = useState('');
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const navigate = useNavigate();

  const cuisines = useAppStore((s) => s.cuisines);
  const meals = useAppStore((s) => s.meals);
  const foods = useAppStore((s) => s.foods);
  const addCuisine = useAppStore((s) => s.addCuisine);
  const deleteCuisine = useAppStore((s) => s.deleteCuisine);
  const toggleCuisineFavourite = useAppStore((s) => s.toggleCuisineFavourite);

  const mealCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const m of meals) {
      if (m.cuisineId) counts.set(m.cuisineId, (counts.get(m.cuisineId) ?? 0) + 1);
    }
    return counts;
  }, [meals]);

  const foodCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const f of foods) {
      for (const cid of f.cuisineIds) counts.set(cid, (counts.get(cid) ?? 0) + 1);
    }
    return counts;
  }, [foods]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return cuisines
      .filter((c) => (q ? c.name.toLowerCase().includes(q) : true))
      .sort((a, b) => Number(b.favourite) - Number(a.favourite) || a.name.localeCompare(b.name));
  }, [cuisines, query]);

  function handleAddCuisine(e: React.FormEvent) {
    e.preventDefault();
    const name = newName.trim();
    if (!name) return;
    addCuisine(name);
    setNewName('');
  }

  const deleteTarget = cuisines.find((c) => c.id === deleteTargetId) ?? null;

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div>
        <h1 className="text-xl font-semibold">Cuisines</h1>
        <p className="text-sm text-stone-500">Organise foods and meals by cuisine, and star your favourites</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            value={query}
            onChange={(e) => setSearchParams(e.target.value ? { q: e.target.value } : {})}
            placeholder="Search cuisines…"
            className="w-full rounded-md border border-stone-200 bg-white py-1.5 pl-8 pr-3 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100 dark:border-stone-700 dark:bg-stone-900"
          />
        </div>
        <form onSubmit={handleAddCuisine} className="flex gap-2">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="New cuisine name"
            className="rounded-md border border-stone-200 bg-white px-3 py-1.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100 dark:border-stone-700 dark:bg-stone-900"
          />
          <button type="submit" className="flex items-center gap-1.5 rounded-md bg-brand-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-700">
            <Plus size={16} /> Add
          </button>
        </form>
      </div>

      <div className="grid gap-2.5 sm:grid-cols-2">
        {filtered.map((cuisine) => (
          <div
            key={cuisine.id}
            className="group flex items-center justify-between gap-3 rounded-lg border border-stone-200 bg-white p-3.5 dark:border-stone-800 dark:bg-stone-900"
          >
            <button
              className="min-w-0 flex-1 text-left"
              onClick={() => navigate(`/meals?q=${encodeURIComponent('')}&cuisine=${cuisine.id}`)}
            >
              <p className="truncate font-medium">{cuisine.name}</p>
              <p className="text-xs text-stone-500">
                {pluralize(mealCounts.get(cuisine.id) ?? 0, 'meal')} · {pluralize(foodCounts.get(cuisine.id) ?? 0, 'food')}
              </p>
            </button>
            <div className="flex shrink-0 items-center gap-1">
              <button
                onClick={() => toggleCuisineFavourite(cuisine.id)}
                className={`rounded p-1 ${cuisine.favourite ? 'text-amber-500' : 'text-stone-300 hover:text-amber-400'}`}
                aria-label={cuisine.favourite ? 'Unfavourite' : 'Favourite'}
              >
                <Star size={16} fill={cuisine.favourite ? 'currentColor' : 'none'} />
              </button>
              <button
                onClick={() => setDeleteTargetId(cuisine.id)}
                className="rounded p-1 text-stone-400 opacity-0 hover:bg-rose-50 hover:text-rose-600 group-hover:opacity-100 dark:hover:bg-rose-950"
                aria-label={`Delete ${cuisine.name}`}
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="col-span-2 py-10 text-center text-sm text-stone-400">No cuisines match your search.</p>
        )}
      </div>

      {deleteTarget && (
        <Modal title="Delete cuisine" onClose={() => setDeleteTargetId(null)}>
          <p className="text-sm text-stone-600 dark:text-stone-300">
            Delete <strong>{deleteTarget.name}</strong>? Foods and meals tagged with it will just lose the tag.
          </p>
          <div className="mt-4 flex justify-end gap-2">
            <button onClick={() => setDeleteTargetId(null)} className="rounded-md px-3 py-1.5 text-sm font-medium text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800">
              Cancel
            </button>
            <button
              onClick={() => {
                deleteCuisine(deleteTarget.id);
                setDeleteTargetId(null);
              }}
              className="rounded-md bg-rose-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-rose-700"
            >
              Delete
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
