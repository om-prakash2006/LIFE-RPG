import React from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface XPBarProps {
  currentXp: number;
  maxXp: number;
  showDetails?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const XPBar: React.FC<XPBarProps> = ({
  currentXp,
  maxXp,
  showDetails = true,
  size = 'md',
  className = '',
}) => {
  const percentage = Math.min(100, Math.round((currentXp / maxXp) * 100));

  const heightClasses = {
    sm: 'h-2',
    md: 'h-3.5',
    lg: 'h-5',
  };

  return (
    <div className={`w-full ${className}`}>
      {showDetails && (
        <div className="flex items-center justify-between text-xs font-semibold mb-1.5 tracking-wider">
          <div className="flex items-center gap-1.5 text-indigo-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="font-heading uppercase tracking-wider text-[11px] text-slate-300">XP Progression</span>
          </div>
          <div className="text-slate-300 font-mono text-xs">
            <span className="text-indigo-300 font-bold">{currentXp}</span>
            <span className="text-slate-600 mx-1">/</span>
            <span className="text-slate-400">{maxXp} XP</span>
            <span className="text-indigo-400/90 ml-2 font-semibold">({percentage}%)</span>
          </div>
        </div>
      )}

      <div className={`w-full bg-slate-950/90 rounded-full p-0.5 border border-slate-800 overflow-hidden shadow-inner ${heightClasses[size]}`}>
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-blue-500 relative overflow-hidden shadow-sm"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {/* Animated subtle shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </motion.div>
      </div>
    </div>
  );
};
