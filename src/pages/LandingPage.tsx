import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Gamepad2,
  Swords,
  Sparkles,
  Zap,
  Flame,
  TrendingUp,
  Coins,
  Shield,
  ArrowRight,
  Brain,
  CheckCircle2,
  Layers,
} from 'lucide-react';
import { XPBar } from '../components/XPBar';
import { GoldDisplay } from '../components/GoldDisplay';
import { useAuth } from '../context/AuthContext';

export const LandingPage: React.FC = () => {
  const { user: authUser } = useAuth();
  const mechanics = [
    {
      title: 'Real Life → Quests',
      description: 'Transform mundane daily to-dos into structured quests with clear objectives and difficulty tiers.',
      icon: Swords,
      color: 'text-indigo-400',
      border: 'border-slate-800',
      bg: 'bg-slate-900',
      badge: 'Objectives',
    },
    {
      title: 'Tasks → XP',
      description: 'Every completed workout, study session, or project milestone generates tangible experience points.',
      icon: Sparkles,
      color: 'text-indigo-300',
      border: 'border-slate-800',
      bg: 'bg-slate-900',
      badge: 'Progression',
    },
    {
      title: 'Habits → Stats',
      description: 'Strengthen your core stats: Intellect, Strength, Discipline, Vitality, and Knowledge.',
      icon: Brain,
      color: 'text-rose-400',
      border: 'border-slate-800',
      bg: 'bg-slate-900',
      badge: 'Stats',
    },
    {
      title: 'Consistency → Streaks',
      description: 'Maintain daily discipline. Consistency compounds your momentum with streak multipliers.',
      icon: Flame,
      color: 'text-amber-400',
      border: 'border-slate-800',
      bg: 'bg-slate-900',
      badge: 'Multipliers',
    },
    {
      title: 'Progress → Levels',
      description: 'Advance from a Level 1 Novice to higher prestige tiers as your real-world achievements grow.',
      icon: TrendingUp,
      color: 'text-emerald-400',
      border: 'border-slate-800',
      bg: 'bg-slate-900',
      badge: 'Prestige',
    },
    {
      title: 'Rewards → Gold & Gear',
      description: 'Earn gold from completed quests to unlock specialized equipment and milestone credentials.',
      icon: Coins,
      color: 'text-amber-300',
      border: 'border-slate-800',
      bg: 'bg-slate-900',
      badge: 'Armory',
    },
  ];

  return (
    <div className="relative min-h-screen bg-[#0b0f17] overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 sm:pt-24 sm:pb-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Executive pill badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs font-heading font-semibold uppercase tracking-wider mb-6"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Productivity Gamification System</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-bold font-heading uppercase tracking-tight text-slate-100 leading-none"
          >
            Turn Your Life{' '}
            <span className="text-indigo-400">
              Into A Game.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed"
          >
            Complete real-world tasks, earn experience points, build daily habits, and level up your life.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            {authUser ? (
              <Link
                to="/dashboard"
                className="px-8 py-3.5 rounded-xl font-heading font-semibold uppercase tracking-wider text-sm bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-all flex items-center gap-2 group cursor-pointer"
              >
                <span>Enter Realm (Dashboard)</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="px-7 py-3.5 rounded-xl font-heading font-semibold uppercase tracking-wider text-sm bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-all flex items-center gap-2 group cursor-pointer"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>

                <Link
                  to="/login"
                  className="px-7 py-3.5 rounded-xl font-heading font-semibold uppercase tracking-wider text-sm bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-600 shadow-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Sign In</span>
                  <Gamepad2 className="w-4 h-4 text-indigo-400" />
                </Link>
              </>
            )}
          </motion.div>
        </div>

        {/* Visual RPG Character / Progression Preview Banner */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-16 sm:mt-20 max-w-4xl mx-auto rounded-3xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 shadow-md backdrop-blur-xl relative"
        >
          {/* Top HUD Frame */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl p-0.5 border border-slate-700 bg-slate-800">
                <img
                  src="https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=200"
                  alt="Player"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-[14px]"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-heading font-bold text-lg text-slate-100 uppercase">
                    Adventurer
                  </span>
                  <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 text-xs font-mono font-bold">
                    LVL 1
                  </span>
                </div>
                <div className="text-xs text-indigo-400 font-medium">Cyber Sage • Realm of Discipline</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold font-mono flex items-center gap-1.5">
                <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>Streak Tracker</span>
              </div>
              <GoldDisplay gold={100} size="sm" />
            </div>
          </div>

          {/* XP Progression Preview */}
          <div className="my-6">
            <XPBar currentXp={0} maxXp={100} size="md" />
          </div>

          {/* Sample Quest Card in Hero Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-slate-800 text-indigo-400 border border-slate-700">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-mono font-medium uppercase tracking-wider text-indigo-400">
                    Active Quest
                  </div>
                  <div className="text-sm font-semibold text-slate-100">Complete Java OOP Practice</div>
                </div>
              </div>
              <span className="text-xs font-mono font-semibold text-indigo-300">+50 XP</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-slate-800 text-emerald-400 border border-slate-700">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-mono font-medium uppercase tracking-wider text-emerald-400">
                    Completed
                  </div>
                  <div className="text-sm font-semibold text-slate-400 line-through">
                    30 Minute Workout
                  </div>
                </div>
              </div>
              <span className="text-xs font-mono font-semibold text-amber-300">+15 Gold</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Six Pillars / Mechanics Section */}
      <section className="relative py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs font-mono font-medium uppercase tracking-wider text-indigo-400 mb-2">
            Core Mechanics
          </h2>
          <h3 className="text-2xl sm:text-3xl font-bold font-heading uppercase tracking-tight text-slate-100">
            How Life RPG Transforms Your Routine
          </h3>
          <p className="text-sm text-slate-400 mt-2">
            Every action in reality builds your character profile and habits.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mechanics.map((m, idx) => {
            const Icon = m.icon;
            return (
              <motion.div
                key={m.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                whileHover={{ y: -2 }}
                className={`relative overflow-hidden rounded-2xl border p-6 transition-all duration-200 backdrop-blur-md ${m.bg} ${m.border} shadow-sm`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2.5 rounded-xl bg-slate-800 border border-slate-700 ${m.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-medium uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-slate-300">
                    {m.badge}
                  </span>
                </div>

                <h4 className="text-lg font-semibold font-heading uppercase tracking-tight text-slate-100 mb-2">
                  {m.title}
                </h4>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {m.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-8 sm:p-12 text-center relative overflow-hidden shadow-sm">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl sm:text-3xl font-bold font-heading uppercase tracking-tight text-slate-100 mb-3">
              Ready to Begin?
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mb-8 leading-relaxed">
              Step into the realm. Choose your starting discipline, embark on your first daily quests, and take command of your life.
            </p>
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-heading font-semibold uppercase tracking-wider text-xs sm:text-sm bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-all cursor-pointer"
            >
              <span>Create Account</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
