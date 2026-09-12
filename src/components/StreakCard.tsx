import React from 'react';
import { motion } from 'motion/react';
import { Flame, Check, Sparkles, ShieldCheck } from 'lucide-react';
import { useGame } from '../context/GameContext';

export const StreakCard: React.FC = () => {
  const { weeklyStreak, user } = useGame();

  return (
    <div
      id="daily-streak-card"
      className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/85 p-5 shadow-sm backdrop-blur-md"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400">
            <Flame className="w-5 h-5 text-orange-400 fill-orange-400" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-heading tracking-wider text-slate-400 font-semibold">
              Weekly Consistency
            </span>
            <h3 className="text-base sm:text-lg font-bold font-heading text-slate-100 uppercase tracking-tight">
              {user.currentStreak} Day Streak
            </h3>
          </div>
        </div>

        <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 font-medium font-mono">
          Best: {user.longestStreak}d
        </span>
      </div>

      {/* Weekday Circles */}
      <div className="grid grid-cols-7 gap-2 my-4">
        {weeklyStreak.map((day) => (
          <div key={day.day} className="flex flex-col items-center gap-1.5">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-bold text-xs transition-all duration-200 border ${
                day.completed
                  ? 'bg-orange-500 border-orange-400/60 text-slate-950 shadow-sm'
                  : day.isToday
                  ? 'bg-indigo-500/15 border-indigo-500/40 text-indigo-300'
                  : 'bg-slate-950/70 border-slate-800 text-slate-600'
              }`}
            >
              {day.completed ? (
                <Check className="w-4 h-4 stroke-[2.5]" />
              ) : day.isToday ? (
                <span className="w-2 h-2 rounded-full bg-indigo-400" />
              ) : (
                <span className="text-[11px] font-mono opacity-40">○</span>
              )}
            </motion.div>
            <span
              className={`text-[10px] font-heading font-medium tracking-wider ${
                day.isToday ? 'text-indigo-300 font-bold' : day.completed ? 'text-slate-300' : 'text-slate-500'
              }`}
            >
              {day.day}
            </span>
          </div>
        ))}
      </div>

      {/* Motivational Subtitle */}
      <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-slate-400 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Daily momentum bonus active.</span>
        </div>
        <div className="flex items-center gap-1 text-slate-400 text-[11px]">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-indigo-300 font-mono font-medium">Multiplier: 1.2x XP</span>
        </div>
      </div>
    </div>
  );
};
