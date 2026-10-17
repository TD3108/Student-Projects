/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { IngredientItem, HouseFavorite, ScaledIngredientResult } from './types';
import { INDIAN_15MIN_FAVORITES, QUICK_RECIPE_PRESETS } from './data/houseFavorites';
import { validateServings, calculateScaledIngredients } from './utils/calculator';
import { Header } from './components/Header';
import { MenuCard } from './components/MenuCard';
import { HouseFavorites } from './components/HouseFavorites';
import { CulinaryGuide } from './components/CulinaryGuide';
import { Clock, RotateCcw } from 'lucide-react';

const STORAGE_KEY = 'home_cook_indian_recipe_rescaler_v3';

const INITIAL_DEFAULT_STATE = {
  dishName: "Spiced Cottage Cheese Scramble (Paneer Bhurji)",
  recipeMakes: "2",
  servingsWanted: "4",
  ingredients: [
    { id: '1', name: "Fresh Crumbled Cottage Cheese (Paneer)", amount: "250", unit: "g" },
    { id: '2', name: "Diced Red Onions & Tomatoes", amount: "180", unit: "g" },
    { id: '3', name: "Clarified Butter (Ghee) or Cooking Oil", amount: "2", unit: "tbsp" }
  ] as [IngredientItem, IngredientItem, IngredientItem],
  hasCalculated: true
};

