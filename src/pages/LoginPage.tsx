import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Gamepad2, Mail, Lock, Sparkles, ArrowRight, AlertCircle } from 'lucide-react';
import { supabase } from '../supabaseClient';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState((location.state as any)?.email || '');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setLoading(false);

    if (error) {
      if (error.message.toLowerCase().includes('not confirmed') || error.message.toLowerCase().includes('unconfirmed')) {
        setErrorMessage("Check your email and confirm your account before logging in.");
      } else {
        setErrorMessage(error.message);
      }
      return;
    }

    // Only redirect when a real session exists after login
    if (data?.session) {
      const fromPath = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(fromPath, { replace: true });
    } else {
      setErrorMessage("Check your email and confirm your account before logging in.");
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-64px)] flex items-center justify-center p-4 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-xl backdrop-blur-xl z-10"
      >
        {/* Logo & Title */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-sm">
            <Gamepad2 className="w-6 h-6 text-white" />
          </div>

          <span className="text-xs font-mono font-medium uppercase tracking-wider text-indigo-400">
            Life RPG System
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-heading uppercase tracking-tight text-slate-100 mt-1">
            Welcome Back
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Sign in to continue your active quests and track progress
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-indigo-400" />
              <span>Email Address</span>
            </label>
            <div className="relative">
              <input
                id="input-login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hero@realm.com"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-500 text-sm font-medium focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-heading font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-indigo-400" />
                <span>Password</span>
              </label>
            </div>
            <input
              id="input-login-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-500 text-sm font-medium focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Submit button */}
          <motion.button
            id="btn-login-submit"
            type="submit"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className="w-full mt-6 py-3 px-4 rounded-xl font-heading font-semibold uppercase tracking-wider text-xs sm:text-sm bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            <span>{loading ? 'Entering Realm...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </form>

        {/* Small error message under the form */}
        {errorMessage && (
          <div className="mt-3 p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">{errorMessage}</div>
          </div>
        )}

        {/* Footer link to Signup */}
        <div className="mt-6 pt-5 border-t border-slate-800 text-center">
          <p className="text-xs text-slate-400">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors ml-1 inline-flex items-center gap-1 font-heading uppercase tracking-wider"
            >
              <span>Create character</span>
              <Sparkles className="w-3 h-3" />
            </Link>
          </p>
        </div>

        {/* System status note */}
        <div className="mt-4 p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Database Status:</span>
          </div>
          <span className="font-mono text-emerald-400 font-semibold text-[10px]">Active & Synchronized</span>
        </div>
      </motion.div>
    </div>
  );
};
