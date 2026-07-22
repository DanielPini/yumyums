export type DietType = 'vegetarian' | 'vegan' | 'eggetarian';

export type FoodCategory =
  | 'Grain'
  | 'Vegetable'
  | 'Fruit'
  | 'Legume'
  | 'Dairy'
  | 'Eggs'
  | 'Nuts & Seeds'
  | 'Protein'
  | 'Sweets & Desserts'
  | 'Fat & Oil'
  | 'Spice & Condiment'
  | 'Beverage'
  | 'Other';

/** The unit macros are expressed against: grams or millilitres. */
export type BaseUnit = 'g' | 'ml';

/** Macro + calorie values, always expressed per 100 base units (100g or 100ml). */
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
  baseUnit: BaseUnit;
  /** Macros per 100 base units (100g or 100ml) — every food supports by-weight logging. */
  macrosPer100: Macros;
  /** Realistic default quantity (in baseUnit) to pre-fill when logging this food by weight, e.g. 10g for butter vs 200ml for milk. Falls back to 100 if unset. */
  defaultServing?: number;
  /** Weight/volume (in baseUnit) of one typical piece, e.g. 1 egg = 50g. Enables by-item logging alongside by-weight. */
  pieceSize?: number;
  /** Label for the piece unit, e.g. "1 egg", "1 slice". Defaults to "1 piece" when pieceSize is set. */
  pieceLabel?: string;
  /** Which mode to pre-fill when logging this food (only relevant when pieceSize is set). Defaults to 'weight'. */
  defaultMode?: 'weight' | 'piece';
  cuisineIds: string[];
  notes?: string;
  createdAt: number;
}

/** A quantity of a food, either by weight/volume (in the food's baseUnit) or by piece count. */
export type FoodAmount =
  | { mode: 'weight'; quantity: number }
  | { mode: 'piece'; quantity: number };

export interface MealIngredient {
  foodId: string;
  amount: FoodAmount;
}

export interface Meal {
  id: string;
  name: string;
  cuisineId: string | null;
  favourite: boolean;
  ingredients: MealIngredient[];
  notes?: string;
  /** Step-by-step cooking instructions. */
  recipeSteps?: string[];
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
  /** Either a food logged directly (by weight or by piece) or a meal logged as a number of servings. */
  source:
    | { type: 'food'; foodId: string; amount: FoodAmount }
    | { type: 'meal'; mealId: string; servings: number };
  createdAt: number;
}

export interface MacroTargets {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}
