import { useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import { useShoppingListStore } from '../store/useShoppingListStore';
import { getUpcomingShoppingFoodIds } from '../utils/shoppingList';
import { todayStr } from '../utils/date';

/** Deduplicated checklist of ingredients needed for everything logged today or later. Shared by the desktop sidebar panel and the mobile modal. */
export default function ShoppingList() {
  const log = useAppStore((s) => s.log);
  const meals = useAppStore((s) => s.meals);
  const foods = useAppStore((s) => s.foods);
  const checkedFoodIds = useShoppingListStore((s) => s.checkedFoodIds);
  const toggleChecked = useShoppingListStore((s) => s.toggleChecked);

  const items = useMemo(() => {
    const foodsById = new Map(foods.map((f) => [f.id, f]));
    const ids = getUpcomingShoppingFoodIds(log, meals, todayStr());
    return ids
      .map((id) => foodsById.get(id))
      .filter((f): f is NonNullable<typeof f> => !!f)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [log, meals, foods]);

  if (items.length === 0) {
    return <p className="text-sm text-subtle">Nothing planned yet — foods you log for today or later show up here.</p>;
  }

  return (
    <ul className="space-y-0.5">
      {items.map((food) => {
        const checked = !!checkedFoodIds[food.id];
        return (
          <li key={food.id}>
            <label className="flex cursor-pointer items-center gap-2 rounded-md px-1.5 py-1 text-sm hover:bg-stone-100 dark:hover:bg-stone-800">
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggleChecked(food.id)}
                className="h-4 w-4 shrink-0 rounded accent-brand-600"
              />
              <span className={`truncate ${checked ? 'text-stone-300 dark:text-stone-600' : ''}`}>{food.name}</span>
            </label>
          </li>
        );
      })}
    </ul>
  );
}
