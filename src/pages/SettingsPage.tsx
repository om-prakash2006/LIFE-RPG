import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  User,
  Palette,
  Bell,
  Sliders,
  Shield,
  ShieldCheck,
  Check,
  Save,
  Volume2,
  Sparkles,
  Zap,
  LogOut,
  Database,
  RotateCcw,
  CheckCircle2,
  Copy,
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { useAuth } from '../context/AuthContext';
import { PageHeader } from '../components/PageHeader';
import { ADMIN_CONFIG } from '../config/adminConfig';

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, resetGameData } = useGame();
  const { user: authUser, signOut, isSupabaseConnected, supabaseProjectId } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [saveToast, setSaveToast] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  // Form states for settings
  const [username, setUsername] = useState(user.username);
  const [title, setTitle] = useState(user.title);
  const [soundEffects, setSoundEffects] = useState(true);
  const [confettiEffects, setConfettiEffects] = useState(true);
  const [dailyReminders, setDailyReminders] = useState(true);
  const [streakWarnings, setStreakWarnings] = useState(true);
  const [hardcoreMode, setHardcoreMode] = useState(false);
  const [themeMode, setThemeMode] = useState('cyber-dark');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'gameplay', label: 'Gameplay Preferences', icon: Sliders },
    { id: 'account', label: 'Account', icon: Shield },
  ];

  return (
    <div className="space-y-8 pb-16">
      <PageHeader
        tag="System Config"
        title="Settings"
        subtitle="Manage your profile, visual appearance, notifications, and application preferences."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Navigation Sidebar for settings (4 cols) */}
        <div className="lg:col-span-4 rounded-2xl bg-slate-900 border border-slate-800 p-2 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-heading font-semibold uppercase tracking-wider text-left transition-all ${
                  activeTab === tab.id
                    ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Panel (8 cols) */}
        <div className="lg:col-span-8 rounded-3xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 backdrop-blur-xl relative">
          <form onSubmit={handleSave} className="space-y-6">
            {/* 1. Profile Section */}
            {activeTab === 'profile' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold font-heading uppercase tracking-tight text-slate-100 pb-3 border-b border-slate-800">
                  Player Identity
                </h3>

                <div className="flex items-center gap-4 py-2">
                  <img
                    src={user.avatarUrl}
                    alt={user.username}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-2xl object-cover border border-slate-700 bg-slate-800"
                  />
                  <div>
                    <button
                      type="button"
                      onClick={() => alert('Avatar customizer available in Phase 2.')}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-xs font-heading font-semibold uppercase text-slate-200 border border-slate-700 hover:border-slate-600 transition-colors"
                    >
                      Change Avatar
                    </button>
                    <p className="text-[11px] text-slate-400 mt-1">Recommended size 256x256</p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Hero Name
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm font-medium focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Player Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm font-medium focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            )}

            {/* 2. Appearance Section */}
            {activeTab === 'appearance' && (
              <div className="space-y-5">
                <h3 className="text-lg font-bold font-heading uppercase tracking-tight text-slate-100 pb-3 border-b border-slate-800">
                  Visual Theme
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { id: 'executive-dark', label: 'Executive Slate (Active)', desc: 'Slate, indigo & amber accents' },
                    { id: 'classic-obsidian', label: 'Classic Obsidian', desc: 'Minimalist neutral dark' },
                    { id: 'solar-gold', label: 'Solar Amber', desc: 'Warm amber & bronze tones' },
                    { id: 'sapphire-slate', label: 'Deep Sapphire', desc: 'Subtle midnight blue tones' },
                  ].map((theme) => (
                    <div
                      key={theme.id}
                      onClick={() => setThemeMode(theme.id)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        themeMode === theme.id || (themeMode === 'cyber-dark' && theme.id === 'executive-dark')
                          ? 'bg-indigo-500/15 border-indigo-500/40 text-indigo-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-heading font-semibold text-sm text-slate-200">
                          {theme.label}
                        </span>
                        {(themeMode === theme.id || (themeMode === 'cyber-dark' && theme.id === 'executive-dark')) && (
                          <span className="w-2 h-2 rounded-full bg-indigo-400" />
                        )}
                      </div>
                      <p className="text-xs text-slate-400">{theme.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950 border border-slate-800">
                    <div>
                      <div className="text-sm font-semibold font-heading uppercase tracking-tight text-slate-200">
                        Celebration Animations
                      </div>
                      <div className="text-xs text-slate-400">
                        Show visual celebration effects upon quest completion
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={confettiEffects}
                      onChange={(e) => setConfettiEffects(e.target.checked)}
                      className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 3. Notifications Section */}
            {activeTab === 'notifications' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold font-heading uppercase tracking-tight text-slate-100 pb-3 border-b border-slate-800">
                  Notification Preferences
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950 border border-slate-800">
                    <div>
                      <div className="text-sm font-semibold font-heading uppercase tracking-tight text-slate-200">
                        Daily Quest Reminders
                      </div>
                      <div className="text-xs text-slate-400">
                        Receive daily morning reminders for incomplete objectives
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={dailyReminders}
                      onChange={(e) => setDailyReminders(e.target.checked)}
                      className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950 border border-slate-800">
                    <div>
                      <div className="text-sm font-semibold font-heading uppercase tracking-tight text-slate-200">
                        Streak Freeze Protection Alert
                      </div>
                      <div className="text-xs text-slate-400">
                        Notify 2 hours before midnight if daily streak is at risk
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={streakWarnings}
                      onChange={(e) => setStreakWarnings(e.target.checked)}
                      className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 4. Gameplay Preferences */}
            {activeTab === 'gameplay' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold font-heading uppercase tracking-tight text-slate-100 pb-3 border-b border-slate-800">
                  Gameplay Rules
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950 border border-slate-800">
                    <div>
                      <div className="text-sm font-semibold font-heading uppercase tracking-tight text-slate-200">
                        Sound Effects & Haptics
                      </div>
                      <div className="text-xs text-slate-400">
                        Play sound feedback when claiming XP and Gold
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={soundEffects}
                      onChange={(e) => setSoundEffects(e.target.checked)}
                      className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950 border border-slate-800">
                    <div>
                      <div className="text-sm font-semibold font-heading uppercase tracking-tight text-slate-200">
                        Hardcore Discipline Mode
                      </div>
                      <div className="text-xs text-slate-400">
                        Missing a daily task deducts 10 Gold from penalty treasury
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={hardcoreMode}
                      onChange={(e) => setHardcoreMode(e.target.checked)}
                      className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 5. Account Section */}
            {activeTab === 'account' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold font-heading uppercase tracking-tight text-slate-100 pb-3 border-b border-slate-800">
                  Account Credentials
                </h3>

                <div>
                  <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Registered Email
                  </label>
                  <input
                    type="email"
                    disabled
                    value={authUser?.email || user.email}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Hero Player ID
                  </label>
                  <input
                    type="text"
                    disabled
                    value={authUser?.id || 'local-hero-om'}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 text-xs font-mono"
                  />
                </div>

                {/* Cloud Database Connection Details */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-indigo-500/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                      </div>
                      <span className="font-heading font-semibold text-xs uppercase tracking-wider text-slate-200">
                        Cloud Database Connected
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                      Active
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 font-mono">
                      <span className="text-slate-500 block text-[10px] uppercase font-sans">Storage Engine</span>
                      <span className="text-indigo-300 font-semibold">PostgreSQL Relational DB</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 font-mono">
                      <span className="text-slate-500 block text-[10px] uppercase font-sans">Tables</span>
                      <span className="text-slate-300">profiles, characters, user_quests</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-400">
                      User stats & profile records persist directly to secure cloud storage.
                    </span>
                    <span className="text-[11px] font-mono text-emerald-400">
                      Auto-sync active
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm('Reset all quests, inventory, and stats to default starter data?')) {
                          resetGameData();
                        }
                      }}
                      className="px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 text-xs font-heading font-semibold uppercase tracking-wider hover:bg-slate-700/80 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                      <span>Reset Game Data</span>
                    </button>

                    {ADMIN_CONFIG.isAuthorizedAdmin(authUser?.email) && (
                      <Link
                        to="/admin"
                        className="px-3.5 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-heading font-semibold uppercase tracking-wider hover:bg-amber-500/20 transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                        <span>Admin Portal</span>
                      </Link>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={async () => {
                      await signOut();
                      navigate('/login');
                    }}
                    className="px-4 py-2 rounded-xl bg-rose-950/30 border border-rose-500/30 text-rose-300 text-xs font-heading font-semibold uppercase tracking-wider hover:bg-rose-900/40 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              {saveToast ? (
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold font-heading uppercase">
                  <Check className="w-4 h-4" />
                  <span>Preferences Saved</span>
                </div>
              ) : (
                <span className="text-xs text-slate-500 font-mono">Phase 1 Frontend Prototype</span>
              )}

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl font-heading font-semibold uppercase tracking-wider text-xs sm:text-sm bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Save Settings</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
