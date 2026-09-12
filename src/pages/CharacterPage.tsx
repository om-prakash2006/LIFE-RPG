import React from 'react';
import { motion } from 'motion/react';
import {
  User,
  Shield,
  Crown,
  Sparkles,
  Trophy,
  Flame,
  Award,
  Zap,
  TrendingUp,
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { XPBar } from '../components/XPBar';
import { GoldDisplay } from '../components/GoldDisplay';
import { StatCard } from '../components/StatCard';
import { AchievementCard } from '../components/AchievementCard';
import { PageHeader } from '../components/PageHeader';

export const CharacterPage: React.FC = () => {
  const { user, stats, achievements, inventory, triggerLevelUpPreview } = useGame();

  const unlockedAchievements = achievements.filter((a) => a.isUnlocked);
  const equippedItems = inventory.filter((item) => item.isEquipped);

  return (
    <div className="space-y-8 pb-16">
      <PageHeader
        tag="Profile"
        title="Character Profile"
        subtitle="Review your stats, progression, equipped gear, and milestones."
        actionButton={
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={triggerLevelUpPreview}
            className="px-3.5 py-2 rounded-xl text-xs font-heading font-semibold uppercase tracking-wider bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Simulate Level Up</span>
          </motion.button>
        }
      />

      {/* Main Character Hero Card */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 shadow-sm relative overflow-hidden backdrop-blur-xl">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Avatar and Identity (4 cols) */}
          <div className="lg:col-span-4 flex flex-col items-center text-center pb-6 lg:pb-0 lg:border-r border-slate-800">
            <div className="relative group mb-4">
              <div className="w-28 h-28 rounded-2xl p-0.5 bg-slate-800 border border-slate-700">
                <img
                  src={user.avatarUrl}
                  alt={user.username}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-[14px] bg-slate-950"
                />
              </div>
              <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-lg bg-amber-500 text-slate-950 text-xs font-bold font-heading uppercase tracking-wider shadow-sm">
                Level {user.level}
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold font-heading uppercase tracking-tight text-slate-100 mt-2">
              {user.username}
            </h2>
            <div className="text-sm font-semibold text-indigo-400 font-mono flex items-center gap-1.5 mt-0.5">
              <Shield className="w-4 h-4 text-indigo-400" />
              <span>{user.title}</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">Class: {user.classType}</p>

            <div className="mt-4 flex items-center gap-2.5">
              <GoldDisplay gold={user.gold} size="sm" />
              <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold font-mono flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {user.currentStreak}d Streak
              </span>
            </div>
          </div>

          {/* Character Progress & XP (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-heading font-semibold uppercase tracking-wider text-slate-400">
                  Level Progression
                </span>
                <span className="text-xs font-mono text-slate-300">
                  Level {user.level} → Level {user.level + 1}
                </span>
              </div>
              <XPBar currentXp={user.currentXp} maxXp={user.xpToNextLevel} size="lg" />
            </div>

            {/* Lifetime Stats Quick Bento */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="text-[10px] font-heading font-medium uppercase tracking-wider text-slate-400">
                  Total XP Earned
                </div>
                <div className="text-lg sm:text-xl font-bold font-mono text-indigo-300 mt-0.5">
                  {user.totalXpEarned.toLocaleString()}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="text-[10px] font-heading font-medium uppercase tracking-wider text-slate-400">
                  Quests Done
                </div>
                <div className="text-lg sm:text-xl font-bold font-mono text-emerald-300 mt-0.5">
                  {user.totalQuestsCompleted}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="text-[10px] font-heading font-medium uppercase tracking-wider text-slate-400">
                  Longest Streak
                </div>
                <div className="text-lg sm:text-xl font-bold font-mono text-amber-300 mt-0.5">
                  {user.longestStreak} Days
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="text-[10px] font-heading font-medium uppercase tracking-wider text-slate-400">
                  Equipped Gear
                </div>
                <div className="text-lg sm:text-xl font-bold font-mono text-slate-200 mt-0.5">
                  {equippedItems.length} Items
                </div>
              </div>
            </div>

            {/* Currently Equipped Gear preview */}
            <div>
              <span className="text-xs font-heading font-semibold uppercase tracking-wider text-slate-400 mb-2 block">
                Active Loadout
              </span>
              {equippedItems.length > 0 ? (
                <div className="flex flex-wrap items-center gap-2">
                  {equippedItems.map((eq) => (
                    <div
                      key={eq.id}
                      className="px-3 py-1.5 rounded-xl bg-slate-950 border border-indigo-500/30 text-xs flex items-center gap-2 text-slate-200 font-medium"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                      <span>{eq.name}</span>
                      <span className="text-[10px] font-mono text-indigo-400">+{eq.statBonus?.amount}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">
                  No gear currently equipped. Visit the Shop to acquire items with gold earned from completed quests.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Character Stats */}
      <section className="space-y-4">
        <div>
          <span className="text-[10px] font-mono font-medium uppercase tracking-wider text-indigo-400">
            Stats
          </span>
          <h3 className="text-xl sm:text-2xl font-bold font-heading uppercase tracking-tight text-slate-100">
            Character Stats
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.map((stat) => (
            <StatCard key={stat.id} stat={stat} />
          ))}
        </div>
      </section>

      {/* Achievements Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div>
            <span className="text-[10px] font-mono font-medium uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5" /> Milestones
            </span>
            <h3 className="text-xl sm:text-2xl font-bold font-heading uppercase tracking-tight text-slate-100">
              Heroic Achievements
            </h3>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 font-semibold">
            {unlockedAchievements.length} / {achievements.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((ach) => (
            <AchievementCard key={ach.id} achievement={ach} />
          ))}
        </div>
      </section>
    </div>
  );
};