export default function App() {
  // Initialize state from LocalStorage if available
  const [dishName, setDishName] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.dishName === 'string') return parsed.dishName;
      }
    } catch {
      // Ignore
    }
    return INITIAL_DEFAULT_STATE.dishName;
  });

  const [recipeMakes, setRecipeMakes] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.recipeMakes !== 'undefined') return String(parsed.recipeMakes);
      }
    } catch {
      // Ignore
    }
    return INITIAL_DEFAULT_STATE.recipeMakes;
  });

  const [servingsWanted, setServingsWanted] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.servingsWanted !== 'undefined') return String(parsed.servingsWanted);
      }
    } catch {
      // Ignore
    }
    return INITIAL_DEFAULT_STATE.servingsWanted;
  });

  const [ingredients, setIngredients] = useState<[IngredientItem, IngredientItem, IngredientItem]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.ingredients) && parsed.ingredients.length === 3) {
          return parsed.ingredients as [IngredientItem, IngredientItem, IngredientItem];
        }
      }
    } catch {
      // Ignore
    }
    return INITIAL_DEFAULT_STATE.ingredients;
  });

  const [hasCalculated, setHasCalculated] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.hasCalculated === 'boolean') return parsed.hasCalculated;
      }
    } catch {
      // Ignore
    }
    return INITIAL_DEFAULT_STATE.hasCalculated;
  });

  const [validationError, setValidationError] = useState<string | null>(null);
  const [ingredientErrors, setIngredientErrors] = useState<string[]>([]);
  const [scaledResults, setScaledResults] = useState<ScaledIngredientResult[] | null>(null);

  // Synchronize state changes to localStorage
  useEffect(() => {
    try {
      const stateToPersist = {
        dishName,
        recipeMakes,
        servingsWanted,
        ingredients,
        hasCalculated
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToPersist));
    } catch {
      // Handle private browsing
    }
  }, [dishName, recipeMakes, servingsWanted, ingredients, hasCalculated]);

  // Run calculation logic
  const performCalculation = useCallback(() => {
    // Core requirement: "Show a message, and no result, if either servings number is empty, zero or negative."
    const validation = validateServings(recipeMakes, servingsWanted);

    if (!validation.isValid) {
      setValidationError(validation.errorMessage);
      setIngredientErrors([]);
      setScaledResults(null); // CRITICAL: NO RESULT SHOWN
      return;
    }

    setValidationError(null);
    const { results, ingredientErrors: ingErrors } = calculateScaledIngredients(
      ingredients,
      validation.parsedMakes!,
      validation.parsedWanted!
    );

    setIngredientErrors(ingErrors);

    if (ingErrors.length > 0) {
      setScaledResults(null);
    } else {
      setScaledResults(results);
    }
  }, [recipeMakes, servingsWanted, ingredients]);

  // When user clicks the Rescale button
  const handleRescaleClick = () => {
    setHasCalculated(true);
    performCalculation();
  };

  // Perform calculation on mount if hasCalculated was true
  useEffect(() => {
    if (hasCalculated) {
      performCalculation();
    }
  }, []);

  const handleSetIngredient = (index: number, field: keyof IngredientItem, val: string) => {
    setIngredients((prev) => {
      const updated = [...prev] as [IngredientItem, IngredientItem, IngredientItem];
      updated[index] = {
        ...updated[index],
        [field]: val
      };
      return updated;
    });
  };

  const handleLoadFavorite = (favorite: HouseFavorite) => {
    setDishName(favorite.dishName);
    setRecipeMakes(favorite.defaultServings.toString());
    if (!servingsWanted || Number(servingsWanted) <= 0) {
      setServingsWanted((favorite.defaultServings * 2).toString());
    }
    setIngredients([
      { ...favorite.ingredients[0] },
      { ...favorite.ingredients[1] },
      { ...favorite.ingredients[2] }
    ]);
    setHasCalculated(true);

    const el = document.getElementById('menu-rescaler');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }

    setTimeout(() => {
      const wantedVal = servingsWanted && Number(servingsWanted) > 0 ? servingsWanted : (favorite.defaultServings * 2).toString();
      const validation = validateServings(favorite.defaultServings.toString(), wantedVal);
      if (validation.isValid) {
        setValidationError(null);
        const { results } = calculateScaledIngredients(
          favorite.ingredients,
          validation.parsedMakes!,
          validation.parsedWanted!
        );
        setScaledResults(results);
      }
    }, 60);
  };

  const handleLoadPreset = (preset: typeof QUICK_RECIPE_PRESETS[0]) => {
    setDishName(preset.dishName);
    setRecipeMakes(preset.servings.toString());
    if (!servingsWanted || Number(servingsWanted) <= 0) {
      setServingsWanted((preset.servings * 2).toString());
    }
    setIngredients([
      { ...preset.ingredients[0] },
      { ...preset.ingredients[1] },
      { ...preset.ingredients[2] }
    ]);
    setHasCalculated(true);

    const el = document.getElementById('menu-rescaler');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }

    setTimeout(() => {
      const wantedVal = servingsWanted && Number(servingsWanted) > 0 ? servingsWanted : (preset.servings * 2).toString();
      const validation = validateServings(preset.servings.toString(), wantedVal);
      if (validation.isValid) {
        setValidationError(null);
        const { results } = calculateScaledIngredients(
          preset.ingredients as [IngredientItem, IngredientItem, IngredientItem],
          validation.parsedMakes!,
          validation.parsedWanted!
        );
        setScaledResults(results);
      }
    }, 60);
  };

  const handleResetForm = () => {
    setDishName('');
    setRecipeMakes('');
    setServingsWanted('');
    setIngredients([
      { id: '1', name: '', amount: '', unit: 'g' },
      { id: '2', name: '', amount: '', unit: 'g' },
      { id: '3', name: '', amount: '', unit: 'g' }
    ]);
    setHasCalculated(false);
    setValidationError(null);
    setIngredientErrors([]);
    setScaledResults(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#140f0c] text-[#f2e7d8] flex flex-col selection:bg-[#d97706]/30 selection:text-[#faedd9]">
      <Header onReset={handleResetForm} onPrint={handlePrint} />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-16">
        
        {/* Intro banner in pure English */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2a1d14] border border-[#54351d] text-xs font-semibold text-[#f59e0b]">
            <Clock className="w-3.5 h-3.5 text-[#f59e0b]" />
            <span>100% Indian Kitchen · Ready in Under 15 Minutes</span>
          </div>
          <h1 className="font-menu-title text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#fbf4eb] leading-[1.15]">
            The Indian Home Cook's Recipe Rescaler
          </h1>
          <p className="font-menu-serif text-lg sm:text-xl text-[#baa592] italic max-w-2xl mx-auto">
            Calibrate your three core ingredients in seconds for fast, flavorful Indian dinners, weekend breakfasts, and gatherings.
          </p>
        </div>

        {/* Centerpiece: The Menu Card Rescaler */}
        <MenuCard
          dishName={dishName}
          setDishName={setDishName}
          recipeMakes={recipeMakes}
          setRecipeMakes={setRecipeMakes}
          servingsWanted={servingsWanted}
          setServingsWanted={setServingsWanted}
          ingredients={ingredients}
          setIngredient={handleSetIngredient}
          onRescale={handleRescaleClick}
          validationError={validationError}
          ingredientErrors={ingredientErrors}
          scaledResults={scaledResults}
          hasCalculated={hasCalculated}
        />

        {/* House Indian Favorites (Under 15 Mins) */}
        <HouseFavorites
          onSelectFavorite={handleLoadFavorite}
          onSelectPreset={handleLoadPreset}
          currentDishName={dishName}
        />

        {/* 15-Minute Indian Cooking & Scaling Secrets */}
        <CulinaryGuide />

      </main>

      {/* Footer in pure English */}
      <footer className="border-t border-[#291c13] bg-[#110c09] py-8 text-center text-xs text-[#8c7865]">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-menu-title text-sm text-[#e6d6c2] font-semibold">The Indian Kitchen</span>
            <span>·</span>
            <span>15-Minute Home Cook Edition</span>
          </div>

          <div className="flex items-center gap-4 text-[#baa592]">
            <span>Formula: (Amount × Servings Wanted) ÷ Recipe Makes</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetForm}
              className="text-[#96816d] hover:text-[#f59e0b] transition-colors inline-flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              Reset All
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
