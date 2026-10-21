import React from 'react';
import { Play, Sparkles, Zap, ShieldCheck } from 'lucide-react';
import heroArcadeImg from '../assets/images/hero_arcade_vault_1792538500939.jpg';

export const HeroSection = ({
  featuredGames = [],
  onSelectGame,
  onExploreClick,
}) => {
  const primaryFeatured = featuredGames[0];

  return (
    <section className="relative w-full overflow-hidden border-b border-slate-200 dark:border-slate-800 bg-slate-900 text-white">
      {/* Background Image Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroArcadeImg}
          alt="Vintage arcade cabinet lounge"
          className="w-full h-full object-cover object-center opacity-30 dark:opacity-25"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-amber-400 mb-3">
            <Sparkles className="w-4 h-4" />
            <span>UNBLOCKED GAMES VAULT</span>
            <span aria-hidden="true">·</span>
            <span>ZERO ADS</span>
            <span aria-hidden="true">·</span>
            <span>DIRECT IFRAME ENGINE</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white text-balance leading-tight mb-4">
            Play legendary arcade hits, puzzles, and retro classics anywhere.
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mb-8 leading-relaxed">
            Ultra-fast responsive unblocked games portal running entirely within safe sandbox iframes. Fast search, offline play, tab disguise, and keyboard support across every device.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            {primaryFeatured && (
              <button
                onClick={() => onSelectGame(primaryFeatured)}
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-amber-500/20 active:scale-98 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>Play Featured: {primaryFeatured.title}</span>
              </button>
            )}

            <button
              onClick={onExploreClick}
              className="px-5 py-3 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-sm transition-colors cursor-pointer"
            >
              Browse Full Catalog
            </button>
          </div>
        </div>

        {/* Full-width KPI strip below the hero copy */}
        <div className="mt-12 pt-6 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-6 text-slate-300">
          <div>
            <div className="text-2xl font-extrabold text-white tabular-nums">100%</div>
            <div className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Instant Iframe Load</span>
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white tabular-nums">0</div>
            <div className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Annoying Ads & Popups</span>
            </div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white tabular-nums">Desktop + Touch</div>
            <div className="text-xs text-slate-400 mt-1">Responsive Controls</div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white tabular-nums">Stealth Cloak</div>
            <div className="text-xs text-slate-400 mt-1">One-Click Panic Tab</div>
          </div>
        </div>
      </div>
    </section>
  );
};
