import { IngredientItem, ScaledIngredientResult } from '../types';

export interface ValidationResult {
  isValid: boolean;
  errorMessage: string | null;
  parsedMakes?: number;
  parsedWanted?: number;
}

export function validateServings(recipeMakesStr: string, servingsWantedStr: string): ValidationResult {
  const trimmedMakes = recipeMakesStr.trim();
  const trimmedWanted = servingsWantedStr.trim();

  if (!trimmedMakes && !trimmedWanted) {
    return {
      isValid: false,
      errorMessage: 'Please enter both the original recipe servings and the servings you want to make.'
    };
  }

  if (!trimmedMakes) {
    return {
      isValid: false,
      errorMessage: 'Recipe servings is empty. Please enter how many servings the recipe originally makes.'
    };
  }

  const makesNum = Number(trimmedMakes);
  if (isNaN(makesNum)) {
    return {
      isValid: false,
      errorMessage: 'Recipe servings must be a valid number.'
    };
  }

  if (makesNum <= 0) {
    return {
      isValid: false,
      errorMessage: `Original recipe servings cannot be ${makesNum === 0 ? 'zero' : 'negative'} (${trimmedMakes}). It must be a positive number greater than 0.`
    };
  }

  if (!trimmedWanted) {
    return {
      isValid: false,
      errorMessage: 'Servings wanted is empty. Please specify how many servings you need for your table.'
    };
  }

  const wantedNum = Number(trimmedWanted);
  if (isNaN(wantedNum)) {
    return {
      isValid: false,
      errorMessage: 'Servings wanted must be a valid number.'
    };
  }

  if (wantedNum <= 0) {
    return {
      isValid: false,
      errorMessage: `Servings wanted cannot be ${wantedNum === 0 ? 'zero' : 'negative'} (${trimmedWanted}). It must be a positive number greater than 0.`
    };
  }

  return {
    isValid: true,
    errorMessage: null,
    parsedMakes: makesNum,
    parsedWanted: wantedNum
  };
}

/**
 * Converts decimal to a culinary fraction string (e.g. 1.5 -> "1 ½")
 */
export function formatFraction(val: number): string {
  if (Number.isInteger(val)) return `${val}`;

  const whole = Math.floor(val);
  const remainder = val - whole;

  const fractions: [number, string][] = [
    [0.125, '⅛'],
    [0.25, '¼'],
    [0.333, '⅓'],
    [0.375, '⅜'],
    [0.5, '½'],
    [0.625, '⅝'],
    [0.666, '⅔'],
    [0.75, '¾'],
    [0.875, '⅞'],
  ];

  for (const [fracVal, symbol] of fractions) {
    if (Math.abs(remainder - fracVal) < 0.04) {
      return whole > 0 ? `${whole} ${symbol}` : symbol;
    }
  }

  // Fallback to formatted decimal with up to 2 decimal places
  return (Math.round(val * 100) / 100).toString();
}

/**
 * Calculates new scaled amounts:
 * newAmount = (originalAmount * servingsWanted) / recipeMakes
 */
export function calculateScaledIngredients(
  ingredients: [IngredientItem, IngredientItem, IngredientItem],
  recipeMakes: number,
  servingsWanted: number
): { results: ScaledIngredientResult[]; ingredientErrors: string[] } {
  const results: ScaledIngredientResult[] = [];
  const ingredientErrors: string[] = [];

  ingredients.forEach((ing, index) => {
    const rawVal = ing.amount.trim();
    const parsedAmount = Number(rawVal);
    const ingName = ing.name.trim() || `Ingredient ${index + 1}`;

    if (!rawVal) {
      ingredientErrors.push(`Please enter the original amount for "${ingName}".`);
      return;
    }

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      ingredientErrors.push(`Amount for "${ingName}" must be a positive number greater than 0.`);
      return;
    }

    // Exact required formula: original amount * servings wanted / recipe makes
    const scaled = (parsedAmount * servingsWanted) / recipeMakes;
    const roundedScaled = Math.round(scaled * 100) / 100;

    results.push({
      name: ingName,
      originalAmount: parsedAmount,
      newAmount: roundedScaled,
      unit: ing.unit.trim(),
      fractionDisplay: formatFraction(scaled)
    });
  });

  return { results, ingredientErrors };
}
