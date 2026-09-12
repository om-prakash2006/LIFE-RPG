import React from 'react';
import { Coins } from 'lucide-react';
import { motion } from 'motion/react';

interface GoldDisplayProps {
  gold: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showPlusBtn?: boolean;
  onPlusClick?: () => void;
}

export const GoldDisplay: React.FC<GoldDisplayProps> = ({
  gold,
  size = 'md',
  className = '',
}) => {
  const sizeStyles = {
    sm: 'text-xs px-2.5 py-1 gap-1.5',
    md: 'text-sm px-3.5 py-1.5 gap-2',
    lg: 'text-base px-4 py-2 gap-2.5',
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <motion.div
      id="gold-indicator"
      whileHover={{ scale: 1.02 }}
      className={`inline-flex items-center rounded-xl font-bold bg-slate-900/90 border border-slate-700/80 hover:border-amber-500/40 text-amber-300 shadow-sm backdrop-blur-md transition-colors ${sizeStyles[size]} ${className}`}
    >
      <div className="relative flex items-center justify-center">
        <Coins className={`${iconSizes[size]} text-amber-400`} />
      </div>
      <span className="font-mono tracking-tight font-bold text-amber-200">
        {gold.toLocaleString()}
      </span>
      <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
        Gold
      </span>
    </motion.div>
  );
};
