import rawGames from '../data/games.json';
import { DEFAULT_PREFERENCES } from '../types/game.js';

const CUSTOM_GAMES_KEY = 'nexus_custom_games';
const USER_PREFS_KEY = 'nexus_user_preferences';

export const gameService = {
  getAllGames() {
    const defaultGames = rawGames || [];
    const storedCustom = localStorage.getItem(CUSTOM_GAMES_KEY);
    let customGames = [];
    if (storedCustom) {
      try {
        customGames = JSON.parse(storedCustom);
      } catch (err) {
        console.error('Failed to parse custom games', err);
      }
    }
    return [...defaultGames, ...customGames];
  },

  getGameBySlug(slug) {
    const all = this.getAllGames();
    return all.find((g) => g.slug === slug || g.id === slug);
  },

  getPreferences() {
    const saved = localStorage.getItem(USER_PREFS_KEY);
    if (!saved) return DEFAULT_PREFERENCES;
    try {
      return { ...DEFAULT_PREFERENCES, ...JSON.parse(saved) };
    } catch {
      return DEFAULT_PREFERENCES;
    }
  },

  savePreferences(prefs) {
    const current = this.getPreferences();
    const updated = { ...current, ...prefs };
    localStorage.setItem(USER_PREFS_KEY, JSON.stringify(updated));
    return updated;
  },

  toggleFavorite(gameId) {
    const prefs = this.getPreferences();
    const isFav = prefs.favorites.includes(gameId);
    const updatedFavs = isFav
      ? prefs.favorites.filter((id) => id !== gameId)
      : [...prefs.favorites, gameId];
    this.savePreferences({ favorites: updatedFavs });
    return updatedFavs;
  },

  recordPlay(gameId) {
    const prefs = this.getPreferences();
    const filtered = prefs.recentGameIds.filter((id) => id !== gameId);
    const updatedRecents = [gameId, ...filtered].slice(0, 10);
    this.savePreferences({ recentGameIds: updatedRecents });
  },

  addCustomGame(game) {
    const id = 'custom-' + Date.now();
    const newGame = {
      ...game,
      id,
      plays: 1,
      rating: 5.0,
      releaseYear: String(new Date().getFullYear()),
      isCustom: true,
      createdAt: new Date().toISOString(),
    };

    const storedCustom = localStorage.getItem(CUSTOM_GAMES_KEY);
    let list = [];
    if (storedCustom) {
      try {
        list = JSON.parse(storedCustom);
      } catch (err) {
        console.error(err);
      }
    }
    list.unshift(newGame);
    localStorage.setItem(CUSTOM_GAMES_KEY, JSON.stringify(list));
    return newGame;
  },

  deleteCustomGame(gameId) {
    const storedCustom = localStorage.getItem(CUSTOM_GAMES_KEY);
    if (!storedCustom) return;
    try {
      const list = JSON.parse(storedCustom);
      const filtered = list.filter((g) => g.id !== gameId);
      localStorage.setItem(CUSTOM_GAMES_KEY, JSON.stringify(filtered));
    } catch (err) {
      console.error(err);
    }
  },

  parseIframeString(input) {
    const trimmed = input.trim();
    if (trimmed.startsWith('<iframe')) {
      const srcMatch = trimmed.match(/src=["']([^"']+)["']/i);
      const srcdocMatch = trimmed.match(/srcdoc=["']([\s\S]*?)["'](?:\s|>)/i);
      return {
        url: srcMatch ? srcMatch[1] : undefined,
        srcdoc: srcdocMatch ? srcdocMatch[1] : undefined,
        rawIframe: trimmed,
      };
    }
    return {
      url: trimmed,
      rawIframe: `<iframe src="${trimmed}" width="100%" height="100%" frameborder="0" allow="fullscreen; autoplay; keyboard" sandbox="allow-scripts allow-same-origin allow-popups"></iframe>`,
    };
  },
};
