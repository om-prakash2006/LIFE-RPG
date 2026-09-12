import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Dumbbell,
  Brain,
  HeartPulse,
  Users,
  Coins,
  Shield,
  Check,
  AlertCircle,
  ArrowRight,
  RotateCcw,
  Zap,
  CheckCircle2,
} from 'lucide-react';
import { analyzeTaskWithAI, AnalyzedTask, RPGAttribute, DifficultyTier } from '../services/aiService';
import { questService } from '../services/questService';
import { supabase } from '../supabaseClient';
import { useGame } from '../context/GameContext';
import { QuestCategory, QuestDifficulty } from '../types';

interface AITaskInputProps {
  onTaskSaved?: (task: AnalyzedTask) => void;
  className?: string;
}

const attributeMeta: Record<
  RPGAttribute,
  { icon: React.FC<{ className?: string }>; label: string; color: string; bg: string; border: string; category: QuestCategory }
> = {
  Strength: {
    icon: Dumbbell,
    label: 'Strength',
    color: 'text-rose-400',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/30',
    category: 'strength',
  },
  Intellect: {
    icon: Brain,
    label: 'Intellect',
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/30',
    category: 'intellect',
  },
  Vitality: {
    icon: HeartPulse,
    label: 'Vitality',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    category: 'vitality',
  },
  Charisma: {
    icon: Users,
    label: 'Charisma',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    category: 'discipline',
  },
};

const difficultyMap: Record<DifficultyTier, QuestDifficulty> = {
  Trivial: 'easy',
  Easy: 'easy',
  Medium: 'medium',
  Hard: 'hard',
  Epic: 'legendary',
};

const examplePresets = [
  'Ran 5 miles and did 50 pushups',
  'Studied React and TypeScript architecture for 2 hours',
  'Drank 2L water and completed 20 minutes mindfulness meditation',
  'Led product sprint planning and mentored junior teammate',
];

