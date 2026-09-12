import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Swords,
  User,
  ShoppingBag,
  Backpack,
} from 'lucide-react';

export const MobileNavigation: React.FC = () => {
  const location = useLocation();

  // Hide on landing or auth pages
  if (['/', '/login', '/signup'].includes(location.pathname)) {
    return null;
  }

  const navItems = [
    { to: '/dashboard', label: 'Dash', icon: LayoutDashboard },
    { to: '/quests', label: 'Quests', icon: Swords },
    { to: '/character', label: 'Hero', icon: User },
    { to: '/shop', label: 'Shop', icon: ShoppingBag },
    { to: '/inventory', label: 'Bag', icon: Backpack },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0b0f17]/95 border-t border-slate-800 backdrop-blur-xl px-2 py-1.5 shadow-lg">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
                  isActive
                    ? 'text-indigo-400 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`
              }
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] font-heading uppercase tracking-wider">
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
