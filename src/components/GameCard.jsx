import React, { useState } from 'react';
import { Play, Heart, Gamepad2, Star } from 'lucide-react';

export const GameCard = ({
  game,
  isFavorite,
  onToggleFavorite,
  onSelectGame,
}) => {
  const [imageError, setImageError] = useState(false);

  // Format plays count nicely (e.g. 248k)
  const formatPlays = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return Math.round(num / 1000) + 'k';
    return String(num || 0);
  };

  return (
    <div
      onClick={() => onSelectGame(game)}
      className="group relative flex flex-col overflow-hidden rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200 shadow-xs hover:shadow-md cursor-pointer"
    >
      {/* Visual Media Container (4:3 aspect ratio) */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-950">
        {game.heroImage && !imageError ? (
          <img
            src={game.heroImage}
            alt={game.title}
            onError={() => setImageError(true)}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          /* Styled Resilient CSS/SVG Fallback Container */
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-radial from-slate-800 to-slate-950 text-slate-300 text-center">
            <Gamepad2 className="w-10 h-10 text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-bold tracking-tight text-white">{game.title}</span>
            <span className="text-xs text-slate-400 mt-0.5">{game.category} Arcade</span>
          </div>
        )}

        {/* Contrast Scrim Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

        {/* Favorite Button (Functional control in top right) */}
        <button
          onClick={(e) => onToggleFavorite(game.id, e)}
          title={isFavorite ? 'Remove from Saved' : 'Save Game'}
          className="absolute top-2.5 right-2.5 z-10 p-2 rounded-full bg-slate-950/70 hover:bg-slate-950 text-white backdrop-blur-xs transition-colors cursor-pointer"
        >
          <Heart
            className={`w-4 h-4 transition-transform active:scale-125 ${
              isFavorite ? 'fill-rose-500 text-rose-500' : 'text-slate-300 hover:text-white'
            }`}
          />
        </button>

        {/* Quick Launch Indicator */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="w-12 h-12 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-transform">
            <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
          </div>
        </div>

        {/* Custom Game Marker if created by user */}
        {game.isCustom && (
          <span className="absolute bottom-2 left-2 text-[10px] font-semibold text-amber-300 bg-slate-950/80 px-1.5 py-0.5 rounded-sm">
            USER ADDED
          </span>
        )}
      </div>

      {/* Card Content & Zero-Pill Unboxed Metadata */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Metadata line: Category · Rating · Plays (UNBOXED text with subtle dot separators) */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1.5">
            <span className="font-semibold text-slate-700 dark:text-slate-300">{game.category}</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-0.5 text-amber-500 font-semibold tabular-nums">
              <Star className="w-3 h-3 fill-amber-500 inline" />
              {(game.rating || 5.0).toFixed(1)}
            </span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">{formatPlays(game.plays)} plays</span>
          </div>

          <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors line-clamp-1">
            {game.title}
          </h3>

          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {game.description}
          </p>
        </div>

        {/* Bottom tags & controls hint */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
          <span className="truncate max-w-[200px]">{(game.tags || []).slice(0, 3).join(' · ')}</span>
          <span className="font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap group-hover:text-amber-500 transition-colors">
            Play Now →
          </span>
        </div>
      </div>
    </div>
  );
};
