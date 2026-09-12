import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckCircle2,
  Clock,
  Sparkles,
  Coins,
  Edit2,
  Trash2,
  AlertCircle,
  Check,
} from 'lucide-react';
import { Quest } from '../types';
import { CategoryIcon } from './CategoryIcon';
import { useGame } from '../context/GameContext';

interface QuestCardProps {
  quest: Quest;
  onEdit?: (quest: Quest) => void;
  compact?: boolean;
}

export const QuestCard: React.FC<QuestCardProps> = ({ quest, onEdit, compact = false }) => {
  const { completeQuest, deleteQuest } = useGame();
  const [justCompleted, setJustCompleted] = useState(false);

  const difficultyColors = {
    easy: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    medium: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    hard: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    legendary: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  };

  const categoryLabels = {
    intellect: 'Intellect',
    strength: 'Strength',
    discipline: 'Discipline',
    vitality: 'Vitality',
    knowledge: 'Knowledge',
  };

  const handleComplete = () => {
    if (quest.status === 'completed') return;
    setJustCompleted(true);
    completeQuest(quest.id);
  };

  return (
    <motion.div
      id={`quest-card-${quest.id}`}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      className={`relative overflow-hidden rounded-2xl border transition-all duration-200 backdrop-blur-md ${
        quest.status === 'completed'
          ? 'bg-slate-900/50 border-slate-800/80 opacity-75'
          : 'bg-slate-900/85 border-slate-800 hover:border-slate-700 shadow-sm'
      } p-4 sm:p-5`}
    >
      {/* Visual Flash effect upon completion */}
      <AnimatePresence>
        {justCompleted && (
          <motion.div
            initial={{ opacity: 0.5, scale: 0.98 }}
            animate={{ opacity: 0, scale: 1.02 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 bg-emerald-500/15 pointer-events-none rounded-2xl z-20"
          />
        )}
      </AnimatePresence>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Left: Icon & Info */}
        <div className="flex items-start gap-3.5 flex-1">
          {/* Category Icon */}
          <div
            className={`p-3 rounded-xl border flex-shrink-0 transition-all ${
              quest.status === 'completed'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-slate-800/90 border-slate-700/80 text-indigo-400 shadow-sm'
            }`}
          >
            {quest.status === 'completed' ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <CategoryIcon category={quest.category} className="w-5 h-5" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            {/* Badges row */}
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="text-[10px] uppercase font-heading tracking-wider font-semibold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700/80">
                {categoryLabels[quest.category]}
              </span>
              <span
                className={`text-[10px] uppercase font-heading tracking-wider font-semibold px-2 py-0.5 rounded-md border ${
                  difficultyColors[quest.difficulty]
                }`}
              >
                {quest.difficulty}
              </span>
              {quest.dueDate && (
                <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {quest.dueDate}
                </span>
              )}
            </div>

            {/* Title */}
            <h4
              className={`text-base sm:text-lg font-semibold font-heading tracking-tight transition-colors ${
                quest.status === 'completed'
                  ? 'line-through text-slate-400'
                  : 'text-slate-100'
              }`}
            >
              {quest.title}
            </h4>

            {/* Description */}
            {!compact && (
              <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">
                {quest.description}
              </p>
            )}
          </div>
        </div>

        {/* Right: Rewards & Actions */}
        <div className="flex flex-wrap sm:flex-nowrap items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
          {/* Rewards Pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 font-mono text-xs">
            <span className="flex items-center gap-1 text-indigo-300 font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              +{quest.xpReward} XP
            </span>
            <span className="text-slate-600">|</span>
            <span className="flex items-center gap-1 text-amber-300 font-semibold">
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              +{quest.goldReward} Gold
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5">
            {quest.status !== 'completed' ? (
              <motion.button
                id={`btn-complete-quest-${quest.id}`}
                whileTap={{ scale: 0.96 }}
                whileHover={{ scale: 1.01 }}
                onClick={handleComplete}
                className="px-3.5 py-1.5 rounded-xl font-heading uppercase text-xs tracking-wider font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Complete</span>
              </motion.button>
            ) : (
              <span className="px-3 py-1 rounded-xl text-xs font-heading uppercase tracking-wider font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Done
              </span>
            )}

            {/* Edit / Delete buttons */}
            {onEdit && (
              <button
                id={`btn-edit-quest-${quest.id}`}
                onClick={() => onEdit(quest)}
                title="Edit Quest"
                className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-300 hover:bg-slate-800 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}

            <button
              id={`btn-delete-quest-${quest.id}`}
              onClick={() => deleteQuest(quest.id)}
              title="Abandon Quest"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
