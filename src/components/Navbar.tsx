import React, { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import {
  Gamepad2,
  LayoutDashboard,
  Swords,
  User,
  ShoppingBag,
  Backpack,
  TrendingUp,
  Settings,
  Menu,
  X,
  Sparkles,
  LogOut,
  ChevronDown,
  ShieldCheck,
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { useAuth } from '../context/AuthContext';
import { GoldDisplay } from './GoldDisplay';
import { ADMIN_CONFIG } from '../config/adminConfig';

export const Navbar: React.FC = () => {
  const { user } = useGame();
  const { user: authUser, signOut } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Check if we are on landing, login or signup pages (where full dashboard nav isn't primary, but navigation is still available)
  const isAuthOrLanding = ['/', '/login', '/signup'].includes(location.pathname);
  const isAdmin = ADMIN_CONFIG.isAuthorizedAdmin(authUser?.email);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/quests', label: 'Quests', icon: Swords },
    { to: '/character', label: 'Character', icon: User },
    { to: '/shop', label: 'Shop', icon: ShoppingBag },
    { to: '/inventory', label: 'Inventory', icon: Backpack },
    { to: '/progress', label: 'Progress', icon: TrendingUp },
    { to: '/settings', label: 'Settings', icon: Settings },
    ...(isAdmin ? [{ to: '/admin', label: 'Admin', icon: ShieldCheck, isAdminBadge: true }] : []),
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#0b0f17]/90 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo */}
          <Link
            to="/dashboard"
            className="flex items-center gap-3 group focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-600 border border-indigo-400/30 flex items-center justify-center text-white shadow-sm group-hover:bg-indigo-500 transition-colors">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <div className="leading-tight">
              <div className="font-heading font-extrabold tracking-tight text-lg sm:text-xl text-slate-100 flex items-center gap-1">
                <span>LIFE</span>
                <span className="text-indigo-400 font-black">
                  RPG
                </span>
              </div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400 -mt-0.5 font-semibold">
                Productivity System
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link: any) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-xl text-xs font-heading font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                      isActive
                        ? link.isAdminBadge
                          ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                          : 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30'
                        : link.isAdminBadge
                        ? 'text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 border border-amber-500/20'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Right Area: Gold Counter, User Level, Avatar, Sign Out, or Auth buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {authUser ? (
              <>
                <GoldDisplay gold={user.gold} size="sm" />

                {/* Level Badge & Profile Link */}
                <Link
                  to="/character"
                  className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-colors group shadow-sm"
                >
                  <div className="w-7 h-7 rounded-lg overflow-hidden border border-slate-700 bg-slate-950">
                    <img
                      src={user.avatarUrl}
                      alt={user.username}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-left leading-none">
                    <div className="text-[10px] text-amber-400 font-bold font-mono">
                      LVL {user.level}
                    </div>
                    <div className="text-xs font-semibold text-slate-200 truncate max-w-[80px]">
                      {user.username}
                    </div>
                  </div>
                </Link>

                {/* Sign Out Button */}
                <button
                  id="btn-navbar-signout"
                  onClick={handleSignOut}
                  title="Sign Out of Life RPG"
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 border border-slate-800 transition-colors cursor-pointer"
                  aria-label="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 rounded-xl text-xs font-heading font-semibold uppercase tracking-wider text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-1.5 rounded-xl text-xs font-heading font-semibold uppercase tracking-wider bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <GoldDisplay gold={user.gold} size="sm" className="sm:hidden" />
            <button
              id="btn-mobile-menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-[#0f1420] px-4 pt-3 pb-5 space-y-1 shadow-2xl">
          {/* User Quick Info */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/90 border border-slate-800 mb-3">
            <img
              src={user.avatarUrl}
              alt={user.username}
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-xl object-cover border border-slate-700"
            />
            <div className="flex-1 min-w-0">
              <div className="font-heading font-bold text-sm text-slate-100 flex items-center gap-1.5">
                <span>{user.username}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 font-mono font-bold">
                  LVL {user.level}
                </span>
              </div>
              <div className="text-xs text-indigo-400 font-medium">{user.title}</div>
            </div>
            <GoldDisplay gold={user.gold} size="sm" />
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            {navLinks.map((link: any) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-3 py-2.5 rounded-xl text-xs font-heading font-semibold uppercase tracking-wider flex items-center gap-2 transition-all ${
                      isActive
                        ? link.isAdminBadge
                          ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                          : 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30'
                        : link.isAdminBadge
                        ? 'text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 border border-amber-500/20'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`
                  }
                >
                  <Icon className={`w-4 h-4 ${link.isAdminBadge ? 'text-amber-400' : 'text-indigo-400'}`} />
                  <span>{link.label}</span>
                </NavLink>
              );
            })}
          </div>

          {/* Quick Auth Links */}
          <div className="pt-3 mt-3 border-t border-slate-800 flex items-center justify-between text-xs font-heading uppercase font-semibold text-slate-400">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-indigo-300"
            >
              Landing Page
            </Link>
            {authUser ? (
              <button
                onClick={() => {
                  handleSignOut();
                  setMobileMenuOpen(false);
                }}
                className="text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-indigo-300"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-indigo-400 hover:text-indigo-300 font-bold"
                >
                  Signup
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
