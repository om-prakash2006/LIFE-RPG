import React from 'react';
import { motion } from 'motion/react';
import { CharacterStat } from '../types';
import { CategoryIcon } from './CategoryIcon';

interface StatCardProps {
  stat: CharacterStat;
  compact?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({ stat, compact = false }) => {
  const percentage = Math.min(100, Math.round((stat.value / stat.maxValue) * 100));

  const colorVariants: Record<string, { badge: string; bar: string; text: string }> = {
    intellect: {
      badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      bar: 'bg-blue-500',
      text: 'text-blue-400',
    },
    strength: {
      badge: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      bar: 'bg-rose-500',
      text: 'text-rose-400',
    },
    discipline: {
      badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      bar: 'bg-amber-500',
      text: 'text-amber-400',
    },
    vitality: {
      badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      bar: 'bg-emerald-500',
      text: 'text-emerald-400',
    },
    knowledge: {
      badge: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
      bar: 'bg-violet-500',
      text: 'text-violet-400',
    },
  };

  const currentTheme = colorVariants[stat.id] || colorVariants.intellect;

  return (
    <motion.div
      id={`stat-card-${stat.id}`}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="relative overflow-hidden rounded-2xl border border-slate-800 hover:border-slate-700 bg-slate-900/85 p-4.5 transition-all duration-200 backdrop-blur-md shadow-sm"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl border ${currentTheme.badge}`}>
            <CategoryIcon category={stat.id} className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-sm sm:text-base text-slate-100 uppercase tracking-wider">
              {stat.name}
            </h3>
            <span className="text-[11px] font-mono text-slate-400">
              Tier {Math.floor(stat.value / 25) + 1}
            </span>
          </div>
        </div>

        <div className="text-right font-mono">
          <span className={`text-xl font-bold ${currentTheme.text}`}>{stat.value}</span>
          <span className="text-slate-500 text-xs"> / {stat.maxValue}</span>
        </div>
      </div>

      {/* Stat Progress Bar */}
      <div className="w-full bg-slate-950 rounded-full h-2 p-0.5 border border-slate-800 overflow-hidden mb-2.5 shadow-inner">
        <motion.div
          className={`h-full rounded-full ${currentTheme.bar}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        />
      </div>

      {!compact && (
        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
          {stat.description}
        </p>
      )}
    </motion.div>
  );
};
