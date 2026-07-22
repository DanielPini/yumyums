import { useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import { useShoppingListStore } from '../store/useShoppingListStore';
import { formatShoppingAmount, getUpcomingShoppingAmounts, type ShoppingAmount } from '../utils/shoppingList';
import { todayStr } from '../utils/date';
import type { Food } from '../types';

/** Deduplicated checklist of ingredients needed for everything logged today or later. Shared by the desktop sidebar panel and the mobile modal. */
export default function ShoppingList() {
  const log = useAppStore((s) => s.log);
  const meals = useAppStore((s) => s.meals);
  const foods = useAppStore((s) => s.foods);
  const checkedFoodIds = useShoppingListStore((s) => s.checkedFoodIds);
  const toggleChecked = useShoppingListStore((s) => s.toggleChecked);

  const items = useMemo(() => {
    const foodsById = new Map(foods.map((f) => [f.id, f]));
    const amounts = getUpcomingShoppingAmounts(log, meals, todayStr());
    return [...amounts.entries()]
      .map(([foodId, amount]) => {
        const food = foodsById.get(foodId);
        return food ? { food, amount } : null;
      })
      .filter((item): item is { food: Food; amount: ShoppingAmount } => !!item)
      .sort((a, b) => a.food.name.localeCompare(b.food.name));
  }, [log, meals, foods]);

  if (items.length === 0) {
    return <p className="text-sm text-subtle">Nothing planned yet — foods you log for today or later show up here.</p>;
  }

  return (
    <ul className="space-y-0.5">
      {items.map(({ food, amount }) => {
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
              <span className={`ml-auto shrink-0 text-xs ${checked ? 'text-stone-300 dark:text-stone-600' : 'text-subtle'}`}>
                {formatShoppingAmount(food, amount)}
              </span>
            </label>
          </li>
        );
      })}
    </ul>
  );
}
