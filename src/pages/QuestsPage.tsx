import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Swords,
  Plus,
  Filter,
  Search,
  Sparkles,
  CheckCircle2,
  Clock,
  Layers,
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { QuestCard } from '../components/QuestCard';
import { QuestModal } from '../components/QuestModal';
import { PageHeader } from '../components/PageHeader';
import { AITaskInput } from '../components/AITaskInput';
import { AIDailyQuestModal } from '../components/AIDailyQuestModal';
import { Quest, QuestCategory } from '../types';

type FilterStatus = 'all' | 'today' | 'active' | 'completed';

export const QuestsPage: React.FC = () => {
  const { user, quests, addQuest, editQuest } = useGame();
  const [modalOpen, setModalOpen] = useState(false);
  const [aiQuestModalOpen, setAiQuestModalOpen] = useState(false);
  const [showAiInput, setShowAiInput] = useState(false);
  const [editingQuest, setEditingQuest] = useState<Quest | null>(null);
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories: { id: string; label: string }[] = [
    { id: 'all', label: 'All Categories' },
    { id: 'intellect', label: '🧠 Intellect' },
    { id: 'strength', label: '💪 Strength' },
    { id: 'discipline', label: '🔥 Discipline' },
    { id: 'vitality', label: '❤️ Vitality' },
    { id: 'knowledge', label: '📚 Knowledge' },
  ];

  const filteredQuests = quests.filter((q) => {
    // Status filter
    if (statusFilter === 'active' && q.status !== 'active') return false;
    if (statusFilter === 'completed' && q.status !== 'completed') return false;
    if (statusFilter === 'today' && q.dueDate !== 'Today') return false;

    // Category filter
    if (categoryFilter !== 'all' && q.category !== categoryFilter) return false;

    // Search query
    if (searchQuery.trim()) {
      const qLower = searchQuery.toLowerCase();
      return (
        q.title.toLowerCase().includes(qLower) ||
        q.description.toLowerCase().includes(qLower)
      );
    }

    return true;
  });

  const activeCount = quests.filter((q) => q.status === 'active').length;
  const completedCount = quests.filter((q) => q.status === 'completed').length;

  const handleModalSubmit = (questData: any) => {
    if (editingQuest) {
      editQuest(editingQuest.id, questData);
    } else {
      addQuest(questData);
    }
    setEditingQuest(null);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <PageHeader
        tag="Mission Hub"
        title="Quests"
        subtitle="Every real-life task you complete powers up your avatar with XP, gold, and discipline."
        actionButton={
          <div className="flex items-center gap-2 flex-wrap">
            <motion.button
              id="btn-ai-daily-quests-main"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setAiQuestModalOpen(true)}
              className="px-3.5 py-2.5 rounded-xl font-heading font-semibold uppercase tracking-wider text-xs sm:text-sm bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>AI Quests</span>
            </motion.button>

            <motion.button
              id="btn-toggle-ai-analyzer"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowAiInput((prev) => !prev)}
              className={`px-3.5 py-2.5 rounded-xl font-heading font-semibold uppercase tracking-wider text-xs sm:text-sm border transition-all flex items-center gap-1.5 cursor-pointer ${
                showAiInput
                  ? 'bg-indigo-600 text-white border-indigo-500'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>{showAiInput ? 'Hide AI Analyzer' : 'AI Task Input'}</span>
            </motion.button>

            <motion.button
              id="btn-create-quest-main"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setEditingQuest(null);
                setModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl font-heading font-semibold uppercase tracking-wider text-xs sm:text-sm bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm flex items-center gap-2 cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Create Quest</span>
            </motion.button>
          </div>
        }
      />

      {/* AI Task Analyzer Collapsible Section */}
      <AnimatePresence>
        {showAiInput && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <AITaskInput />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-heading uppercase font-medium">Total Quests</span>
          <span className="text-lg font-bold font-mono text-slate-100">{quests.length}</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <span className="text-xs text-indigo-400 font-heading uppercase font-medium">Active</span>
          <span className="text-lg font-bold font-mono text-indigo-300">{activeCount}</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <span className="text-xs text-emerald-400 font-heading uppercase font-medium">Completed</span>
          <span className="text-lg font-bold font-mono text-emerald-300">{completedCount}</span>
        </div>
        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <span className="text-xs text-amber-400 font-heading uppercase font-medium">Total Yield</span>
          <span className="text-lg font-bold font-mono text-amber-300">
            {quests.reduce((acc, q) => acc + q.xpReward, 0)} XP
          </span>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Status Filters */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {(['all', 'today', 'active', 'completed'] as FilterStatus[]).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-heading font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                  statusFilter === st
                    ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-transparent'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search quest log..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-slate-800 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-3 py-1 rounded-lg text-xs font-heading font-medium tracking-wide whitespace-nowrap transition-all ${
                categoryFilter === cat.id
                  ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-950/60 border border-transparent'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Quests Cards List */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredQuests.length > 0 ? (
            filteredQuests.map((quest) => (
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
            <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-slate-800 bg-slate-900/30">
              <Swords className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h4 className="text-base font-bold font-heading uppercase text-slate-300">
                No Quests Found
              </h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                No active quests match your current search and filter selections.
              </p>
              <button
                onClick={() => {
                  setStatusFilter('all');
                  setCategoryFilter('all');
                  setSearchQuery('');
                }}
                className="mt-4 px-4 py-2 rounded-xl text-xs font-heading font-semibold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Modal */}
      <QuestModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingQuest(null);
        }}
        onSubmit={handleModalSubmit}
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
