import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Search, Pencil, Trash2, Star, BookOpen } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import type { Meal } from '../types';
import Modal from '../components/Modal';
import MealForm, { type MealFormValues } from '../components/MealForm';
import MacroBadges from '../components/MacroBadges';
import RecipeModal from '../components/RecipeModal';
import { mealMacrosPerServing } from '../utils/macros';

export default function MealsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') ?? '';
  const [cuisineFilter, setCuisineFilter] = useState<string>(searchParams.get('cuisine') ?? 'All');
  const [favouritesOnly, setFavouritesOnly] = useState(false);
  const [editing, setEditing] = useState<Meal | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Meal | null>(null);
  const [recipeTarget, setRecipeTarget] = useState<Meal | null>(null);

  const meals = useAppStore((s) => s.meals);
  const foods = useAppStore((s) => s.foods);
  const cuisines = useAppStore((s) => s.cuisines);
  const addMeal = useAppStore((s) => s.addMeal);
  const updateMeal = useAppStore((s) => s.updateMeal);
  const deleteMeal = useAppStore((s) => s.deleteMeal);
  const toggleMealFavourite = useAppStore((s) => s.toggleMealFavourite);

  const foodsById = useMemo(() => new Map(foods.map((f) => [f.id, f])), [foods]);
  const cuisineById = useMemo(() => new Map(cuisines.map((c) => [c.id, c])), [cuisines]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return meals
      .filter((m) => (cuisineFilter === 'All' ? true : m.cuisineId === cuisineFilter))
      .filter((m) => (favouritesOnly ? m.favourite : true))
      .filter((m) => (q ? m.name.toLowerCase().includes(q) : true))
      .sort((a, b) => Number(b.favourite) - Number(a.favourite) || a.name.localeCompare(b.name));
  }, [meals, query, cuisineFilter, favouritesOnly]);

  function handleAdd(values: MealFormValues) {
    addMeal(values);
    setShowAdd(false);
  }
  function handleEdit(values: MealFormValues) {
    if (!editing) return;
    updateMeal(editing.id, values);
    setEditing(null);
  }

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Meals</h1>
          <p className="text-sm text-muted">{meals.length} saved meals</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-1.5 rounded-md bg-brand-600 px-3 py-2 text-sm font-medium text-white hover:bg-brand-700"
          disabled={foods.length === 0}
          title={foods.length === 0 ? 'Add some foods first' : undefined}
        >
          <Plus size={16} /> Add meal
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-subtle" />
          <input
            value={query}
            onChange={(e) => setSearchParams(e.target.value ? { q: e.target.value } : {})}
            placeholder="Search meals…"
            className="w-full rounded-md border border-border bg-surface py-1.5 pl-8 pr-3 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
        </div>
        <select
          value={cuisineFilter}
          onChange={(e) => setCuisineFilter(e.target.value)}
          className="rounded-md border border-border bg-surface px-2.5 py-1.5 text-sm"
        >
          <option value="All">All cuisines</option>
          {cuisines.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <button
          onClick={() => setFavouritesOnly((v) => !v)}
          className={`flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-sm font-medium ${
            favouritesOnly
              ? 'border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-300'
              : 'border-border text-muted'
          }`}
        >
          <Star size={14} fill={favouritesOnly ? 'currentColor' : 'none'} /> Favourites
        </button>
      </div>

      <div className="grid gap-2.5 sm:grid-cols-2">
        {filtered.map((meal) => (
          <div key={meal.id} className="group rounded-lg border border-border bg-surface p-3.5">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate font-medium">{meal.name}</p>
                <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs text-muted">
                  {meal.cuisineId && cuisineById.get(meal.cuisineId) && (
                    <span className="rounded-full bg-surface-muted px-2 py-0.5 text-[11px]">
                      {cuisineById.get(meal.cuisineId)!.name}
                    </span>
                  )}
                  <span>{meal.ingredients.length} ingredients</span>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  onClick={() => toggleMealFavourite(meal.id)}
                  className={`rounded p-1 ${meal.favourite ? 'text-amber-500' : 'text-stone-300 hover:text-amber-400'}`}
                  aria-label={meal.favourite ? 'Unfavourite' : 'Favourite'}
                >
                  <Star size={16} fill={meal.favourite ? 'currentColor' : 'none'} />
                </button>
                <button
                  onClick={() => setRecipeTarget(meal)}
                  className="rounded p-1 text-subtle hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-900/40"
                  aria-label={`View recipe for ${meal.name}`}
                  title="View recipe"
                >
                  <BookOpen size={16} />
                </button>
                <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() => setEditing(meal)}
                    className="rounded p-1 text-subtle hover:bg-stone-100 hover:text-stone-700 dark:hover:bg-stone-800"
                    aria-label={`Edit ${meal.name}`}
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(meal)}
                    className="rounded p-1 text-subtle hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950"
                    aria-label={`Delete ${meal.name}`}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-2.5">
              <MacroBadges macros={mealMacrosPerServing(meal, foodsById)} />
            </div>
            {meal.notes && <p className="mt-2 text-xs text-muted">{meal.notes}</p>}
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="col-span-2 py-10 text-center text-sm text-subtle">No meals match your filters.</p>
        )}
      </div>

      {showAdd && (
        <Modal title="Add meal" onClose={() => setShowAdd(false)}>
          <MealForm onSubmit={handleAdd} onCancel={() => setShowAdd(false)} />
        </Modal>
      )}
      {editing && (
        <Modal title={`Edit ${editing.name}`} onClose={() => setEditing(null)}>
          <MealForm initial={editing} onSubmit={handleEdit} onCancel={() => setEditing(null)} />
        </Modal>
      )}
      {deleteTarget && (
        <Modal title="Delete meal" onClose={() => setDeleteTarget(null)}>
          <p className="text-sm text-stone-600 dark:text-stone-300">
            Delete <strong>{deleteTarget.name}</strong>? It will also be removed from any logged days.
          </p>
          <div className="mt-4 flex justify-end gap-2">
            <button onClick={() => setDeleteTarget(null)} className="rounded-md px-3 py-1.5 text-sm font-medium text-muted hover:bg-stone-100 dark:hover:bg-stone-800">
              Cancel
            </button>
            <button
              onClick={() => {
                deleteMeal(deleteTarget.id);
                setDeleteTarget(null);
              }}
              className="rounded-md bg-rose-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-rose-700"
            >
              Delete
            </button>
          </div>
        </Modal>
      )}
      {recipeTarget && (
        <RecipeModal meal={recipeTarget} foodsById={foodsById} onClose={() => setRecipeTarget(null)} />
      )}
    </div>
  );
}