export const AITaskInput: React.FC<AITaskInputProps> = ({ onTaskSaved, className = '' }) => {
  const { addQuest } = useGame();
  const [input, setInput] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzedTask, setAnalyzedTask] = useState<AnalyzedTask | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanText = input.trim();
    if (!cleanText) return;

    setAnalyzing(true);
    setError(null);
    setSavedSuccess(false);
    setAnalyzedTask(null);

    try {
      const result = await analyzeTaskWithAI(cleanText);
      setAnalyzedTask(result);
    } catch (err: any) {
      console.error('[AITaskInput] AI Analysis failed:', err);
      setError(err?.message || 'Failed to analyze task with Gemini. Please check your API key.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSaveToSupabase = async (markCompleted: boolean = false) => {
    if (!analyzedTask) return;

    setSaving(true);
    setError(null);

    try {
      const category = attributeMeta[analyzedTask.attribute]?.category || 'discipline';
      const difficulty = difficultyMap[analyzedTask.difficulty] || 'medium';

      // 1. Get current Supabase authenticated user
      const {
        data: { user: supabaseUser },
      } = await supabase.auth.getUser();

      const questPayload = {
        title: analyzedTask.title,
        description: analyzedTask.description || input,
        category,
        difficulty,
        xpReward: analyzedTask.xpReward,
        goldReward: analyzedTask.goldReward,
      };

      // 2. Persist to Supabase if authenticated
      if (supabaseUser?.id) {
        await questService.createQuest(supabaseUser.id, questPayload);
      }

      // 3. Update local GameContext state
      addQuest(questPayload);

      setSavedSuccess(true);
      if (onTaskSaved) {
        onTaskSaved(analyzedTask);
      }

      // Reset input after slight delay
      setTimeout(() => {
        setInput('');
        setAnalyzedTask(null);
        setSavedSuccess(false);
      }, 2500);
    } catch (err: any) {
      console.error('[AITaskInput] Save error:', err);
      setError('Failed to save task: ' + (err?.message || 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setAnalyzedTask(null);
    setError(null);
    setSavedSuccess(false);
  };

  return (
    <div
      id="ai-task-analyzer-container"
      className={`rounded-2xl border border-indigo-500/20 bg-gradient-to-b from-slate-900/95 to-slate-950/95 p-5 sm:p-6 shadow-xl backdrop-blur-md ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold font-heading uppercase tracking-wide text-slate-100 flex items-center gap-2">
              <span>AI Task Analyzer</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                AI Powered
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Type any activity to automatically calculate XP, rewards, and category
            </p>
          </div>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleAnalyze} className="space-y-3">
        <div className="relative">
          <textarea
            id="input-ai-task-text"
            rows={2}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. Ran 5 miles on the track and studied React for 2 hours..."
            disabled={analyzing || saving}
            className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700/80 text-slate-100 placeholder-slate-500 text-sm font-medium focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none disabled:opacity-60 transition-all"
          />

          <div className="flex items-center justify-between mt-2">
            {/* Quick Presets */}
            <div className="hidden sm:flex items-center gap-1.5 overflow-x-auto text-[11px] text-slate-400">
              <span className="text-slate-500 text-[10px] uppercase font-mono">Try:</span>
              {examplePresets.slice(0, 2).map((preset, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setInput(preset)}
                  className="px-2 py-0.5 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-indigo-300 transition-colors cursor-pointer truncate max-w-[200px]"
                >
                  "{preset}"
                </button>
              ))}
            </div>

            {/* Analyze Button */}
            <motion.button
              id="btn-ai-analyze-submit"
              type="submit"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              disabled={analyzing || !input.trim() || saving}
              className="ml-auto px-4 py-2 rounded-xl text-xs font-heading font-semibold uppercase tracking-wider bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{analyzing ? 'Analyzing with AI...' : 'Analyze Task'}</span>
            </motion.button>
          </div>
        </div>
      </form>

      {/* Loading Skeleton */}
      {analyzing && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 rounded-xl border border-indigo-500/30 bg-slate-950/80 space-y-3"
        >
          <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 animate-pulse">
            <Sparkles className="w-4 h-4 animate-spin" />
            <span>Analyzing activity and calculating rewards...</span>
          </div>

          <div className="space-y-2">
            <div className="h-4 w-2/3 bg-slate-800 rounded animate-pulse" />
            <div className="h-3 w-5/6 bg-slate-800/60 rounded animate-pulse" />
          </div>

          <div className="flex gap-2 pt-1">
            <div className="h-7 w-24 bg-slate-800 rounded-lg animate-pulse" />
            <div className="h-7 w-20 bg-slate-800 rounded-lg animate-pulse" />
            <div className="h-7 w-24 bg-slate-800 rounded-lg animate-pulse" />
          </div>
        </motion.div>
      )}

      {/* Error Banner */}
      {error && !analyzing && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/40 flex items-start gap-2.5 text-xs text-rose-300"
        >
          <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1 leading-relaxed">
            <p className="font-semibold mb-0.5">Analysis Notice</p>
            <p className="text-[11px] opacity-90">{error}</p>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="text-[11px] font-mono text-rose-400 hover:text-rose-200 underline cursor-pointer"
          >
            Dismiss
          </button>
        </motion.div>
      )}

      {/* Analyzed Result Display Card */}
      <AnimatePresence>
        {analyzedTask && !analyzing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="mt-4 rounded-xl border border-indigo-500/30 bg-slate-950 p-4 sm:p-5 space-y-4"
          >
            {/* Title & Attribute Badges */}
            <div className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-800/80 pb-3">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-0.5">
                  AI Parsed Quest Title
                </div>
                <h4 className="text-base font-bold font-heading text-slate-100 tracking-tight">
                  {analyzedTask.title}
                </h4>
                {analyzedTask.description && (
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{analyzedTask.description}</p>
                )}
              </div>

              {/* Badges */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {/* Attribute */}
                {(() => {
                  const meta = attributeMeta[analyzedTask.attribute] || attributeMeta.Intellect;
                  const Icon = meta.icon;
                  return (
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold font-heading uppercase tracking-wide border ${meta.bg} ${meta.border} ${meta.color}`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{analyzedTask.attribute}</span>
                    </span>
                  );
                })()}

                {/* Difficulty */}
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-medium uppercase tracking-wide bg-slate-900 border border-slate-700 text-slate-300">
                  <Shield className="w-3 h-3 text-indigo-400" />
                  <span>{analyzedTask.difficulty}</span>
                </span>
              </div>
            </div>

            {/* Calculated Rewards & Reasoning */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-md bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold">
                    XP
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-slate-400 uppercase">Experience</div>
                    <div className="text-sm font-bold text-indigo-300">+{analyzedTask.xpReward} XP</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-md bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <Coins className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-slate-400 uppercase">Bounty</div>
                    <div className="text-sm font-bold text-amber-300">+{analyzedTask.goldReward} Gold</div>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center text-xs text-slate-400 italic">
                "{analyzedTask.reasoning}"
              </div>
            </div>

            {/* Save Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
              <button
                type="button"
                onClick={handleReset}
                disabled={saving}
                className="px-3 py-1.5 rounded-lg text-xs font-mono text-slate-400 hover:text-slate-200 flex items-center gap-1.5 hover:bg-slate-900 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Re-analyze</span>
              </button>

              <div className="flex items-center gap-2">
                {savedSuccess ? (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-heading font-semibold uppercase tracking-wider border border-emerald-500/30">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Saved to Quests!</span>
                  </div>
                ) : (
                  <motion.button
                    id="btn-save-ai-task"
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={saving}
                    onClick={() => handleSaveToSupabase(false)}
                    className="px-4 py-2 rounded-xl text-xs font-heading font-semibold uppercase tracking-wider bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{saving ? 'Saving Task...' : 'Save Quest'}</span>
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
