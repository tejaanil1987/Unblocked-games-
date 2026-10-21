import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  Maximize2,
  Minimize2,
  RotateCw,
  Heart,
  Share2,
  ExternalLink,
  Keyboard,
  Smartphone,
  Star,
  Check,
  Expand,
  Trash2,
} from 'lucide-react';

export const GamePlayer = ({
  game,
  isFavorite,
  onToggleFavorite,
  onBackToCatalog,
  onDeleteCustomGame,
  onSelectGame,
  allGames = [],
}) => {
  const [theaterMode, setTheaterMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const playerContainerRef = useRef(null);
  const iframeRef = useRef(null);

  // Monitor fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Native Fullscreen toggle
  const toggleFullscreen = () => {
    if (!playerContainerRef.current) return;
    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen?.().catch((err) => {
        console.warn('Fullscreen request failed:', err);
      });
    } else {
      document.exitFullscreen?.();
    }
  };

  // Reload the game iframe
  const handleReload = () => {
    setReloadKey((prev) => prev + 1);
  };

  // Share Game URL
  const handleShare = () => {
    const url = `${window.location.origin}${window.location.pathname}#game=${game.slug}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    });
  };

  // Unblocked About:Blank Stealth Cloaking
  const handleOpenAboutBlank = () => {
    const newWin = window.open('about:blank', '_blank');
    if (!newWin) {
      alert('Popup was blocked by your browser. Please allow popups to use Stealth Tab.');
      return;
    }
    const doc = newWin.document;
    doc.title = 'Google Drive - My Drive';
    const link = doc.createElement('link');
    link.rel = 'icon';
    link.href = 'https://ssl.gstatic.com/docs/doclist/images/drive_2022q3_32dp.png';
    doc.head.appendChild(link);

    const bodyStyle = doc.createElement('style');
    bodyStyle.textContent = 'body,html{margin:0;padding:0;width:100%;height:100%;overflow:hidden;background:#090d16;}iframe{border:none;width:100%;height:100%;}';
    doc.head.appendChild(bodyStyle);

    const iframe = doc.createElement('iframe');
    iframe.allow = 'fullscreen; autoplay; keyboard';
    iframe.sandbox = 'allow-scripts allow-same-origin allow-popups allow-forms';

    if (game.iframeSrcDoc) {
      iframe.srcdoc = game.iframeSrcDoc;
    } else if (game.iframeUrl) {
      iframe.src = game.iframeUrl;
    }
    doc.body.appendChild(iframe);
  };

  // Filter similar/related games in same category
  const relatedGames = allGames
    .filter((g) => g.id !== game.id && (g.category === game.category || g.featured))
    .slice(0, 4);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Breadcrumb & Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToCatalog}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Games</span>
          </button>

          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {game.title}
            </h1>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              <span>{game.category}</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-0.5 text-amber-500 font-semibold tabular-nums">
                <Star className="w-3 h-3 fill-amber-500 inline" />
                {(game.rating || 5.0).toFixed(1)}
              </span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">{(game.plays || 0).toLocaleString()} plays</span>
            </div>
          </div>
        </div>

        {/* Action Controls Cluster */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <button
            onClick={(e) => onToggleFavorite(game.id, e)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
              isFavorite
                ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-900 text-rose-600 dark:text-rose-400'
                : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span>{isFavorite ? 'Saved' : 'Save'}</span>
          </button>

          <button
            onClick={handleReload}
            title="Reload game session"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reload</span>
          </button>

          <button
            onClick={() => setTheaterMode(!theaterMode)}
            title="Toggle Theater Mode"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <Expand className="w-3.5 h-3.5" />
            <span>{theaterMode ? 'Standard' : 'Theater'}</span>
          </button>

          <button
            onClick={toggleFullscreen}
            title="Toggle Fullscreen"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors font-bold cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
          </button>

          <button
            onClick={handleOpenAboutBlank}
            title="Open in Stealth about:blank Tab disguised as Google Drive"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 text-white transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Stealth Tab</span>
          </button>

          <button
            onClick={handleShare}
            title="Copy share link"
            className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {copiedShare ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
          </button>

          {game.isCustom && onDeleteCustomGame && (
            <button
              onClick={() => onDeleteCustomGame(game.id)}
              title="Delete this custom game"
              className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20 transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Game Player Frame (Iframe Embed) */}
      <div
        ref={playerContainerRef}
        className={`relative mx-auto rounded-xl overflow-hidden shadow-xl bg-slate-950 border border-slate-800 transition-all duration-300 flex flex-col ${
          theaterMode ? 'w-full max-w-full h-[85vh]' : 'w-full max-w-4xl h-[65vh] min-h-[460px] max-h-[780px]'
        } ${isFullscreen ? 'h-screen w-screen rounded-none border-none' : ''}`}
      >
        <iframe
          key={`${game.id}-${reloadKey}`}
          ref={iframeRef}
          srcDoc={game.iframeSrcDoc || undefined}
          src={!game.iframeSrcDoc && game.iframeUrl ? game.iframeUrl : undefined}
          title={game.title}
          className="w-full h-full border-0 bg-slate-950"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen; keyboard"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          allowFullScreen
        />
      </div>

      {/* Game Details, Controls Guide & Instructions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        {/* Left Column: Description & Instructions */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              About {game.title}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {game.description}
            </p>

            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
              <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                Gameplay Instructions
              </h4>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {game.instructions}
              </p>
            </div>

            <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Tags:</span>
              <span>{(game.tags || []).join(' · ')}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Controls Matrix & Rapid Navigation */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Controls Breakdown
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-1">
                  <Keyboard className="w-4 h-4 text-amber-500" />
                  <span>Desktop Controls</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 font-mono">
                  {game.controls?.desktop || 'Standard keyboard controls'}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-1">
                  <Smartphone className="w-4 h-4 text-indigo-500" />
                  <span>Mobile & Touch</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 font-mono">
                  {game.controls?.mobile || 'Standard touchscreen controls'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Games Shelf */}
      {relatedGames.length > 0 && (
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              More {game.category} Games
            </h3>
            <button
              onClick={onBackToCatalog}
              className="text-xs font-semibold text-amber-500 hover:text-amber-400 cursor-pointer"
            >
              View All Games →
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {relatedGames.map((rg) => (
              <div
                key={rg.id}
                onClick={() => onSelectGame(rg)}
                className="group p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 transition-all cursor-pointer"
              >
                <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-amber-500 line-clamp-1">
                  {rg.title}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {rg.category} · ★ {(rg.rating || 5.0).toFixed(1)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
