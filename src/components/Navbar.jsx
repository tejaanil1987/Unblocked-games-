import React, { useRef, useState, useEffect } from 'react';
import { Sun, Moon, ShieldAlert, Plus, Bookmark, Search, X, Star, Gamepad2 } from 'lucide-react';

export const Navbar = ({
  darkMode,
  onToggleDarkMode,
  onTriggerPanic,
  onOpenAddModal,
  onSelectCategory,
  onViewFavorites,
  favoritesCount,
  currentView,
  onBackToCatalog,
  searchQuery,
  onSearchChange,
  allGames = [],
  onSelectGame,
}) => {
  const globalInputRef = useRef(null);
  const dropdownRef = useRef(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Focus global search with '/' key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/' && document.activeElement !== globalInputRef.current) {
        if (!(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
          e.preventDefault();
          globalInputRef.current?.focus();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        globalInputRef.current &&
        !globalInputRef.current.contains(e.target)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Real-time preview matches based on title or category
  const matchingGames = React.useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return allGames
      .filter((g) => {
        const titleMatch = (g.title || '').toLowerCase().includes(q);
        const categoryMatch = (g.category || '').toLowerCase().includes(q);
        return titleMatch || categoryMatch;
      })
      .slice(0, 6);
  }, [searchQuery, allGames]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    onSearchChange(val);
    if (currentView === 'player' && val.trim()) {
      onBackToCatalog();
    }
    setIsDropdownOpen(true);
  };

  const handleSelectDropdownItem = (game) => {
    setIsDropdownOpen(false);
    onSelectGame(game);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b backdrop-blur-md transition-colors bg-white/95 border-slate-200 text-slate-900 dark:bg-slate-950/95 dark:border-slate-800 dark:text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 md:gap-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={onBackToCatalog}
          className="text-xl font-extrabold tracking-tight hover:opacity-80 transition-opacity whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer"
        >
          <span className="text-amber-500 font-black">NEXUS</span>
          <span>ARCADE</span>
        </button>

        {/* Global Search Input (Centered in Navbar for Universal Real-Time Filtering) */}
        <div className="relative flex-1 max-w-md mx-auto">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              ref={globalInputRef}
              type="text"
              value={searchQuery}
              onChange={handleInputChange}
              onFocus={() => {
                if (searchQuery.trim()) setIsDropdownOpen(true);
              }}
              placeholder="Global search by title or category... (Press '/')"
              aria-label="Global search games"
              className="w-full pl-9 pr-9 py-1.5 text-xs sm:text-sm bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-colors shadow-xs"
            />
            {searchQuery ? (
              <button
                onClick={() => {
                  onSearchChange('');
                  setIsDropdownOpen(false);
                }}
                className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <div className="hidden sm:flex absolute inset-y-0 right-0 pr-2.5 items-center pointer-events-none">
                <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded shadow-2xs">
                  /
                </kbd>
              </div>
            )}
          </div>

          {/* Real-time Global Search Instant Dropdown Preview */}
          {isDropdownOpen && searchQuery.trim() && (
            <div
              ref={dropdownRef}
              className="absolute left-0 right-0 top-full mt-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden z-50 text-xs"
            >
              <div className="p-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                <span>
                  Matches for &quot;<strong>{searchQuery}</strong>&quot;
                </span>
                <span className="tabular-nums font-semibold">{matchingGames.length} found</span>
              </div>

              {matchingGames.length > 0 ? (
                <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-64 overflow-y-auto">
                  {matchingGames.map((game) => (
                    <button
                      key={game.id}
                      onClick={() => handleSelectDropdownItem(game)}
                      className="w-full px-3 py-2.5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 text-amber-500">
                          <Gamepad2 className="w-4 h-4" />
                        </div>
                        <div className="truncate">
                          <div className="font-semibold text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors truncate">
                            {game.title}
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                            <span>{game.category}</span>
                            <span>·</span>
                            <span className="flex items-center gap-0.5 text-amber-500 font-medium">
                              <Star className="w-2.5 h-2.5 fill-amber-500" />
                              {(game.rating || 5.0).toFixed(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className="text-[11px] font-semibold text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap ml-2">
                        Play →
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-slate-400 text-xs">
                  No games matching &quot;{searchQuery}&quot; by title or category
                </div>
              )}
            </div>
          )}
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-5 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button
            onClick={() => {
              onBackToCatalog();
              onSelectCategory('All');
            }}
            className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer text-xs"
          >
            All Games
          </button>
          <button
            onClick={() => {
              onBackToCatalog();
              onSelectCategory('Arcade');
            }}
            className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer text-xs"
          >
            Arcade
          </button>
          <button
            onClick={() => {
              onBackToCatalog();
              onSelectCategory('Puzzle');
            }}
            className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer text-xs"
          >
            Puzzle
          </button>
          <button
            onClick={() => {
              onBackToCatalog();
              onSelectCategory('Action');
            }}
            className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer text-xs"
          >
            Action
          </button>
          <button
            onClick={() => {
              onBackToCatalog();
              onViewFavorites();
            }}
            className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 text-xs"
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Saved ({favoritesCount})</span>
          </button>
        </nav>

        {/* Zone 3: Primary Actions (Theme, Panic, Add) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            onClick={onToggleDarkMode}
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle color theme"
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          <button
            onClick={onTriggerPanic}
            title="Panic Button (Instant Stealth Classroom Disguise) - Hotkey: ["
            aria-label="Stealth Cloak Mode"
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-red-500/10 text-red-600 hover:bg-red-500/20 dark:bg-red-950/40 dark:text-red-400 dark:hover:bg-red-900/50 border border-red-500/20 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-red-500" />
            <span className="hidden sm:inline">Panic [</span>
          </button>

          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add Game</span>
          </button>
        </div>
      </div>
    </header>
  );
};
