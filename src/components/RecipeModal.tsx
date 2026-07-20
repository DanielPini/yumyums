import type { Food, Meal } from '../types';
import { describeAmount } from '../utils/logEntry';
import Modal from './Modal';

export default function RecipeModal({ meal, foodsById, onClose }: { meal: Meal; foodsById: Map<string, Food>; onClose: () => void }) {
  return (
    <Modal title={meal.name} onClose={onClose}>
      <div className="space-y-4">
        <div>
          <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-stone-400">Ingredients</h3>
          <ul className="space-y-1">
            {meal.ingredients.map((ing, i) => {
              const food = foodsById.get(ing.foodId);
              return (
                <li key={i} className="flex justify-between text-sm">
                  <span>{food?.name ?? 'Unknown food'}</span>
                  <span className="text-stone-400">{describeAmount(food, ing.amount)}</span>
                </li>
              );
            })}
          </ul>
        </div>

        {meal.recipeSteps && meal.recipeSteps.length > 0 ? (
          <div>
            <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-stone-400">Method</h3>
            <ol className="space-y-2">
              {meal.recipeSteps.map((step, i) => (
                <li key={i} className="flex gap-2.5 text-sm">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700 dark:bg-brand-900/50 dark:text-brand-200">
                    {i + 1}
                  </span>
                  <span className="pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        ) : (
          <p className="text-sm text-stone-400">No recipe steps added yet.</p>
        )}

        {meal.notes && (
          <div>
            <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-stone-400">Notes</h3>
            <p className="text-sm text-stone-600 dark:text-stone-300">{meal.notes}</p>
          </div>
        )}
      </div>
    </Modal>
  );
}
