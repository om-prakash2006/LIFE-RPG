import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Coins, Plus, Check } from 'lucide-react';
import { Quest, QuestCategory, QuestDifficulty } from '../types';
import { CategoryIcon } from './CategoryIcon';

interface QuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (questData: {
    title: string;
    description: string;
    category: QuestCategory;
    difficulty: QuestDifficulty;
    xpReward: number;
    goldReward: number;
    dueDate?: string;
  }) => void;
  initialQuest?: Quest | null;
}

export const QuestModal: React.FC<QuestModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialQuest,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<QuestCategory>('intellect');
  const [difficulty, setDifficulty] = useState<QuestDifficulty>('medium');
  const [xpReward, setXpReward] = useState<number>(40);
  const [goldReward, setGoldReward] = useState<number>(15);
  const [dueDate, setDueDate] = useState('Today');

  useEffect(() => {
    if (initialQuest) {
      setTitle(initialQuest.title);
      setDescription(initialQuest.description);
      setCategory(initialQuest.category);
      setDifficulty(initialQuest.difficulty);
      setXpReward(initialQuest.xpReward);
      setGoldReward(initialQuest.goldReward);
      setDueDate(initialQuest.dueDate || 'Today');
    } else {
      setTitle('');
      setDescription('');
      setCategory('intellect');
      setDifficulty('medium');
      setXpReward(40);
      setGoldReward(15);
      setDueDate('Today');
    }
  }, [initialQuest, isOpen]);

  // Adjust default rewards when difficulty changes
  const handleDifficultyChange = (diff: QuestDifficulty) => {
    setDifficulty(diff);
    if (!initialQuest) {
      if (diff === 'easy') {
        setXpReward(25);
        setGoldReward(10);
      } else if (diff === 'medium') {
        setXpReward(45);
        setGoldReward(20);
      } else if (diff === 'hard') {
        setXpReward(75);
        setGoldReward(35);
      } else if (diff === 'legendary') {
        setXpReward(150);
        setGoldReward(70);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit({
      title: title.trim(),
      description: description.trim() || 'No description provided.',
      category,
      difficulty,
      xpReward: Number(xpReward) || 30,
      goldReward: Number(goldReward) || 10,
      dueDate,
    });

    onClose();
  };

  const categories: { id: QuestCategory; label: string }[] = [
    { id: 'intellect', label: '🧠 Intellect' },
    { id: 'strength', label: '💪 Strength' },
    { id: 'discipline', label: '🔥 Discipline' },
    { id: 'vitality', label: '❤️ Vitality' },
    { id: 'knowledge', label: '📚 Knowledge' },
  ];

  const difficulties: QuestDifficulty[] = ['easy', 'medium', 'hard', 'legendary'];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Dialog */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            className="relative w-full max-w-lg rounded-2xl border border-slate-700/80 bg-[#0f172a] p-6 shadow-2xl z-10 max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-heading uppercase tracking-tight text-slate-100">
                    {initialQuest ? 'Edit Quest' : 'Create New Quest'}
                  </h3>
                  <p className="text-xs text-slate-400">Configure task objectives and experience parameters</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Quest Title */}
              <div>
                <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Quest Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Binary Search Trees"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm font-medium"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="What is required to conquer this objective?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm font-medium"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={`px-3 py-2 rounded-xl text-xs font-heading font-semibold tracking-wide border transition-all text-left flex items-center gap-1.5 ${
                        category === cat.id
                          ? 'bg-indigo-500/15 border-indigo-500/40 text-indigo-300'
                          : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span>{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Difficulty Tier
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {difficulties.map((diff) => (
                    <button
                      key={diff}
                      type="button"
                      onClick={() => handleDifficultyChange(diff)}
                      className={`px-2 py-1.5 rounded-xl text-xs font-heading font-semibold uppercase tracking-wider border text-center transition-all ${
                        difficulty === diff
                          ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                          : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rewards (XP and Gold) */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-indigo-300 mb-1.5 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    XP Reward
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={500}
                    value={xpReward}
                    onChange={(e) => setXpReward(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-indigo-200 font-mono font-bold focus:outline-none focus:border-indigo-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-amber-300 mb-1.5 flex items-center gap-1">
                    <Coins className="w-3.5 h-3.5 text-amber-400" />
                    Gold Reward
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={300}
                    value={goldReward}
                    onChange={(e) => setGoldReward(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-amber-200 font-mono font-bold focus:outline-none focus:border-amber-400 text-sm"
                  />
                </div>
              </div>

              {/* Footer buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-heading uppercase font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-heading uppercase font-semibold tracking-wider bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  {initialQuest ? <Check className="w-4 h-4 stroke-[2.5]" /> : <Plus className="w-4 h-4" />}
                  <span>{initialQuest ? 'Save Changes' : 'Accept Quest'}</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
