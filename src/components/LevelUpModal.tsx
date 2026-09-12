import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Crown, Sparkles, Zap, Award, ArrowRight, X } from 'lucide-react';
import { useGame } from '../context/GameContext';

export const LevelUpModal: React.FC = () => {
  const { levelUpData, closeLevelUpModal, user } = useGame();

  if (!levelUpData?.isShowing) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeLevelUpModal}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 15 }}
          transition={{ type: 'spring', damping: 22, stiffness: 320 }}
          className="relative w-full max-w-md rounded-3xl border border-amber-500/30 bg-[#0f172a] p-6 sm:p-8 text-center shadow-2xl z-10 overflow-hidden"
        >
          {/* Subtle warm accent */}
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={closeLevelUpModal}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Crown & Badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.15, type: 'spring' }}
            className="w-18 h-18 mx-auto mb-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-sm"
          >
            <Crown className="w-9 h-9 fill-amber-400/20 text-amber-400" />
          </motion.div>

          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-amber-400">
            Ascension Achieved
          </span>

          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading uppercase tracking-tight text-slate-100 mt-1 mb-2">
            Level Up!
          </h2>

          <p className="text-xs sm:text-sm text-slate-400 mb-6 font-medium">
            Your diligence in the real world has forged greater discipline and capacity.
          </p>

          {/* Level Transition Pill */}
          <div className="flex items-center justify-center gap-6 py-3 px-6 rounded-2xl bg-slate-900 border border-slate-800 mb-6">
            <div className="text-center font-mono">
              <div className="text-[10px] text-slate-500 uppercase font-heading font-medium">Previous</div>
              <div className="text-xl font-bold text-slate-400">LVL {levelUpData.oldLevel}</div>
            </div>

            <ArrowRight className="w-5 h-5 text-amber-400" />

            <div className="text-center font-mono">
              <div className="text-[10px] text-amber-400 uppercase font-heading font-semibold">Current</div>
              <div className="text-2xl font-bold text-amber-300">
                LVL {levelUpData.newLevel}
              </div>
            </div>
          </div>

          {/* Reward Perks Unlocked */}
          <div className="space-y-2 mb-6 text-left">
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-3 text-xs">
              <Sparkles className="w-4 h-4 text-indigo-400 flex-shrink-0" />
              <span className="text-slate-300 font-medium">
                Max XP capacity raised & Energy refreshed
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-3 text-xs">
              <Award className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span className="text-slate-300 font-medium">
                +50 Bonus Gold added to your character wallet
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-3 text-xs">
              <Zap className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span className="text-slate-300 font-medium">
                All stats boosted by +4%
              </span>
            </div>
          </div>

          {/* Claim Action Button */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={closeLevelUpModal}
            className="w-full py-3 px-6 rounded-xl font-heading font-semibold uppercase tracking-wider text-xs sm:text-sm bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-sm transition-all cursor-pointer"
          >
            Claim Rewards & Continue
          </motion.button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
