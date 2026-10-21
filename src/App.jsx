import React, { useState, useEffect, useMemo } from 'react';
import { gameService } from './services/gameService.js';
import { Navbar } from './components/Navbar.jsx';
import { HeroSection } from './components/HeroSection.jsx';
import { SearchBar } from './components/SearchBar.jsx';
import { GameCard } from './components/GameCard.jsx';
import { GamePlayer } from './components/GamePlayer.jsx';
import { AddGameModal } from './components/AddGameModal.jsx';
import { PanicDisguise } from './components/PanicDisguise.jsx';
import { Footer } from './components/Footer.jsx';
import { SearchX } from 'lucide-react';

export default function App() {
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('popular');
  const [filterFavorites, setFilterFavorites] = useState(false);
  const [filterRecents, setFilterRecents] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [recentGameIds, setRecentGameIds] = useState([]);
  const [isPanicActive, setIsPanicActive] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Initialize data and settings on mount
  useEffect(() => {
    const loadedGames = gameService.getAllGames();
    setGames(loadedGames);

    const prefs = gameService.getPreferences();
    setFavorites(prefs.favorites || []);
    setRecentGameIds(prefs.recentGameIds || []);
    setDarkMode(prefs.theme === 'dark');

    // Sync dark class to root document
    if (prefs.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Check hash for deep link (e.g. #game=galaxy-invaders)
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#game=')) {
        const slug = hash.replace('#game=', '');
        const target = loadedGames.find((g) => g.slug === slug || g.id === slug);
        if (target) {
          setSelectedGame(target);
          gameService.recordPlay(target.id);
        }
      } else {
        setSelectedGame(null);
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);

    // Global Panic Key listener: '['
    const handleKeyDown = (e) => {
      if (e.key === '[' && !isPanicActive && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        setIsPanicActive(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('hashchange', handleHash);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Theme toggle handler
  const handleToggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    gameService.savePreferences({ theme: next ? 'dark' : 'light' });
    if (next) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Toggle favorite
  const handleToggleFavorite = (gameId, e) => {
    e.stopPropagation();
    const updated = gameService.toggleFavorite(gameId);
    setFavorites(updated);
  };

  // Select game to play
  const handleSelectGame = (game) => {
    setSelectedGame(game);
    window.location.hash = `#game=${game.slug}`;
    gameService.recordPlay(game.id);
    const updatedPrefs = gameService.getPreferences();
    setRecentGameIds(updatedPrefs.recentGameIds || []);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Back to catalog view
  const handleBackToCatalog = () => {
    setSelectedGame(null);
    window.location.hash = '';
  };

  // Handle new custom game added
  const handleGameAdded = (newGame) => {
    const updated = gameService.getAllGames();
    setGames(updated);
    handleSelectGame(newGame);
  };

  // Delete custom game
  const handleDeleteCustomGame = (gameId) => {
    if (confirm('Are you sure you want to remove this custom game?')) {
      gameService.deleteCustomGame(gameId);
      const updated = gameService.getAllGames();
      setGames(updated);
      handleBackToCatalog();
    }
  };

  // Scroll to games catalog toolbar
  const handleExploreClick = () => {
    const el = document.getElementById('games-toolbar');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Filter and sort games
  const filteredGames = useMemo(() => {
    return games
      .filter((game) => {
        // Global Real-time Search filter based on title or category
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchesTitle = (game.title || '').toLowerCase().includes(q);
          const matchesCategory = (game.category || '').toLowerCase().includes(q);
          const matchesTags = (game.tags || []).some((t) => t.toLowerCase().includes(q));
          const matchesDesc = (game.description || '').toLowerCase().includes(q);

          if (!matchesTitle && !matchesCategory && !matchesTags && !matchesDesc) {
            return false;
          }
        }

        // Category filter (applied when search query is empty or explicitly filtering within category)
        if (selectedCategory !== 'All' && !filterFavorites && !filterRecents && !searchQuery.trim()) {
          if (game.category !== selectedCategory) return false;
        }

        // Favorites filter
        if (filterFavorites && !favorites.includes(game.id)) {
          return false;
        }

        // Recents filter
        if (filterRecents && !recentGameIds.includes(game.id)) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'popular') return (b.plays || 0) - (a.plays || 0);
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        if (sortBy === 'newest') return (b.releaseYear || '0').localeCompare(a.releaseYear || '0');
        if (sortBy === 'title') return a.title.localeCompare(b.title);
        return 0;
      });
  }, [games, searchQuery, selectedCategory, sortBy, filterFavorites, filterRecents, favorites, recentGameIds]);

  // Featured games for hero banner
  const featuredGames = useMemo(() => {
    return games.filter((g) => g.featured);
  }, [games]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Panic Cloak Overlay */}
      {isPanicActive && <PanicDisguise onDismiss={() => setIsPanicActive(false)} />}

      {/* Top Bar Navigation with Global Search */}
      <Navbar
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
        onTriggerPanic={() => setIsPanicActive(true)}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setFilterFavorites(false);
          setFilterRecents(false);
          setSearchQuery('');
        }}
        onViewFavorites={() => {
          setFilterFavorites(true);
          setFilterRecents(false);
          setSearchQuery('');
        }}
        favoritesCount={favorites.length}
        currentView={selectedGame ? 'player' : 'catalog'}
        onBackToCatalog={handleBackToCatalog}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        allGames={games}
        onSelectGame={handleSelectGame}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {selectedGame ? (
          /* Dedicated Game Player View */
          <GamePlayer
            game={selectedGame}
            isFavorite={favorites.includes(selectedGame.id)}
            onToggleFavorite={handleToggleFavorite}
            onBackToCatalog={handleBackToCatalog}
            onDeleteCustomGame={selectedGame.isCustom ? handleDeleteCustomGame : undefined}
            onSelectGame={handleSelectGame}
            allGames={games}
          />
        ) : (
          /* Catalog View: Hero + Search + Responsive Grid */
          <>
            <HeroSection
              featuredGames={featuredGames}
              onSelectGame={handleSelectGame}
              onExploreClick={handleExploreClick}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
              {/* Search, Filter Tabs & Sorting */}
              <SearchBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedCategory={selectedCategory}
                onSelectCategory={(cat) => {
                  setSelectedCategory(cat);
                  setFilterFavorites(false);
                  setFilterRecents(false);
                }}
                sortBy={sortBy}
                onSortChange={setSortBy}
                filterFavorites={filterFavorites}
                onToggleFavoritesFilter={() => {
                  setFilterFavorites(!filterFavorites);
                  setFilterRecents(false);
                }}
                filterRecents={filterRecents}
                onToggleRecentsFilter={() => {
                  setFilterRecents(!filterRecents);
                  setFilterFavorites(false);
                }}
                totalGamesCount={filteredGames.length}
              />

              {/* Active Filter Indicators */}
              {(filterFavorites || filterRecents || searchQuery) && (
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span>Filtered by:</span>
                  {filterFavorites && <span className="font-semibold text-rose-500">Saved Favorites</span>}
                  {filterRecents && <span className="font-semibold text-amber-500">Recently Played</span>}
                  {searchQuery && (
                    <span>
                      Query &quot;<strong>{searchQuery}</strong>&quot;
                    </span>
                  )}
                  <button
                    onClick={() => {
                      setFilterFavorites(false);
                      setFilterRecents(false);
                      setSearchQuery('');
                      setSelectedCategory('All');
                    }}
                    className="ml-2 text-amber-500 hover:underline font-semibold cursor-pointer"
                  >
                    Clear Filters
                  </button>
                </div>
              )}

              {/* Games Grid */}
              {filteredGames.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredGames.map((game) => (
                    <GameCard
                      key={game.id}
                      game={game}
                      isFavorite={favorites.includes(game.id)}
                      onToggleFavorite={handleToggleFavorite}
                      onSelectGame={handleSelectGame}
                    />
                  ))}
                </div>
              ) : (
                /* Empty state when no games match */
                <div className="py-16 text-center space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                    <SearchX className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    No games found
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                    Try adjusting your search terms, removing filters, or add your own custom game with an iframe link.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('All');
                      setFilterFavorites(false);
                      setFilterRecents(false);
                    }}
                    className="mt-2 px-4 py-2 text-xs font-semibold rounded-lg bg-amber-500 text-slate-950 hover:bg-amber-400 cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* Add Custom Game Modal */}
      <AddGameModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onGameAdded={handleGameAdded}
      />

      {/* Compliant Footer */}
      <Footer
        onBackToTop={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />
    </div>
  );
}
