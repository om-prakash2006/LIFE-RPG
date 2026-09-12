import React from 'react';
import { motion } from 'motion/react';
import { Flame, Shield, Sparkles, ChevronRight, Zap } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { XPBar } from './XPBar';
import { GoldDisplay } from './GoldDisplay';
import { Link } from 'react-router-dom';

interface PlayerHeaderProps {
  compact?: boolean;
}

export const PlayerHeader: React.FC<PlayerHeaderProps> = ({ compact = false }) => {
  const { user, triggerLevelUpPreview } = useGame();

  return (
    <div
      id="player-header-card"
      className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/90 p-5 md:p-6 shadow-md backdrop-blur-xl"
    >
      {/* Subtle ambient accent gradient */}
      <div className="absolute top-0 right-0 w-96 h-32 bg-indigo-500/5 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        {/* Left: Avatar & Character Info */}
        <div className="flex items-center gap-4 md:gap-5">
          {/* Avatar with Level Badge */}
          <div className="relative group">
            <div className="w-16 h-16 md:w-18 md:h-18 rounded-2xl p-0.5 border border-slate-700 bg-slate-800 shadow-sm transition-transform duration-200 group-hover:scale-102">
              <img
                src={user.avatarUrl}
                alt={user.username}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-[14px] bg-slate-950"
              />
            </div>

            {/* Level Badge */}
            <div
              id="player-level-badge"
              className="absolute -bottom-2 -right-1 px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 text-[11px] font-bold font-mono tracking-wider shadow-sm border border-amber-300/60"
            >
              LVL {user.level}
            </div>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2.5 mb-1">
              <h2 className="text-xl md:text-2xl font-bold font-heading tracking-tight text-slate-100 uppercase flex items-center gap-2">
                {user.username}
                <span className="text-xs px-2.5 py-0.5 rounded-md bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 font-medium tracking-normal normal-case">
                  {user.classType}
                </span>
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 font-medium flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-slate-300">{user.title}</span>
              <span className="text-slate-600">•</span>
              <span>Realm of Chronos</span>
            </p>
          </div>
        </div>

        {/* Center: XP Progress Bar */}
        <div className="w-full lg:max-w-md flex-1">
          <XPBar currentXp={user.currentXp} maxXp={user.xpToNextLevel} size="md" />
        </div>

        {/* Right: Currency, Streak & Quick Actions */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
          {/* Streak Indicator */}
          <div
            id="streak-indicator-badge"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700/80 text-orange-400 shadow-sm"
          >
            <Flame className="w-4 h-4 text-orange-400 fill-orange-400" />
            <div className="leading-tight">
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Streak</div>
              <div className="text-xs sm:text-sm font-bold text-slate-200 font-mono">{user.currentStreak} Days</div>
            </div>
          </div>

          {/* Gold Indicator */}
          <GoldDisplay gold={user.gold} size="md" />

          {/* Quick test level-up preview trigger */}
          <motion.button
            id="btn-level-up-test"
            whileTap={{ scale: 0.95 }}
            onClick={triggerLevelUpPreview}
            title="Simulate Level Up modal"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-amber-300 transition-colors text-xs flex items-center gap-1.5"
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline font-heading font-medium">Preview Lvl</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
};
