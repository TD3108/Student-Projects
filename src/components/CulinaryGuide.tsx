import React from 'react';
import { BookOpen, Flame, Scale, Zap, Sparkles } from 'lucide-react';

export const CulinaryGuide: React.FC = () => {
  return (
    <section id="culinary-guide" className="scroll-mt-24 py-12 border-t border-[#342a22]">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#f59e0b] font-semibold mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>The Indian Kitchen Handbook</span>
          </div>
          <h2 className="font-menu-title text-2xl sm:text-3xl text-[#f5ebd9] font-bold">
            15-Minute Indian Cooking & Scaling Guide
          </h2>
          <p className="font-menu-serif text-base text-[#b8a693] mt-1.5 italic">
            Essential guidelines for tempering whole spices and scaling quick home-style Indian meals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#221c18] border border-[#3d3228] p-5 rounded-xl">
            <div className="flex items-center gap-2 text-[#f59e0b] font-semibold text-sm mb-2">
              <Flame className="w-4 h-4" />
              <span>The 30-Second Tempering Law</span>
            </div>
            <p className="text-xs text-[#c2b2a1] leading-relaxed">
              When scaling from 2 to 6 or 8 guests, do not quadruple your cooking oil or butter. A 1.5× to 2× fat base provides ample pan coating to bloom your mustard seeds, cumin, and curry leaves evenly.
            </p>
          </div>

          <div className="bg-[#221c18] border border-[#3d3228] p-5 rounded-xl">
            <div className="flex items-center gap-2 text-[#f59e0b] font-semibold text-sm mb-2">
              <Scale className="w-4 h-4" />
              <span>Chili & Warm Spice Balance</span>
            </div>
            <p className="text-xs text-[#c2b2a1] leading-relaxed">
              Green chilies and warm ground spices don't scale linearly. When doubling a recipe, use 1.5× chili first. You can always sprinkle fresh cilantro or dried mango powder at the finish.
            </p>
          </div>

          <div className="bg-[#221c18] border border-[#3d3228] p-5 rounded-xl">
            <div className="flex items-center gap-2 text-[#f59e0b] font-semibold text-sm mb-2">
              <Zap className="w-4 h-4" />
              <span>The 15-Minute Method</span>
            </div>
            <p className="text-xs text-[#c2b2a1] leading-relaxed">
              Indian meals are fast when you do parallel prep: while the mustard seeds crackle in hot oil, crumble your cottage cheese or rinse the flattened rice. High heat seals in fragrant aroma in minutes.
            </p>
          </div>
        </div>

        {/* Quick Indian Pantry Measure Reference in English */}
        <div className="mt-6 p-4 rounded-xl bg-[#1b1511] border border-[#3d2f23] flex flex-col sm:flex-row items-center justify-between text-xs text-[#a99583] gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#f59e0b] shrink-0" />
            <span><strong>Home Cook Measure Tip:</strong> 1 standard Indian serving bowl is ~150–180 ml, and 1 pinch of spice is approx. ¼ teaspoon.</span>
          </div>
          <span className="text-[11px] text-[#f59e0b] font-medium shrink-0">Kitchen Standard</span>
        </div>
      </div>
    </section>
  );
};
