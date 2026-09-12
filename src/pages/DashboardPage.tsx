import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import {
  Swords,
  Plus,
  ArrowRight,
  Trophy,
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { PlayerHeader } from '../components/PlayerHeader';
import { StatCard } from '../components/StatCard';
import { QuestCard } from '../components/QuestCard';
import { StreakCard } from '../components/StreakCard';
import { AchievementCard } from '../components/AchievementCard';
import { QuestModal } from '../components/QuestModal';
import { DashboardSkeleton } from '../components/DashboardSkeleton';
import { AITaskInput } from '../components/AITaskInput';
import { AIDailyQuestModal } from '../components/AIDailyQuestModal';
import { Quest } from '../types';
import { Sparkles } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user, stats, quests, achievements, addQuest, isDataLoading } = useGame();
  const [modalOpen, setModalOpen] = useState(false);
  const [aiQuestModalOpen, setAiQuestModalOpen] = useState(false);
  const [editingQuest, setEditingQuest] = useState<Quest | null>(null);

  // Filter Today's Quests for the dashboard
  const todaysQuests = quests.slice(0, 4);
  const completedCount = quests.filter((q) => q.status === 'completed').length;

  // Recent achievements (first 3)
  const recentAchievements = achievements.filter((a) => a.isUnlocked).slice(0, 3);

  const handleCreateQuest = (questData: any) => {
    addQuest(questData);
  };

  if (isDataLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Player Header Component */}
      <PlayerHeader />

      {/* 2. Character Stats Section */}
      <section id="character-stats-section">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[10px] font-mono font-medium uppercase tracking-wider text-indigo-400">
              Stats
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-heading uppercase tracking-tight text-slate-100">
              Character Statistics
            </h2>
          </div>

          <Link
            to="/character"
            className="text-xs font-heading font-medium uppercase tracking-wider text-indigo-400 hover:text-indigo-300 flex items-center gap-1 group transition-colors"
          >
            <span>Full Profile</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Responsive Grid for 4-5 Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.slice(0, 4).map((stat) => (
            <StatCard key={stat.id} stat={stat} />
          ))}
        </div>
      </section>

      {/* 3. Two-Column Layout: Today's Quests (Left) & Streak + Achievements (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Today's Quests (7 cols on lg) */}
        <section id="todays-quests-section" className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-mono font-medium uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                <Swords className="w-3.5 h-3.5" /> Daily Objectives
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-heading uppercase tracking-tight text-slate-100">
                Today's Quests
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                <span className="text-emerald-400 font-semibold">{completedCount}</span> / {todaysQuests.length} Done
              </span>

              <motion.button
                id="btn-ai-daily-quests-dash"
                whileTap={{ scale: 0.95 }}
                onClick={() => setAiQuestModalOpen(true)}
                className="px-3 py-1.5 rounded-xl text-xs font-heading font-semibold uppercase tracking-wider bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>AI Quests</span>
              </motion.button>

              <motion.button
                id="btn-create-quest-dash"
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setEditingQuest(null);
                  setModalOpen(true);
                }}
                className="px-3.5 py-1.5 rounded-xl text-xs font-heading font-semibold uppercase tracking-wider bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-all flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>New Quest</span>
              </motion.button>
            </div>
          </div>

          {/* AI Task Analyzer Component */}
          <AITaskInput />

          {/* List of Today's Quests */}
          <div className="space-y-3">
            {todaysQuests.length > 0 ? (
              todaysQuests.map((quest) => (
                <QuestCard
                  key={quest.id}
                  quest={quest}
                  onEdit={(q) => {
                    setEditingQuest(q);
                    setModalOpen(true);
                  }}
                />
              ))
            ) : (
              <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
                <div className="w-12 h-12 rounded-xl bg-indigo-950/60 border border-indigo-800/40 text-indigo-400 mx-auto flex items-center justify-center">
                  <Swords className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-heading font-bold text-slate-200">No active quests in your realm</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Create your first quest to start earning XP, gold, and leveling up your stats!
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingQuest(null);
                    setModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-heading font-semibold uppercase tracking-wider bg-indigo-600 hover:bg-indigo-500 text-white transition-colors cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create First Quest</span>
                </button>
              </div>
            )}
          </div>

          <div className="pt-2 text-center">
            <Link
              to="/quests"
              className="inline-flex items-center gap-1.5 text-xs font-heading font-medium uppercase tracking-wider text-slate-400 hover:text-indigo-300 transition-colors py-2 px-4 rounded-xl hover:bg-slate-900 border border-transparent hover:border-slate-800"
            >
              <span>View all quest logs ({quests.length} Total)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

        {/* Right Column: Weekly Streak & Recent Achievements (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Daily Streak Card */}
          <StreakCard />

          {/* Recent Achievements */}
          <section id="recent-achievements-section" className="space-y-3">
            <div className="flex items-center justify-between pb-1">
              <div>
                <span className="text-[10px] font-mono font-medium uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5" /> Milestones
                </span>
                <h3 className="text-lg font-bold font-heading uppercase tracking-tight text-slate-100">
                  Recent Achievements
                </h3>
              </div>

              <Link
                to="/character"
                className="text-xs font-heading font-medium uppercase tracking-wider text-amber-400 hover:text-amber-300 transition-colors"
              >
                View All
              </Link>
            </div>

            <div className="space-y-2.5">
              {recentAchievements.map((ach) => (
                <AchievementCard key={ach.id} achievement={ach} />
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Quest Creation/Edit Modal */}
      <QuestModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingQuest(null);
        }}
        onSubmit={handleCreateQuest}
        initialQuest={editingQuest}
      />

      {/* AI Daily Quest Generator Modal */}
      <AIDailyQuestModal
        isOpen={aiQuestModalOpen}
        onClose={() => setAiQuestModalOpen(false)}
        characterLevel={user.level}
        characterClass={user.classType}
      />
    </div>
  );
};
