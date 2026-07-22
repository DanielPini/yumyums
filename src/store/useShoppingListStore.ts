import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ShoppingListState {
  /** foodId -> checked-off state. Only entries currently relevant to the upcoming list are read; stale ids are harmless. */
  checkedFoodIds: Record<string, boolean>;
  toggleChecked: (foodId: string) => void;
}

export const useShoppingListStore = create<ShoppingListState>()(
  persist(
    (set) => ({
      checkedFoodIds: {},
      toggleChecked: (foodId) =>
        set((state) => ({
          checkedFoodIds: { ...state.checkedFoodIds, [foodId]: !state.checkedFoodIds[foodId] },
        })),
    }),
    { name: 'yumyums-shopping-list' }
  )
);
