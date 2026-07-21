import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import type { Food, FoodCategory } from '../types';
import Modal from '../components/Modal';
import FoodForm, { type FoodFormValues } from '../components/FoodForm';
import MacroBadges from '../components/MacroBadges';

const dietColors: Record<Food['dietType'], string> = {
  vegan: 'bg-brand-100 text-brand-700 dark:bg-brand-900/50 dark:text-brand-200',
  vegetarian: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  eggetarian: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
};

export default function FoodsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') ?? '';
  const [categoryFilter, setCategoryFilter] = useState<FoodCategory | 'All'>('All');
  const [editing, setEditing] = useState<Food | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Food | null>(null);

  const foods = useAppStore((s) => s.foods);
  const addFood = useAppStore((s) => s.addFood);
  const updateFood = useAppStore((s) => s.updateFood);
  const deleteFood = useAppStore((s) => s.deleteFood);
  const cuisines = useAppStore((s) => s.cuisines);
  const cuisineById = useMemo(() => new Map(cuisines.map((c) => [c.id, c])), [cuisines]);

  const categories = useMemo(
    () => Array.from(new Set(foods.map((f) => f.category))).sort(),
    [foods]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return foods
      .filter((f) => (categoryFilter === 'All' ? true : f.category === categoryFilter))
      .filter((f) => (q ? f.name.toLowerCase().includes(q) : true))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [foods, query, categoryFilter]);

  function handleAdd(values: FoodFormValues) {
    addFood(values);
    setShowAdd(false);
  }

  function handleEdit(values: FoodFormValues) {
    if (!editing) return;
    updateFood(editing.id, values);
    setEditing(null);
  }

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Foods</h1>
          <p className="text-sm text-muted">{foods.length} foods in your pantry</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-1.5 rounded-md bg-brand-600 px-3 py-2 text-sm font-medium text-white hover:bg-brand-700"
        >
          <Plus size={16} /> Add food
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-subtle" />
          <input
            value={query}
            onChange={(e) => setSearchParams(e.target.value ? { q: e.target.value } : {})}
            placeholder="Search foods…"
            className="w-full rounded-md border border-border bg-surface py-1.5 pl-8 pr-3 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value as FoodCategory | 'All')}
          className="rounded-md border border-border bg-surface px-2.5 py-1.5 text-sm"
        >
          <option value="All">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-2.5 sm:grid-cols-2">
        {filtered.map((food) => (
          <div
            key={food.id}
            className="group rounded-lg border border-border bg-surface p-3.5"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate font-medium">{food.name}</p>
                <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs text-muted">
                  <span>{food.category}</span>
                  <span className={`rounded px-1.5 py-0.5 font-medium ${dietColors[food.dietType]}`}>
                    {food.dietType}
                  </span>
                  <span>· per 100{food.baseUnit}</span>
                  {food.pieceSize && (
                    <span>
                      · {food.pieceLabel ?? '1 piece'} ≈ {food.pieceSize}
                      {food.baseUnit}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  onClick={() => setEditing(food)}
                  className="rounded p-1 text-subtle hover:bg-stone-100 hover:text-stone-700 dark:hover:bg-stone-800"
                  aria-label={`Edit ${food.name}`}
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => setDeleteTarget(food)}
                  className="rounded p-1 text-subtle hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950"
                  aria-label={`Delete ${food.name}`}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2">
              <MacroBadges macros={food.macrosPer100} />
              {food.cuisineIds.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {food.cuisineIds.map((id) => (
                    <span key={id} className="rounded-full bg-surface-muted px-2 py-0.5 text-[11px] text-muted">
                      {cuisineById.get(id)?.name ?? 'Unknown'}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="col-span-2 py-10 text-center text-sm text-subtle">No foods match your search.</p>
        )}
      </div>

      {showAdd && (
        <Modal title="Add food" onClose={() => setShowAdd(false)}>
          <FoodForm onSubmit={handleAdd} onCancel={() => setShowAdd(false)} />
        </Modal>
      )}
      {editing && (
        <Modal title={`Edit ${editing.name}`} onClose={() => setEditing(null)}>
          <FoodForm initial={editing} onSubmit={handleEdit} onCancel={() => setEditing(null)} />
        </Modal>
      )}
      {deleteTarget && (
        <Modal title="Delete food" onClose={() => setDeleteTarget(null)}>
          <p className="text-sm text-stone-600 dark:text-stone-300">
            Delete <strong>{deleteTarget.name}</strong>? It will also be removed from any meals and logs that use it.
          </p>
          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={() => setDeleteTarget(null)}
              className="rounded-md px-3 py-1.5 text-sm font-medium text-muted hover:bg-stone-100 dark:hover:bg-stone-800"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                deleteFood(deleteTarget.id);
                setDeleteTarget(null);
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
