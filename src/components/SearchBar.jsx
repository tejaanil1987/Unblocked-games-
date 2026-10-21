import React, { useRef, useEffect } from 'react';
import { Search, X, SlidersHorizontal, Heart, Clock } from 'lucide-react';
import { GAME_CATEGORIES } from '../types/game.js';

export const SearchBar = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  sortBy,
  onSortChange,
  filterFavorites,
  onToggleFavoritesFilter,
  filterRecents,
  onToggleRecentsFilter,
  totalGamesCount,
}) => {
  const searchInputRef = useRef(null);

  // Global hotkey '/' to focus search input
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div id="games-toolbar" className="w-full space-y-4">
      {/* Search Input Row & Sorting */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search games by title, tags, or genre... (Press '/' to focus)"
            className="w-full pl-10 pr-10 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-colors shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort & Quick Filters */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-300">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <span>Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="bg-transparent font-semibold text-slate-900 dark:text-white focus:outline-none cursor-pointer"
            >
              <option value="popular" className="bg-white dark:bg-slate-900">Most Popular</option>
              <option value="rating" className="bg-white dark:bg-slate-900">Highest Rated</option>
              <option value="newest" className="bg-white dark:bg-slate-900">Newest</option>
              <option value="title" className="bg-white dark:bg-slate-900">A to Z</option>
            </select>
          </div>

          <button
            onClick={onToggleFavoritesFilter}
            className={`flex items-center gap-1 px-3 py-2 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
              filterFavorites
                ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-900 text-rose-600 dark:text-rose-400 font-semibold'
                : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${filterFavorites ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span>Saved</span>
          </button>

          <button
            onClick={onToggleRecentsFilter}
            className={`flex items-center gap-1 px-3 py-2 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
              filterRecents
                ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-900 text-amber-600 dark:text-amber-400 font-semibold'
                : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Recent</span>
          </button>
        </div>
      </div>

      {/* Category Tabs: Interactive Segmented Control Buttons */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
        <div className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-none">
          {GAME_CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat && !filterFavorites && !filterRecents;
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 font-bold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap pl-4 hidden sm:block">
          <span className="font-semibold text-slate-700 dark:text-slate-300 tabular-nums">{totalGamesCount}</span> games available
        </div>
      </div>
    </div>
  );
};
