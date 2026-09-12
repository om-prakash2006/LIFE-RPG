import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Coins, CheckCircle, Info, X } from 'lucide-react';
import { useGame } from '../context/GameContext';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useGame();

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="pointer-events-auto relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/95 p-4 shadow-xl backdrop-blur-xl flex items-start gap-3"
          >
            {/* Left Icon indicator */}
            <div className="p-2 rounded-xl bg-slate-800 text-indigo-400 border border-slate-700 flex-shrink-0">
              {toast.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              ) : toast.type === 'xp' ? (
                <Sparkles className="w-5 h-5 text-indigo-400" />
              ) : toast.type === 'gold' ? (
                <Coins className="w-5 h-5 text-amber-400" />
              ) : (
                <Info className="w-5 h-5 text-indigo-400" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h5 className="font-heading font-semibold uppercase tracking-wide text-sm text-slate-100">
                {toast.title}
              </h5>
              {toast.description && (
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                  {toast.description}
                </p>
              )}

              {/* Badges for rewards */}
              {(toast.xp || toast.gold) && (
                <div className="flex items-center gap-2 mt-2 font-mono text-xs">
                  {toast.xp && (
                    <span className="px-2 py-0.5 rounded-md bg-indigo-500/15 text-indigo-300 font-semibold border border-indigo-500/25">
                      +{toast.xp} XP
                    </span>
                  )}
                  {toast.gold && (
                    <span
                      className={`px-2 py-0.5 rounded-md font-semibold border ${
                        toast.gold > 0
                          ? 'bg-amber-500/15 text-amber-300 border-amber-500/25'
                          : 'bg-rose-500/15 text-rose-300 border-rose-500/25'
                      }`}
                    >
                      {toast.gold > 0 ? `+${toast.gold}` : toast.gold} Gold
                    </span>
                  )}
                </div>
              )}
            </div>

            <button
              onClick={() => dismissToast(toast.id)}
              className="p-1 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
