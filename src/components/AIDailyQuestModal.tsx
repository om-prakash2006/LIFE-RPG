import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  X,
  Swords,
  Coins,
  Shield,
  Check,
  AlertCircle,
  Dumbbell,
  Brain,
  HeartPulse,
  Users,
  CheckCircle2,
} from 'lucide-react';
import { generateDailyQuests, GeneratedDailyQuest } from '../services/questGenerator';
import { RPGAttribute } from '../services/aiService';
import { useGame } from '../context/GameContext';
import { supabase } from '../supabaseClient';
import { questService } from '../services/questService';
import { QuestCategory, QuestDifficulty } from '../types';

interface AIDailyQuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  characterLevel?: number;
  characterClass?: string;
}

const attributeIcons: Record<RPGAttribute, { icon: React.FC<{ className?: string }>; color: string; bg: string; category: QuestCategory }> = {
  Strength: { icon: Dumbbell, color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/30', category: 'strength' },
  Intellect: { icon: Brain, color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/30', category: 'intellect' },
  Vitality: { icon: HeartPulse, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30', category: 'vitality' },
  Charisma: { icon: Users, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30', category: 'discipline' },
};

const difficultyMap: Record<string, QuestDifficulty> = {
  Easy: 'easy',
  Medium: 'medium',
  Hard: 'hard',
  Epic: 'legendary',
};

export const AIDailyQuestModal: React.FC<AIDailyQuestModalProps> = ({
  isOpen,
  onClose,
  characterLevel = 1,
  characterClass = 'Cyber Sage',
}) => {
  const { addQuest } = useGame();
  const [personalFocus, setPersonalFocus] = useState('');
  const [loading, setLoading] = useState(false);
  const [quests, setQuests] = useState<GeneratedDailyQuest[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([0, 1, 2]);
  const [error, setError] = useState<string | null>(null);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [adding, setAdding] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setAddedSuccess(false);

    try {
      const result = await generateDailyQuests(characterLevel, characterClass, personalFocus);
      setQuests(result);
      setSelectedIndices(result.map((_, i) => i));
    } catch (err: any) {
      console.error('[AIDailyQuestModal] Error:', err);
      setError(err?.message || 'Failed to generate daily quests with Gemini.');
    } finally {
      setLoading(false);
    }
  };

  const toggleSelect = (index: number) => {
    setSelectedIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleAcceptSelected = async () => {
    if (selectedIndices.length === 0) return;

    setAdding(true);
    setError(null);

    try {
      const {
        data: { user: supabaseUser },
      } = await supabase.auth.getUser();

      const selectedQuests = selectedIndices.map((i) => quests[i]).filter(Boolean);

      for (const q of selectedQuests) {
        const category = attributeIcons[q.attribute]?.category || 'discipline';
        const difficulty = difficultyMap[q.difficulty] || 'medium';

        const payload = {
          title: q.title,
          description: q.description,
          category,
          difficulty,
          xpReward: q.xpReward,
          goldReward: q.goldReward,
        };

        if (supabaseUser?.id) {
          await questService.createQuest(supabaseUser.id, payload);
        }
        addQuest(payload);
      }

      setAddedSuccess(true);
      setTimeout(() => {
        onClose();
        setQuests([]);
        setAddedSuccess(false);
      }, 1500);
    } catch (err: any) {
      console.error('[AIDailyQuestModal] Error accepting quests:', err);
      setError('Failed to save quests: ' + (err?.message || 'Unknown error'));
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl rounded-3xl border border-indigo-500/30 bg-slate-900 p-6 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col justify-between"
      >
        {/* Header */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-heading uppercase text-slate-100 flex items-center gap-2">
                  <span>AI Daily Quest Generator</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    AI Powered
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Generate 3 tailored daily productivity quests for your character
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Optional Focus Goal Input */}
          <div className="mt-4 space-y-2">
            <label className="block text-xs font-heading uppercase tracking-wider text-slate-300">
              Optional Today's Focus / Goal
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={personalFocus}
                onChange={(e) => setPersonalFocus(e.target.value)}
                placeholder="e.g. Deep coding work, leg workout, or preparing for presentation..."
                className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGenerate}
                disabled={loading}
                className="px-4 py-2 rounded-xl text-xs font-heading font-semibold uppercase tracking-wider bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
              >
                <Sparkles className="w-4 h-4" />
                <span>{loading ? 'Forging...' : quests.length > 0 ? 'Re-generate' : 'Generate'}</span>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="my-4 overflow-y-auto space-y-3 pr-1 max-h-[45vh]">
          {/* Loading Skeleton */}
          {loading && (
            <div className="p-6 rounded-2xl bg-slate-950/80 border border-indigo-500/20 text-center space-y-4">
              <Sparkles className="w-8 h-8 text-indigo-400 mx-auto animate-spin" />
              <div className="space-y-1">
                <h4 className="text-sm font-heading font-bold text-slate-200 uppercase">
                  Forging Quests...
                </h4>
                <p className="text-xs text-slate-400">
                  Creating 3 daily quests tailored to your focus
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && !loading && (
            <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/40 flex items-start gap-2.5 text-xs text-rose-300">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">{error}</div>
            </div>
          )}

          {/* Empty State */}
          {quests.length === 0 && !loading && !error && (
            <div className="p-8 rounded-2xl bg-slate-950/50 border border-slate-800 text-center space-y-2">
              <Swords className="w-8 h-8 text-slate-500 mx-auto" />
              <p className="text-xs text-slate-400">
                Click "Generate" to forge 3 balanced daily quests tailored to your hero stats.
              </p>
            </div>
          )}

          {/* Generated Quests List */}
          {quests.length > 0 && !loading && (
            <div className="space-y-2.5">
              <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
                <span>Select quests to accept:</span>
                <span>{selectedIndices.length} / {quests.length} selected</span>
              </div>

              {quests.map((quest, index) => {
                const isSelected = selectedIndices.includes(index);
                const meta = attributeIcons[quest.attribute] || attributeIcons.Intellect;
                const Icon = meta.icon;

                return (
                  <div
                    key={index}
                    onClick={() => toggleSelect(index)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-950 border-indigo-500/60 shadow-sm'
                        : 'bg-slate-950/40 border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-5 h-5 rounded-md border mt-0.5 flex items-center justify-center transition-colors ${
                            isSelected ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-slate-700 bg-slate-900'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                        </div>

                        <div>
                          <h4 className="text-sm font-bold font-heading text-slate-100">{quest.title}</h4>
                          <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{quest.description}</p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-heading uppercase font-semibold border ${meta.bg} ${meta.color}`}
                        >
                          <Icon className="w-3 h-3" />
                          <span>{quest.attribute}</span>
                        </span>

                        <div className="flex items-center gap-2 text-[11px] font-mono mt-1">
                          <span className="text-indigo-300 font-bold">+{quest.xpReward} XP</span>
                          <span className="text-amber-300 font-bold flex items-center gap-0.5">
                            <Coins className="w-3 h-3" />
                            +{quest.goldReward}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-heading font-semibold uppercase tracking-wider text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Cancel
          </button>

          {quests.length > 0 && (
            <div>
              {addedSuccess ? (
                <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-heading font-semibold uppercase tracking-wider border border-emerald-500/30">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Quests Added to Log!</span>
                </div>
              ) : (
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={adding || selectedIndices.length === 0}
                  onClick={handleAcceptSelected}
                  className="px-5 py-2.5 rounded-xl text-xs font-heading font-semibold uppercase tracking-wider bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Swords className="w-4 h-4" />
                  <span>
                    {adding
                      ? 'Saving Quests...'
                      : `Accept ${selectedIndices.length} Quest${selectedIndices.length > 1 ? 's' : ''}`}
                  </span>
                </motion.button>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
