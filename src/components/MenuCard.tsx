import React, { useState } from 'react';
import { IngredientItem, ScaledIngredientResult } from '../types';
import { Scale, Users, Utensils, Check, Copy, AlertTriangle, ArrowRight, Minus, Plus, Flame, Clock, Download, FileText, Code } from 'lucide-react';

interface MenuCardProps {
  dishName: string;
  setDishName: (val: string) => void;
  recipeMakes: string;
  setRecipeMakes: (val: string) => void;
  servingsWanted: string;
  setServingsWanted: (val: string) => void;
  ingredients: [IngredientItem, IngredientItem, IngredientItem];
  setIngredient: (index: number, field: keyof IngredientItem, val: string) => void;
  onRescale: () => void;
  validationError: string | null;
  ingredientErrors: string[];
  scaledResults: ScaledIngredientResult[] | null;
  hasCalculated: boolean;
}

const COMMON_UNITS = [
  'g',
  'kg',
  'cups',
  'tbsp',
  'tsp',
  'pieces',
  'pinches',
  'ml',
  'leaves',
  'cloves',
  'slices'
];

export const MenuCard: React.FC<MenuCardProps> = ({
  dishName,
  setDishName,
  recipeMakes,
  setRecipeMakes,
  servingsWanted,
  setServingsWanted,
  ingredients,
  setIngredient,
  onRescale,
  validationError,
  ingredientErrors,
  scaledResults,
  hasCalculated,
}) => {
  const [copied, setCopied] = useState(false);
  const [checkedIngredients, setCheckedIngredients] = useState<Record<number, boolean>>({});

  const toggleCheck = (index: number) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleAdjustServings = (type: 'makes' | 'wanted', delta: number) => {
    if (type === 'makes') {
      const current = parseFloat(recipeMakes) || 0;
      const next = Math.max(0, current + delta);
      setRecipeMakes(next > 0 ? next.toString() : '0');
    } else {
      const current = parseFloat(servingsWanted) || 0;
      const next = Math.max(0, current + delta);
      setServingsWanted(next > 0 ? next.toString() : '0');
    }
  };

  const handleMultiplierPreset = (multiplier: number) => {
    const base = parseFloat(recipeMakes);
    if (!isNaN(base) && base > 0) {
      const target = Math.round(base * multiplier * 10) / 10;
      setServingsWanted(target.toString());
    }
  };

  const handleCopyResults = () => {
    if (!scaledResults || scaledResults.length === 0) return;
    const text = [
      `Dish: ${dishName || 'Homestyle Indian Recipe'}`,
      `Table Covers: ${servingsWanted} people (Original recipe yield: ${recipeMakes} servings)`,
      '----------------------------------------',
      ...scaledResults.map(
        (r, i) =>
          `${i + 1}. ${r.name}: ${r.newAmount} ${r.unit} (${r.fractionDisplay}) [Original: ${r.originalAmount} ${r.unit}]`
      ),
      '----------------------------------------',
      'Ready in under 15 minutes'
    ].join('\n');

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleDownloadJSON = () => {
    const data = {
      dishName: dishName || 'Homestyle Indian Recipe',
      recipeMakes: Number(recipeMakes) || 0,
      servingsWanted: Number(servingsWanted) || 0,
      scaleFactor: multiplier ? Number(multiplier) : 1,
      scaledIngredients: scaledResults || [],
      originalIngredients: ingredients,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(dishName || 'indian-recipe').toLowerCase().replace(/\s+/g, '-')}-scaled.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadHTML = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${dishName || 'Indian Recipe'} - Scaled Menu Card</title>
  <style>
    body { font-family: Georgia, serif; background: #faf6ee; color: #2a2118; padding: 40px; margin: 0; }
    .card { max-width: 650px; margin: 0 auto; border: 2px solid #8c572b; padding: 30px; border-radius: 8px; background: #fffcf7; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
    h1 { font-size: 26px; text-align: center; margin-bottom: 4px; color: #1c130d; }
    p.meta { text-align: center; color: #7a5e42; font-style: italic; margin-top: 0; }
    .divider { border-top: 1px dashed #c4ae94; margin: 20px 0; }
    ul { list-style: none; padding: 0; }
    li { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #ebdcc9; }
    .amt { font-family: monospace; font-size: 18px; font-weight: bold; color: #b45309; }
    .orig { font-size: 12px; color: #8c7865; margin-top: 2px; }
  </style>
</head>
<body>
  <div class="card">
    <h1>${dishName || 'Homestyle Indian Recipe'}</h1>
    <p class="meta">Scaled for ${servingsWanted} people (from ${recipeMakes} servings · Multiplier: ${multiplier || '1.0'}x)</p>
    <div class="divider"></div>
    <h3>Three Key Scaled Ingredients (Under 15 Mins Prep):</h3>
    <ul>
      ${(scaledResults || []).map(r => `
        <li>
          <div>
            <strong>${r.name}</strong>
            <div class="orig">Original: ${r.originalAmount} ${r.unit}</div>
          </div>
          <div class="amt">${r.newAmount} ${r.unit}</div>
        </li>
      `).join('')}
    </ul>
    <div class="divider"></div>
    <p style="text-align:center; font-size: 11px; color: #8c7865;">Exported from The Indian Kitchen Recipe Rescaler</p>
  </div>
</body>
</html>`;
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(dishName || 'indian-recipe').toLowerCase().replace(/\s+/g, '-')}-scaled.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const parsedMakes = parseFloat(recipeMakes);
  const parsedWanted = parseFloat(servingsWanted);
  const multiplier = !isNaN(parsedMakes) && !isNaN(parsedWanted) && parsedMakes > 0
    ? (parsedWanted / parsedMakes).toFixed(2)
    : null;

  return (
    <div id="menu-rescaler" className="w-full max-w-4xl mx-auto scroll-mt-20">
      {/* Outer Card: Rich Spiced Walnut Surround */}
      <div className="bg-[#1e1712] p-3 sm:p-6 md:p-8 rounded-2xl shadow-2xl border border-[#3f2e20]">
        
        {/* Parchment Inner Card with Classic Double Border */}
        <div className="bg-parchment menu-double-border text-[#2a2118] p-5 sm:p-8 md:p-10 rounded-xl shadow-inner relative overflow-hidden">
          
          {/* Header Calligraphy in pure English */}
          <div className="text-center pb-6 border-b border-[#c9b49b] mb-8 relative">
            <div className="flex items-center justify-center gap-3 text-xs tracking-[0.25em] uppercase text-[#b45309] font-bold mb-1">
              <span>✦</span>
              <span>THE INDIAN HOME COOK'S MENU CARD</span>
              <span>✦</span>
            </div>
            
            <h1 className="font-menu-title text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#1c130d] mt-1">
              15-Minute Recipe Rescaler
            </h1>
            
            <p className="font-menu-serif text-base sm:text-lg text-[#614e3b] italic mt-2 max-w-xl mx-auto">
              Precision ingredient recalibration for rapid Indian home cooking. Adapt your core ingredients in seconds for any dining table.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mt-3 text-[11px] uppercase tracking-wider text-[#9b784a] font-medium">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#d97706]" />
                Under 15 Mins Prep
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-[#d97706]" />
                Proportional Scaling
              </span>
              <span>•</span>
              <span>Saved in Browser</span>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              onRescale();
            }}
            className="space-y-7"
          >
            {/* 1. Dish Name Section */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="dish-name"
                  className="block text-xs uppercase tracking-wider font-bold text-[#5c4733]"
                >
                  1. Dish Name (Ready Under 15 Mins)
                </label>
                <span className="text-[11px] text-[#b45309] font-medium">
                  Homestyle Flavor
                </span>
              </div>
              <div className="relative">
                <input
                  id="dish-name"
                  type="text"
                  value={dishName}
                  onChange={(e) => setDishName(e.target.value)}
                  placeholder="e.g. Spiced Cottage Cheese Scramble (10 mins)"
                  className="w-full px-4 py-3 bg-[#fffcf6] border border-[#c4ae94] focus:border-[#b45309] focus:ring-2 focus:ring-[#b45309]/20 rounded-lg font-menu-title text-lg sm:text-xl text-[#211812] placeholder-[#a69584] transition-all outline-none"
                />
                <Utensils className="w-5 h-5 text-[#a69584] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* 2. Servings Calibration: Seamlessly inside the menu with matching parchment and delicate border dividers */}
            <div className="border-y border-[#d8c7b3] py-6 my-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div>
                  <h3 className="text-xs uppercase tracking-wider font-bold text-[#5c4733]">
                    2. Table Servings & Guest Count
                  </h3>
                  <p className="text-[11px] text-[#7d6550] italic mt-0.5">
                    Enter the original recipe yield and how many people you are serving today
                  </p>
                </div>
                {multiplier && (
                  <div className="self-start sm:self-center">
                    <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#8a4409] bg-[#faebd7] px-3 py-1 rounded-md border border-[#cdae8a]">
                      Scale Multiplier: {multiplier}×
                    </span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* Recipe Makes */}
                <div className="bg-[#fffdf9] p-4 rounded-xl border border-[#cbba9e] shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="recipe-makes" className="text-xs font-bold uppercase tracking-wider text-[#634e3a]">
                      Recipe Makes (Servings)
                    </label>
                    <span className="text-[11px] text-[#917d69] italic">Original recipe yield</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleAdjustServings('makes', -1)}
                      className="w-10 h-10 rounded-lg bg-[#f0e4d0] hover:bg-[#e4d3ba] active:bg-[#d8c1a2] text-[#4d3b2c] flex items-center justify-center font-bold transition-colors cursor-pointer"
                      title="Decrease original servings"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      id="recipe-makes"
                      type="number"
                      step="any"
                      min="0"
                      value={recipeMakes}
                      onChange={(e) => setRecipeMakes(e.target.value)}
                      placeholder="e.g. 2"
                      className="flex-1 text-center py-2 px-3 bg-white border border-[#c2ab90] focus:border-[#b45309] rounded-lg font-mono text-xl sm:text-2xl font-bold text-[#291e15] outline-none tabular-nums"
                    />
                    <button
                      type="button"
                      onClick={() => handleAdjustServings('makes', 1)}
                      className="w-10 h-10 rounded-lg bg-[#f0e4d0] hover:bg-[#e4d3ba] active:bg-[#d8c1a2] text-[#4d3b2c] flex items-center justify-center font-bold transition-colors cursor-pointer"
                      title="Increase original servings"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Servings Wanted */}
                <div className="bg-[#fffdf9] p-4 rounded-xl border border-[#cbba9e] shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="servings-wanted" className="text-xs font-bold uppercase tracking-wider text-[#634e3a]">
                      Servings Wanted (Guests)
                    </label>
                    <span className="text-[11px] text-[#917d69] italic">People eating today</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleAdjustServings('wanted', -1)}
                      className="w-10 h-10 rounded-lg bg-[#f0e4d0] hover:bg-[#e4d3ba] active:bg-[#d8c1a2] text-[#4d3b2c] flex items-center justify-center font-bold transition-colors cursor-pointer"
                      title="Decrease guests wanted"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      id="servings-wanted"
                      type="number"
                      step="any"
                      min="0"
                      value={servingsWanted}
                      onChange={(e) => setServingsWanted(e.target.value)}
                      placeholder="e.g. 4"
                      className="flex-1 text-center py-2 px-3 bg-white border border-[#c2ab90] focus:border-[#b45309] rounded-lg font-mono text-xl sm:text-2xl font-bold text-[#291e15] outline-none tabular-nums"
                    />
                    <button
                      type="button"
                      onClick={() => handleAdjustServings('wanted', 1)}
                      className="w-10 h-10 rounded-lg bg-[#f0e4d0] hover:bg-[#e4d3ba] active:bg-[#d8c1a2] text-[#4d3b2c] flex items-center justify-center font-bold transition-colors cursor-pointer"
                      title="Increase guests wanted"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Gathering Presets in pure English */}
              <div className="mt-3.5 flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#816c56] mr-1">
                  Quick Table Presets:
                </span>
                {[
                  { label: 'Half (0.5×)', factor: 0.5 },
                  { label: 'Exact (1×)', factor: 1 },
                  { label: '1.5×', factor: 1.5 },
                  { label: 'Double (2×)', factor: 2 },
                  { label: 'Triple (3×)', factor: 3 },
                  { label: 'Feast (4×)', factor: 4 },
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => handleMultiplierPreset(item.factor)}
                    className="px-2.5 py-1 text-xs font-medium rounded-md bg-[#eee3cf] hover:bg-[#e0cfb4] text-[#3d2f21] border border-[#cbba9e] transition-colors cursor-pointer"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Three Ingredients Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-xs uppercase tracking-wider font-bold text-[#5c4733]">
                  3. The Three Ingredients & Original Quantities
                </label>
                <span className="text-[11px] text-[#8c7865] italic">
                  Exact baseline amounts as written in the original recipe
                </span>
              </div>

              <div className="space-y-3">
                {ingredients.map((ing, idx) => (
                  <div
                    key={ing.id}
                    className="bg-[#fffdf9] p-3.5 sm:p-4 rounded-xl border border-[#cbba9e] shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
                  >
                    {/* Index badge */}
                    <div className="w-7 h-7 rounded-full bg-[#f0e4d0] border border-[#d2bfab] flex items-center justify-center font-mono text-xs font-bold text-[#674e37] shrink-0 self-start sm:self-center">
                      0{idx + 1}
                    </div>

                    {/* Ingredient Name */}
                    <div className="flex-1 min-w-0">
                      <input
                        type="text"
                        value={ing.name}
                        onChange={(e) => setIngredient(idx, 'name', e.target.value)}
                        placeholder={`Ingredient ${idx + 1} (e.g. Fresh Paneer, Poha, Potatoes...)`}
                        className="w-full px-3 py-2 bg-white border border-[#c4ae94] focus:border-[#b45309] rounded-lg text-sm text-[#261b12] placeholder-[#a69584] outline-none"
                      />
                    </div>

                    {/* Amount & Unit container */}
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <div className="w-1/2 sm:w-28">
                        <input
                          type="number"
                          step="any"
                          min="0"
                          value={ing.amount}
                          onChange={(e) => setIngredient(idx, 'amount', e.target.value)}
                          placeholder="Amount"
                          className="w-full px-3 py-2 bg-white border border-[#c4ae94] focus:border-[#b45309] rounded-lg font-mono text-sm font-semibold text-[#261b12] placeholder-[#a69584] outline-none tabular-nums text-right"
                        />
                      </div>

                      {/* Unit Selector / Input in pure English */}
                      <div className="w-1/2 sm:w-32 relative">
                        <input
                          type="text"
                          value={ing.unit}
                          onChange={(e) => setIngredient(idx, 'unit', e.target.value)}
                          placeholder="unit (g, tbsp, cups)"
                          list={`english-units-list-${idx}`}
                          className="w-full px-2.5 py-2 bg-white border border-[#c4ae94] focus:border-[#b45309] rounded-lg text-sm text-[#261b12] placeholder-[#a69584] outline-none"
                        />
                        <datalist id={`english-units-list-${idx}`}>
                          {COMMON_UNITS.map((u) => (
                            <option key={u} value={u} />
                          ))}
                        </datalist>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Validation Error Banner (When servings is empty, zero or negative) */}
            {validationError && (
              <div
                role="alert"
                className="bg-[#fcf0ed] border-2 border-[#d95c43] p-4 rounded-xl text-[#872512] flex items-start gap-3.5 shadow-sm animate-in fade-in duration-200"
              >
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-[#d95c43]" />
                <div className="flex-1">
                  <div className="text-sm font-bold tracking-tight">
                    Unable to Rescale Recipe
                  </div>
                  <div className="text-xs sm:text-sm mt-0.5 leading-relaxed font-medium">
                    {validationError}
                  </div>
                  <div className="text-[11px] text-[#a43b24] mt-1.5 italic">
                    Rule: Both the original recipe servings and servings wanted must be filled with numbers greater than zero.
                  </div>
                </div>
              </div>
            )}

            {/* Ingredient specific errors if any */}
            {ingredientErrors.length > 0 && !validationError && (
              <div
                role="alert"
                className="bg-[#fff8ed] border border-[#e09a3e] p-3.5 rounded-xl text-[#80490b] flex items-start gap-3 text-xs"
              >
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-[#e09a3e]" />
                <div>
                  <div className="font-semibold mb-1">Check Ingredient Quantities:</div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {ingredientErrors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Rescale Action Button */}
            <div className="pt-1">
              <button
                type="submit"
                className="w-full py-4 px-6 bg-gradient-to-r from-[#b45309] via-[#92400e] to-[#78350f] hover:from-[#c25e10] hover:to-[#853b11] text-[#fbf5ee] rounded-xl font-menu-title font-bold text-lg sm:text-xl tracking-wide shadow-md hover:shadow-lg active:scale-[0.99] transition-all flex items-center justify-center gap-3 cursor-pointer"
              >
                <Scale className="w-5 h-5" />
                <span>Calculate & Rescale the 3 Ingredients</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </form>

          {/* Scaled Ingredients Output Section */}
          {scaledResults && scaledResults.length > 0 && !validationError && (
            <div className="mt-10 pt-8 border-t-2 border-dashed border-[#c4ae94] animate-in fade-in-50 duration-300">
              
              {/* Output Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-[#92400e] flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-700" />
                    <span>Proportions Scaled Successfully</span>
                  </div>
                  <h2 className="font-menu-title text-2xl sm:text-3xl font-bold text-[#1a120c] mt-0.5">
                    {dishName.trim() || 'Homestyle Indian Dish'}
                  </h2>
                  <p className="font-menu-serif text-sm text-[#66523e] italic mt-0.5">
                    Scaled for <strong>{servingsWanted} people</strong> (Original was for {recipeMakes} servings · Multiplier: {multiplier}×)
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
                  <button
                    type="button"
                    onClick={handleCopyResults}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider text-[#402e1f] bg-[#eadecd] hover:bg-[#decbbe] border border-[#beaa94] transition-colors cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadJSON}
                    title="Download this scaled recipe as a JSON file"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider text-[#402e1f] bg-[#eadecd] hover:bg-[#decbbe] border border-[#beaa94] transition-colors cursor-pointer"
                  >
                    <Code className="w-3.5 h-3.5" />
                    <span>Save JSON</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadHTML}
                    title="Download this scaled recipe as a standalone HTML file"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider text-[#402e1f] bg-[#eadecd] hover:bg-[#decbbe] border border-[#beaa94] transition-colors cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Save HTML</span>
                  </button>
                </div>
              </div>

              {/* Three Scaled Ingredients Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {scaledResults.map((result, idx) => {
                  const isChecked = !!checkedIngredients[idx];
                  const percentChange = Math.round(
                    ((result.newAmount - result.originalAmount) / result.originalAmount) * 100
                  );
                  const isGreater = result.newAmount >= result.originalAmount;

                  return (
                    <div
                      key={idx}
                      onClick={() => toggleCheck(idx)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer select-none flex flex-col justify-between ${
                        isChecked
                          ? 'bg-[#f0ebe2] border-[#a8937b] opacity-80'
                          : 'bg-[#fffdfa] border-[#cbbba6] shadow-sm hover:border-[#b45309]'
                      }`}
                    >
                      <div>
                        {/* Top row with ingredient index & checkmark */}
                        <div className="flex items-center justify-between text-xs text-[#7e6954] mb-2">
                          <span className="font-mono uppercase font-bold tracking-wider text-[11px]">
                            Ingredient 0{idx + 1}
                          </span>
                          <div
                            className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                              isChecked
                                ? 'bg-[#78350f] border-[#78350f] text-white'
                                : 'border-[#b9a691] bg-white'
                            }`}
                            title="Click to check off while cooking"
                          >
                            {isChecked && <Check className="w-3.5 h-3.5" />}
                          </div>
                        </div>

                        {/* Ingredient Name */}
                        <h3
                          className={`font-menu-title text-lg font-bold text-[#1f1711] leading-snug ${
                            isChecked ? 'line-through text-[#7d6c5c]' : ''
                          }`}
                        >
                          {result.name}
                        </h3>

                        {/* Scaled Value Callout */}
                        <div className="mt-3 py-2 px-3 bg-[#fdf8ef] rounded-lg border border-[#e4d3bc]">
                          <div className="text-[11px] uppercase tracking-wider text-[#825e36] font-semibold">
                            New Scaled Amount
                          </div>
                          <div className="flex items-baseline gap-1.5 mt-0.5">
                            <span className="font-mono text-2xl sm:text-3xl font-extrabold text-[#92400e] tabular-nums">
                              {result.newAmount}
                            </span>
                            {result.unit && (
                              <span className="text-sm font-bold text-[#4f3c2b]">
                                {result.unit}
                              </span>
                            )}
                          </div>
                          {result.fractionDisplay && result.fractionDisplay !== result.newAmount.toString() && (
                            <div className="text-xs text-[#a16207] font-menu-serif italic mt-0.5">
                              approx. {result.fractionDisplay} {result.unit}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Footer: Original amount comparison & formula */}
                      <div className="mt-4 pt-3 border-t border-[#ebdcc9] text-[11px] text-[#715d4b]">
                        <div className="flex items-center justify-between">
                          <span>Original:</span>
                          <span className="font-mono font-medium tabular-nums">
                            {result.originalAmount} {result.unit}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-1 text-[10px] text-[#937b63]">
                          <span>Adjustment:</span>
                          <span
                            className={`font-mono font-semibold ${
                              isGreater ? 'text-emerald-800' : 'text-amber-800'
                            }`}
                          >
                            {percentChange >= 0 ? `+${percentChange}%` : `${percentChange}%`}
                          </span>
                        </div>
                        <div className="mt-1.5 text-[10px] text-[#9c856f] font-mono leading-tight">
                          ({result.originalAmount} × {servingsWanted}) ÷ {recipeMakes} = {result.newAmount}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Cooking note */}
              <div className="mt-5 p-3 rounded-lg bg-[#efe7d8] border border-[#d6c7b2] flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#5f4d3c] gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#b45309]">Cooking Tip:</span>
                  <span>Click any ingredient card above to check it off as you assemble in under 15 minutes!</span>
                </div>
                <div className="text-[11px] text-[#8e7a68]">
                  Values remembered between browser sessions
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};
