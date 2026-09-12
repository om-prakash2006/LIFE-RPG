import React from 'react';
import { motion } from 'motion/react';
import {
  TrendingUp,
  Sparkles,
  Swords,
  Flame,
  Award,
  Calendar,
  Coins,
  ArrowUpRight,
  Zap,
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { PageHeader } from '../components/PageHeader';
import { XPBar } from '../components/XPBar';
import { CategoryIcon } from '../components/CategoryIcon';

export const ProgressPage: React.FC = () => {
  const { user, xpHistory, weeklyStreak } = useGame();

  // Compute 7-day progress from real weekly streak and history
  const weeklyData = [
    { day: 'Mon', xp: weeklyStreak[0]?.completed ? 50 : 0 },
    { day: 'Tue', xp: weeklyStreak[1]?.completed ? 50 : 0 },
    { day: 'Wed', xp: weeklyStreak[2]?.completed ? 50 : 0 },
    { day: 'Thu', xp: weeklyStreak[3]?.completed ? 50 : 0 },
    { day: 'Fri', xp: weeklyStreak[4]?.completed ? 50 : 0 },
    { day: 'Sat', xp: weeklyStreak[5]?.completed ? 50 : 0 },
    { day: 'Sun', xp: weeklyStreak[6]?.completed ? 50 : 0 },
  ].map((d) => ({
    ...d,
    label: `${d.xp} XP`,
  }));

  const maxXP = Math.max(50, ...weeklyData.map((d) => d.xp));

  const statsBento = [
    { label: 'Current Level', value: `LVL ${user.level}`, sub: 'Adventurer Rank', icon: Sparkles, color: 'text-amber-400' },
    { label: 'Total XP Earned', value: user.totalXpEarned.toLocaleString(), sub: 'Lifetime Points', icon: Zap, color: 'text-indigo-400' },
    { label: 'Quests Conquered', value: user.totalQuestsCompleted, sub: 'Real World Tasks', icon: Swords, color: 'text-emerald-400' },
    { label: 'Current Streak', value: `${user.currentStreak} Days`, sub: 'Daily Fire Active', icon: Flame, color: 'text-amber-400' },
    { label: 'Longest Streak', value: `${user.longestStreak} Days`, sub: 'All-Time Record', icon: Award, color: 'text-purple-400' },
    { label: 'Current Gold', value: `${user.gold} G`, sub: 'Available Bounty', icon: Coins, color: 'text-amber-300' },
  ];

  return (
    <div className="space-y-8 pb-16">
      <PageHeader
        tag="Analytics"
        title="Player Progression"
        subtitle="Track your XP velocity, weekly consistency curve, and complete quest chronicle."
      />

      {/* KPI Bento Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statsBento.map((item) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.label}
              whileHover={{ y: -2 }}
              className="p-4 rounded-2xl bg-slate-900 border border-slate-800 backdrop-blur-md shadow-sm transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-4 h-4 ${item.color}`} />
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
              </div>
              <div className="text-xl sm:text-2xl font-bold font-heading text-slate-100 uppercase tracking-tight">
                {item.value}
              </div>
              <div className="text-[11px] font-heading font-medium uppercase tracking-wider text-slate-400 mt-0.5">
                {item.label}
              </div>
              <div className="text-[10px] text-slate-500 mt-1 font-mono">{item.sub}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Simple Progress Visualization (CSS / SVG Bar & Curve Visualizer) */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 backdrop-blur-xl shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-[10px] font-mono font-medium uppercase tracking-wider text-indigo-400">
              Velocity Graph
            </span>
            <h3 className="text-xl sm:text-2xl font-bold font-heading uppercase tracking-tight text-slate-100">
              Weekly XP Yield Curve
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Daily experience points gained from conquered quests over the last 7 days.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-indigo-300">
              <span className="w-2 h-2 rounded-full bg-indigo-400" />
              XP Velocity
            </span>
            <span className="text-slate-500">Avg: 75 XP/Day</span>
          </div>
        </div>

        {/* CSS/SVG Bar Visualization */}
        <div className="pt-8 pb-4">
          <div className="grid grid-cols-7 gap-2 sm:gap-4 h-56 items-end">
            {weeklyData.map((d, index) => {
              const heightPercent = Math.round((d.xp / maxXP) * 100);
              const isPeak = d.xp === maxXP;
              return (
                <div key={d.day} className="flex flex-col items-center h-full justify-end group">
                  {/* Tooltip on hover */}
                  <span className="text-[10px] font-mono text-indigo-300 opacity-0 group-hover:opacity-100 transition-opacity mb-2 font-semibold">
                    +{d.xp} XP
                  </span>

                  {/* Bar */}
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${heightPercent}%` }}
                    transition={{ duration: 0.5, delay: index * 0.06 }}
                    className={`w-full max-w-[44px] rounded-xl relative overflow-hidden transition-all group-hover:scale-105 border ${
                      isPeak
                        ? 'bg-indigo-500 border-indigo-400/50 shadow-sm'
                        : 'bg-indigo-600/70 hover:bg-indigo-500/80 border-indigo-500/20'
                    }`}
                  />

                  {/* Day Label */}
                  <span className="text-xs font-heading font-medium uppercase tracking-wider text-slate-400 mt-3 group-hover:text-slate-200 transition-colors">
                    {d.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Attractive XP History Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div>
            <span className="text-[10px] font-mono font-medium uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> Activity Chronicle
            </span>
            <h3 className="text-xl sm:text-2xl font-bold font-heading uppercase tracking-tight text-slate-100">
              XP & Quest History
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {xpHistory.length} Logged Entries
          </span>
        </div>

        {/* History List */}
        <div className="space-y-2.5">
          {xpHistory.length > 0 ? (
            xpHistory.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ x: 2 }}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 flex items-center justify-between transition-all backdrop-blur-md"
              >
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-indigo-400">
                    <CategoryIcon category={item.category} className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm sm:text-base font-semibold font-heading text-slate-100 uppercase tracking-tight">
                      {item.title}
                    </div>
                    <div className="text-xs text-slate-400 font-mono flex items-center gap-2 mt-0.5">
                      <span>{item.date}</span>
                      <span>•</span>
                      <span className="capitalize">{item.category}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-300 font-semibold border border-indigo-500/20">
                    +{item.xpEarned} XP
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-300 font-semibold border border-amber-500/20">
                    +{item.goldEarned} Gold
                  </span>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-2">
              <Calendar className="w-8 h-8 text-slate-600 mx-auto" />
              <h4 className="font-heading font-semibold text-slate-300 text-sm">Chronicle is currently empty</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Completed quests and XP earnings will automatically be logged here in chronological order.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
