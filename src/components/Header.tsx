import React from 'react';
import { ChefHat, Printer, RotateCcw } from 'lucide-react';

interface HeaderProps {
  onReset: () => void;
  onPrint: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onReset, onPrint }) => {
  return (
    <header className="border-b border-[#3b2d22] bg-[#1a140f]/90 backdrop-blur-md sticky top-0 z-40 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Pure English Brand wordmark */}
        <a href="/" className="flex items-center gap-2.5 text-amber-100 hover:text-amber-200 transition-colors whitespace-nowrap shrink-0">
          <div className="w-8 h-8 rounded-md bg-[#b45309]/30 border border-[#d97706]/50 flex items-center justify-center text-[#f59e0b]">
            <ChefHat className="w-5 h-5" />
          </div>
          <span className="font-menu-title text-xl tracking-tight text-[#f3e7d3] font-semibold">
            The Indian Kitchen
          </span>
        </a>

        {/* Zone 2: 3 clean single-line nav links in pure English */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#b09f8e]">
          <a href="#menu-rescaler" className="hover:text-[#f3e7d3] transition-colors whitespace-nowrap shrink-0">
            Recipe Rescaler
          </a>
          <a href="#house-favorites" className="hover:text-[#f3e7d3] transition-colors whitespace-nowrap shrink-0">
            15-Minute Favorites
          </a>
          <a href="#culinary-guide" className="hover:text-[#f3e7d3] transition-colors whitespace-nowrap shrink-0">
            Spice & Heat Guide
          </a>
        </nav>

        {/* Zone 3: Primary action in pure English */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onReset}
            title="Reset recipe to initial template"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#c4b3a0] hover:text-[#f3e7d3] hover:bg-[#2c241e] rounded-md transition-colors whitespace-nowrap"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Clear
          </button>
          <button
            type="button"
            onClick={onPrint}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold tracking-wide uppercase text-[#1a140f] bg-[#f59e0b] hover:bg-[#fbbf24] active:bg-[#d97706] rounded-md shadow-sm transition-all whitespace-nowrap shrink-0"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Menu</span>
          </button>
        </div>
      </div>
    </header>
  );
};
