import React from 'react';
import { Gamepad2, Keyboard } from 'lucide-react';

export const Footer = ({ onBackToTop, onOpenAddModal }) => {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-8 text-slate-500 dark:text-slate-400 text-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Gamepad2 className="w-4 h-4 text-amber-500" />
          <span className="font-bold text-slate-900 dark:text-slate-100">Nexus Arcade</span>
          <span>— Unblocked HTML5 & Iframe Gaming Portal</span>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
            <Keyboard className="w-3.5 h-3.5" />
            <span>Shortcuts: Press <kbd className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border font-mono text-[10px]">/</kbd> Search · <kbd className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border font-mono text-[10px]">[</kbd> Panic</span>
          </div>

          <button
            onClick={onOpenAddModal}
            className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            Submit Game
          </button>

          <button
            onClick={onBackToTop}
            className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            Back to Top ↑
          </button>
        </div>
      </div>
    </footer>
  );
};
