export type DietType = 'vegetarian' | 'vegan' | 'eggetarian';

export type FoodCategory =
  | 'Grain'
  | 'Vegetable'
  | 'Fruit'
  | 'Legume'
  | 'Dairy'
  | 'Nuts & Seeds'
  | 'Protein'
  | 'Fat & Oil'
  | 'Spice & Condiment'
  | 'Beverage'
  | 'Other';

export type Unit = 'g' | 'ml' | 'piece';

/** Macro + calorie values, always expressed per 100 units (100g or 100ml), or per piece when unit is 'piece'. */
export interface Macros {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Food {
  id: string;
  name: string;
  category: FoodCategory;
  dietType: DietType;
  unit: Unit;
  /** Macros per 100 units (100g/100ml), or per single piece if unit === 'piece'. */
  macrosPer: Macros;
  cuisineIds: string[];
  notes?: string;
  createdAt: number;
}

export interface MealIngredient {
  foodId: string;
  quantity: number;
}

export interface Meal {
  id: string;
  name: string;
  cuisineId: string | null;
  favourite: boolean;
  ingredients: MealIngredient[];
  notes?: string;
  createdAt: number;
}

export interface Cuisine {
  id: string;
  name: string;
  favourite: boolean;
}

export type MealType = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';

export interface LogEntry {
  id: string;
  date: string; // yyyy-mm-dd
  mealType: MealType;
  /** Either a food logged directly (quantity in food's unit) or a meal logged as a number of servings. */
  source:
    | { type: 'food'; foodId: string; quantity: number }
    | { type: 'meal'; mealId: string; servings: number };
  createdAt: number;
}

export interface MacroTargets {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}
