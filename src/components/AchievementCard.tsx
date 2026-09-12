import React from 'react';
import { motion } from 'motion/react';
import { Lock, Sparkles, Check } from 'lucide-react';
import { Achievement } from '../types';
import { CategoryIcon } from './CategoryIcon';

interface AchievementCardProps {
  achievement: Achievement;
}

export const AchievementCard: React.FC<AchievementCardProps> = ({ achievement }) => {
  return (
    <motion.div
      id={`achievement-${achievement.id}`}
      whileHover={{ y: -2 }}
      className={`relative overflow-hidden rounded-2xl border p-4 transition-all duration-200 backdrop-blur-md ${
        achievement.isUnlocked
          ? 'bg-slate-900/90 border-slate-800 hover:border-slate-700 shadow-sm'
          : 'bg-slate-950/50 border-slate-850 opacity-60'
      }`}
    >
      <div className="flex items-start gap-3.5">
        {/* Icon */}
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center border flex-shrink-0 transition-transform ${
            achievement.isUnlocked
              ? 'bg-amber-500/10 border-amber-500/25 text-amber-400'
              : 'bg-slate-800/80 border-slate-700 text-slate-500'
          }`}
        >
          {achievement.isUnlocked ? (
            <CategoryIcon iconName={achievement.icon} className="w-5 h-5" />
          ) : (
            <Lock className="w-4 h-4 text-slate-500" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h4 className="text-sm sm:text-base font-semibold font-heading text-slate-100 uppercase tracking-tight truncate">
              {achievement.title}
            </h4>
            {achievement.isUnlocked ? (
              <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <Check className="w-3 h-3 stroke-[2.5]" /> Unlocked
              </span>
            ) : (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700 flex items-center gap-1">
                <Lock className="w-3 h-3" /> Locked
              </span>
            )}
          </div>

          <p className="text-xs text-slate-400 leading-relaxed mb-2">
            {achievement.description}
          </p>

          <div className="flex items-center justify-between text-[11px] font-mono pt-2 border-t border-slate-800">
            <span className="text-amber-400 font-medium flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              +{achievement.rewardXp} XP
            </span>
            {achievement.unlockedAt && (
              <span className="text-slate-500">{achievement.unlockedAt}</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
