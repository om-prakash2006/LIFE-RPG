import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  User,
  Mail,
  Lock,
  Sparkles,
  Shield,
  Flame,
  Brain,
  Dumbbell,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { supabase } from '../supabaseClient';

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedClass, setSelectedClass] = useState('Cyber Sage');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const classes = [
    { name: 'Cyber Sage', desc: 'High Intellect & Deep Strategy', icon: Brain, color: 'text-indigo-400' },
    { name: 'Iron Titan', desc: 'Unyielding Strength & Endurance', icon: Dumbbell, color: 'text-rose-400' },
    { name: 'Shadow Stalker', desc: 'Laser Discipline & Swift Execution', icon: Flame, color: 'text-amber-400' },
  ];

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setInfoMessage(null);

    const cleanUsername = username.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanUsername) {
      setErrorMessage('Please enter a hero username.');
      return;
    }

    if (!cleanEmail) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: {
          username: cleanUsername,
          classType: selectedClass,
        },
      },
    });

    setLoading(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    // After signUp(), if data.session is null, don't redirect to the dashboard.
    // Just show: "Check your email and confirm your account before logging in."
    if (!data?.session) {
      setInfoMessage('Check your email and confirm your account before logging in.');
      return;
    }

    // Only redirect when a real session exists
    navigate('/dashboard');
  };

  return (
    <div className="relative min-h-[calc(100vh-64px)] flex items-center justify-center p-4 overflow-hidden py-10">
      <div className="relative w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch z-10">
        {/* Left/Main: Character Creation Form (7 cols) */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-7 rounded-3xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 shadow-xl backdrop-blur-xl flex flex-col justify-between"
        >
          <div>
            <div className="mb-6">
              <span className="text-xs font-mono font-medium uppercase tracking-wider text-indigo-400">
                Hero Onboarding
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-heading uppercase tracking-tight text-slate-100 mt-1">
                Create Your Character
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Initialize your avatar and choose your starting discipline path
              </p>
            </div>

            <form onSubmit={handleSignup} className="space-y-4">
              {/* Username */}
              <div>
                <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-slate-300 mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Hero Username *</span>
                </label>
                <input
                  id="input-signup-username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. OM"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-500 text-sm font-medium focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-slate-300 mb-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Email Address *</span>
                </label>
                <input
                  id="input-signup-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hero@realm.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-500 text-sm font-medium focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Password & Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-slate-300 mb-1 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Password *</span>
                  </label>
                  <input
                    id="input-signup-password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm font-medium focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-slate-300 mb-1 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Confirm Password *</span>
                  </label>
                  <input
                    id="input-signup-confirm"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm font-medium focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Class Selector */}
              <div>
                <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Starting Class
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {classes.map((c) => {
                    const Icon = c.icon;
                    return (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => setSelectedClass(c.name)}
                        className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                          selectedClass === c.name
                            ? 'bg-indigo-500/15 border-indigo-500/40 text-indigo-300'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <Icon className={`w-4 h-4 mb-1 ${c.color}`} />
                        <div className="text-xs font-heading font-semibold text-slate-200">
                          {c.name}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit */}
              <motion.button
                id="btn-signup-submit"
                type="submit"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                className="w-full mt-6 py-3 px-4 rounded-xl font-heading font-semibold uppercase tracking-wider text-xs sm:text-sm bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                <Sparkles className="w-4 h-4" />
                <span>{loading ? 'Creating Character...' : 'Create Character'}</span>
              </motion.button>
            </form>

            {/* Confirmation notice when data.session is null */}
            {infoMessage && (
              <div className="mt-3 p-3.5 rounded-xl bg-indigo-950/60 border border-indigo-500/40 flex items-start gap-2.5 text-xs text-indigo-200 shadow-sm">
                <Mail className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 font-medium leading-relaxed">{infoMessage}</div>
              </div>
            )}

            {/* Error Message under the form */}
            {errorMessage && (
              <div className="mt-3 p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-300">
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">{errorMessage}</div>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
            Already have a hero?{' '}
            <Link to="/login" className="text-indigo-400 font-semibold hover:text-indigo-300 uppercase font-heading tracking-wider ml-1">
              Sign In
            </Link>
          </div>
        </motion.div>

        {/* Right: RPG Character Preview Card (5 cols) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-5 rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl backdrop-blur-xl flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <span className="text-[10px] font-mono font-medium uppercase tracking-wider text-indigo-400 flex items-center gap-1">
                <Shield className="w-3.5 h-3.5" /> Character Dossier
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-bold">
                INIT LVL 1
              </span>
            </div>

            {/* Avatar & Class display */}
            <div className="flex flex-col items-center text-center my-3">
              <div className="w-20 h-20 rounded-2xl p-0.5 border border-slate-700 bg-slate-800 mb-3 shadow-sm">
                <img
                  src="https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=250"
                  alt="Avatar Preview"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-[14px] bg-slate-950"
                />
              </div>

              <h3 className="text-lg font-bold font-heading uppercase tracking-tight text-slate-100">
                {username || 'New Adventurer'}
              </h3>
              <p className="text-xs text-indigo-400 font-mono font-semibold">{selectedClass}</p>
            </div>

            {/* Initial XP and Gold */}
            <div className="space-y-3 mt-4">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-slate-400">Starting Energy</span>
                  <span className="text-indigo-300 font-semibold">0 / 150 XP</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                  <div className="w-2 h-full bg-indigo-500" />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Starter Bounty</span>
                <span className="text-amber-300 font-semibold">+150 Gold</span>
              </div>
            </div>

            {/* Starting traits */}
            <div className="mt-5 space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Character stats initialized</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Encrypted cloud backup enabled</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-slate-800 text-center">
            <span className="text-[11px] text-slate-400 italic">
              "Every great achievement begins with a single focused step."
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
