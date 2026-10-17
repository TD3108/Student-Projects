import React from 'react';
import { HouseFavorite } from '../types';
import { INDIAN_15MIN_FAVORITES, QUICK_RECIPE_PRESETS } from '../data/houseFavorites';
import { Clock, Users, ArrowUpRight, Flame, Sparkles, Zap } from 'lucide-react';

interface HouseFavoritesProps {
  onSelectFavorite: (favorite: HouseFavorite) => void;
  onSelectPreset: (preset: typeof QUICK_RECIPE_PRESETS[0]) => void;
  currentDishName: string;
}

export const HouseFavorites: React.FC<HouseFavoritesProps> = ({
  onSelectFavorite,
  onSelectPreset,
  currentDishName
}) => {
  return (
    <section id="house-favorites" className="scroll-mt-24 py-12">
      <div className="text-center max-w-2xl mx-auto mb-10 px-4">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#f59e0b] font-semibold mb-2">
          <Zap className="w-3.5 h-3.5 fill-[#f59e0b]" />
          <span>Under 15 Minutes · Homestyle Indian Favorites</span>
        </div>
        <h2 className="font-menu-title text-3xl sm:text-4xl text-[#f5ebd9] font-bold tracking-tight">
          The House's Favorite Indian Foods
        </h2>
        <p className="font-menu-serif text-lg text-[#b8a693] mt-2 italic">
          Wholesome comfort meals crafted for rapid dinners and quick breakfast tiffins. All prepared in 15 minutes or less.
        </p>
      </div>

      {/* Signature 3 Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {INDIAN_15MIN_FAVORITES.map((dish) => {
          const isCurrentlyActive = currentDishName.trim().toLowerCase() === dish.dishName.trim().toLowerCase();

          return (
            <div
              key={dish.id}
              className={`group flex flex-col bg-[#221c18] border rounded-xl overflow-hidden transition-all duration-300 ${
                isCurrentlyActive
                  ? 'border-[#f59e0b] ring-1 ring-[#f59e0b]/40 shadow-lg shadow-[#f59e0b]/10'
                  : 'border-[#3d3228] hover:border-[#695441] hover:-translate-y-1'
              }`}
            >
              {/* Photo Frame */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#171412]">
                <img
                  src={dish.imageUrl}
                  alt={dish.dishName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#221c18] via-transparent to-transparent opacity-80" />
                
                {/* 15-Min Speed Tag */}
                <div className="absolute top-3 left-3 bg-[#1a1614]/90 backdrop-blur-sm border border-[#d97706]/40 px-2.5 py-1 rounded text-[11px] font-bold tracking-wide uppercase text-[#f59e0b] flex items-center gap-1.5 shadow-sm">
                  <Clock className="w-3 h-3 text-[#f59e0b]" />
                  <span>{dish.prepTime}</span>
                </div>

                <div className="absolute top-3 right-3 bg-[#1a1614]/80 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] uppercase font-semibold text-[#c7b7a6]">
                  {dish.category}
                </div>
              </div>

              {/* Content Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 text-xs text-[#a69482] mb-1.5">
                    <span className="flex items-center gap-1 text-[#f59e0b] font-medium">
                      <Flame className="w-3 h-3" />
                      Flash Pan-Fry
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-[#d4af37]" />
                      Serves {dish.defaultServings}
                    </span>
                  </div>

                  <h3 className="font-menu-title text-xl text-[#f5ebd9] font-bold leading-snug group-hover:text-[#fcd34d] transition-colors">
                    {dish.dishName}
                  </h3>

                  <p className="font-menu-serif text-sm text-[#bcaaa0] mt-2 italic leading-relaxed line-clamp-2">
                    {dish.chefNotes}
                  </p>

                  {/* 3 Ingredients Preview */}
                  <div className="mt-4 pt-3 border-t border-[#342a22]">
                    <div className="text-[11px] tracking-wider uppercase font-semibold text-[#9e8876] mb-2 flex items-center justify-between">
                      <span>Key Ingredients (3)</span>
                      <span className="text-[10px] text-[#f59e0b]">Original for {dish.defaultServings}</span>
                    </div>
                    <ul className="space-y-1 text-xs text-[#dcd2c4]">
                      {dish.ingredients.map((ing) => (
                        <li key={ing.id} className="flex justify-between items-baseline gap-2">
                          <span className="truncate text-[#beb0a1]">{ing.name}</span>
                          <span className="font-mono text-[11px] text-[#f5ebd9] font-medium shrink-0 tabular-nums">
                            {ing.amount} {ing.unit}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Action CTA */}
                <div className="mt-6 pt-2">
                  <button
                    type="button"
                    onClick={() => onSelectFavorite(dish)}
                    className={`w-full py-2.5 px-4 rounded-lg text-xs font-semibold tracking-wide uppercase transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      isCurrentlyActive
                        ? 'bg-[#f59e0b] text-[#171412] shadow-sm font-bold'
                        : 'bg-[#2e2620] hover:bg-[#3d322a] text-[#eedcc5] border border-[#4d3e33] hover:border-[#6e5847]'
                    }`}
                  >
                    {isCurrentlyActive ? (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Loaded in Rescaler</span>
                      </>
                    ) : (
                      <>
                        <span>Load Recipe into Scaler</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Express Indian Quick-Picks (Under 10 mins) */}
      <div className="mt-8 p-5 bg-[#1e1814] border border-[#3b2e24] rounded-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-amber-500 font-bold text-sm">⚡ More Express Indian Staples:</span>
            <span className="text-xs text-[#a89582]">Quick 8 to 10-minute recipes you can scale in one click</span>
          </div>
          <span className="text-[11px] uppercase tracking-wider text-[#d97706] font-semibold">
            Ready in Under 10 Mins
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {QUICK_RECIPE_PRESETS.map((preset, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onSelectPreset(preset)}
              className="text-left p-3 rounded-lg bg-[#28201a] hover:bg-[#332921] border border-[#45362a] hover:border-[#d97706] transition-all group flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] text-[#f59e0b] font-medium mb-1">
                  <span>⏱ {preset.prepTime}</span>
                  <span className="text-[#a89582]">Serves {preset.servings}</span>
                </div>
                <div className="font-menu-title font-semibold text-sm text-[#f1e6d6] group-hover:text-[#fcd34d] transition-colors leading-snug">
                  {preset.dishName}
                </div>
              </div>
              <div className="text-[11px] text-[#8e7a68] mt-2 flex items-center justify-between pt-2 border-t border-[#3a2e24]">
                <span>Load 3 Ingredients</span>
                <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
