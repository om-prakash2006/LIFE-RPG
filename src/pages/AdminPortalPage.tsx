import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  ShieldCheck,
  Users,
  Search,
  RefreshCw,
  Lock,
  Mail,
  UserCheck,
  Award,
  Coins,
  Sparkles,
  ArrowLeft,
  Calendar,
  KeyRound,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { profileService } from '../services/profileService';
import { characterService } from '../services/characterService';
import { ADMIN_CONFIG } from '../config/adminConfig';
import { DbProfile, DbCharacter } from '../types';

interface UserRecord {
  profile: DbProfile;
  character?: DbCharacter;
}

export const AdminPortalPage: React.FC = () => {
  const { user: authUser, signIn, signUp, error: authError, clearError } = useAuth();
  const navigate = useNavigate();

  // Admin Login state (if not logged in as admin)
  const [adminEmail, setAdminEmail] = useState('ommbehera46@gmail.com');
  const [adminPassword, setAdminPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginMode, setLoginMode] = useState<'signin' | 'signup'>('signin');
  const [localFeedback, setLocalFeedback] = useState<string | null>(null);

  // Admin Data state
  const [userRecords, setUserRecords] = useState<UserRecord[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('all');

  const isAdmin = ADMIN_CONFIG.isAuthorizedAdmin(authUser?.email);

  const loadUserData = async () => {
    setIsLoadingData(true);
    try {
      const [profiles, characters] = await Promise.all([
        profileService.getAllProfiles(),
        characterService.getAllCharacters(),
      ]);

      const charMap = new Map<string, DbCharacter>();
      characters.forEach((char) => charMap.set(char.user_id, char));

      const combined: UserRecord[] = profiles.map((p) => ({
        profile: p,
        character: charMap.get(p.user_id),
      }));

      setUserRecords(combined);
    } catch (err) {
      console.warn('[AdminPortal] Error loading records:', err);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadUserData();
    }
  }, [isAdmin]);

  const handleAdminAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalFeedback(null);
    clearError();

    if (!adminEmail.trim()) {
      setLocalFeedback('Please enter your administrator email.');
      return;
    }

    if (!ADMIN_CONFIG.isAuthorizedAdmin(adminEmail)) {
      setLocalFeedback(
        `Access denied. Only registered administrator emails (${ADMIN_CONFIG.authorizedEmails.join(', ')}) can unlock this portal.`
      );
      return;
    }

    if (!adminPassword || adminPassword.length < 6) {
      setLocalFeedback('Please provide your secure password (minimum 6 characters).');
      return;
    }

    setIsSubmitting(true);
    try {
      if (loginMode === 'signin') {
        await signIn(adminEmail.trim(), adminPassword);
      } else {
        await signUp({
          email: adminEmail.trim(),
          password: adminPassword,
          username: 'System Admin',
          classType: 'Cyber Sage',
        });
        setLocalFeedback('Administrator account provisioned! Please sign in with your password.');
        setLoginMode('signin');
      }
    } catch (err: any) {
      setLocalFeedback(err?.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtered users
  const filteredUsers = userRecords.filter((rec) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      rec.profile.username.toLowerCase().includes(q) ||
      rec.profile.email.toLowerCase().includes(q) ||
      rec.profile.user_id.toLowerCase().includes(q);

    const matchesClass =
      selectedClass === 'all' ||
      (rec.character &&
        (rec.character as any).classType?.toLowerCase() === selectedClass.toLowerCase());

    return matchesQuery && matchesClass;
  });

  const totalUsers = userRecords.length;
  const avgLevel =
    totalUsers > 0
      ? (
          userRecords.reduce((acc, r) => acc + (r.character?.level || 1), 0) /
          totalUsers
        ).toFixed(1)
      : '1.0';
  const totalGoldInCirculation = userRecords.reduce(
    (acc, r) => acc + (r.character?.gold || 0),
    0
  );

  // If NOT authorized as admin, show secure admin login form
  if (!isAdmin) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl relative overflow-hidden"
        >
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center space-y-3 mb-6 relative">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mx-auto flex items-center justify-center shadow-inner">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <h1 className="text-xl sm:text-2xl font-heading font-black text-slate-100 uppercase tracking-tight">
              Admin Portal Authentication
            </h1>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
              Restricted administrative gateway. Role-Based Access Control requires authentication with your verified administrator email.
            </p>
          </div>

          {/* Security notice regarding why hardcoded credentials are banned */}
          <div className="mb-5 p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 leading-normal space-y-1">
            <div className="flex items-center gap-1.5 text-amber-400 font-semibold font-heading uppercase tracking-wide">
              <Lock className="w-3.5 h-3.5" />
              <span>RBAC Security Enforced</span>
            </div>
            <p>
              Hardcoding plaintext passwords in client code exposes credentials to every visitor. Your admin rights are securely validated via your administrator account:
            </p>
            <code className="inline-block mt-1 px-2 py-0.5 rounded bg-slate-900 text-amber-300 font-mono text-[10px] border border-slate-800">
              ommbehera46@gmail.com
            </code>
          </div>

          {(localFeedback || authError) && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{localFeedback || authError}</span>
            </div>
          )}

          <form onSubmit={handleAdminAuth} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-heading font-semibold uppercase tracking-wider text-slate-400">
                Administrator Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="ommbehera46@gmail.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-amber-500 transition-colors font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-heading font-semibold uppercase tracking-wider text-slate-400">
                Admin Password
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Enter your secure password"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl font-heading font-bold text-xs uppercase tracking-wider bg-amber-500 hover:bg-amber-400 active:scale-[0.99] text-slate-950 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20 disabled:opacity-50"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>
                {isSubmitting
                  ? 'Authenticating...'
                  : loginMode === 'signin'
                  ? 'Unlock Admin Portal'
                  : 'Register Admin Account'}
              </span>
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <button
              type="button"
              onClick={() => {
                setLoginMode(loginMode === 'signin' ? 'signup' : 'signin');
                setLocalFeedback(null);
              }}
              className="hover:text-amber-400 transition-colors cursor-pointer text-left"
            >
              {loginMode === 'signin'
                ? 'Need to create this admin account first?'
                : 'Already set up password? Sign in'}
            </button>
            <Link
              to="/dashboard"
              className="hover:text-slate-200 transition-colors inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Game</span>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // Authorized Admin View
  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/20 border border-amber-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <ShieldCheck className="w-48 h-48 text-amber-400" />
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-heading font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Authenticated Super Administrator</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-black text-slate-100 uppercase tracking-tight">
              Realm User Directory
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
              Live audit of registered adventurers, profiles, and progression metrics stored in your database.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={loadUserData}
              disabled={isLoadingData}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-heading font-semibold uppercase tracking-wider border border-slate-700 transition-colors inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingData ? 'animate-spin' : ''}`} />
              <span>Refresh Records</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Bento */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-heading font-semibold uppercase tracking-wider text-slate-400">
              Total Signups
            </span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black font-heading text-slate-100">{totalUsers}</div>
          <span className="text-[11px] text-slate-500 font-mono">Registered accounts</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-heading font-semibold uppercase tracking-wider text-slate-400">
              Average Level
            </span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black font-heading text-slate-100">LVL {avgLevel}</div>
          <span className="text-[11px] text-slate-500 font-mono">Hero mastery</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-heading font-semibold uppercase tracking-wider text-slate-400">
              Gold Bounty
            </span>
            <Coins className="w-4 h-4 text-amber-300" />
          </div>
          <div className="text-2xl font-black font-heading text-slate-100">
            {totalGoldInCirculation.toLocaleString()} G
          </div>
          <span className="text-[11px] text-slate-500 font-mono">In circulation</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-heading font-semibold uppercase tracking-wider text-slate-400">
              Database Link
            </span>
            <UserCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-sm font-black font-heading text-emerald-400 uppercase mt-1">
            Database Live
          </div>
          <span className="text-[11px] text-slate-500 font-mono truncate block">
            Status: Synchronized
          </span>
        </div>
      </div>

      {/* Directory Table Card */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by username, email, or ID..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-slate-400 font-heading uppercase tracking-wider shrink-0">
              Class:
            </span>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-amber-500 transition-colors cursor-pointer"
            >
              <option value="all">All Classes</option>
              <option value="Cyber Sage">Cyber Sage</option>
              <option value="Iron Titan">Iron Titan</option>
              <option value="Shadow Stalker">Shadow Stalker</option>
            </select>
          </div>
        </div>

        {/* Records Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-heading uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Adventurer</th>
                <th className="py-3 px-4">Email Address</th>
                <th className="py-3 px-4">Class & Level</th>
                <th className="py-3 px-4">Gold</th>
                <th className="py-3 px-4">Attributes (STR/INT/DIS)</th>
                <th className="py-3 px-4">Sign-up Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((rec) => {
                  const char = rec.character;
                  const formattedDate = rec.profile.created_at
                    ? new Date(rec.profile.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : 'Unknown';

                  return (
                    <tr key={rec.profile.user_id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-medium">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-indigo-950 border border-indigo-500/30 text-indigo-300 flex items-center justify-center font-heading font-bold text-xs uppercase">
                            {rec.profile.username.substring(0, 2)}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-100 font-heading">
                              {rec.profile.username}
                            </div>
                            <div className="text-[10px] text-slate-500 font-mono">
                              {rec.profile.user_id.substring(0, 12)}...
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-300">
                        {rec.profile.email}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 font-mono text-[10px] border border-indigo-500/20 font-bold">
                            LVL {char?.level || 1}
                          </span>
                          <span className="text-slate-400">
                            {(char as any)?.classType || 'Cyber Sage'}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-amber-300 font-semibold">
                        {(char?.gold || 0).toLocaleString()} G
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px]">
                        <span className="text-rose-400">{char?.strength ?? 20}</span> /{' '}
                        <span className="text-cyan-400">{char?.intellect ?? 20}</span> /{' '}
                        <span className="text-amber-400">{char?.discipline ?? 20}</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 font-mono flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        <span>{formattedDate}</span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 italic">
                    {isLoadingData ? 'Loading user registry...' : 'No users match your criteria.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
