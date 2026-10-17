export interface IngredientItem {
  id: string;
  name: string;
  amount: string; // string input to preserve user typing (e.g., "250", "2.5")
  unit: string;
}

export interface ScaledIngredientResult {
  name: string;
  originalAmount: number;
  newAmount: number;
  unit: string;
  fractionDisplay: string;
}

export interface HouseFavorite {
  id: string;
  dishName: string;
  subtitle: string;
  category: string;
  prepTime: string;
  defaultServings: number;
  imageUrl: string;
  ingredients: [IngredientItem, IngredientItem, IngredientItem];
  chefNotes: string;
}

export interface RecipeState {
  dishName: string;
  recipeMakes: string;
  servingsWanted: string;
  ingredients: [IngredientItem, IngredientItem, IngredientItem];
  hasCalculated: boolean;
}
