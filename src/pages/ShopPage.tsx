import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, Coins, Sparkles, Filter, Shield } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { RewardCard } from '../components/RewardCard';
import { PageHeader } from '../components/PageHeader';
import { GoldDisplay } from '../components/GoldDisplay';

export const ShopPage: React.FC = () => {
  const { shopItems, user, inventory } = useGame();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Items' },
    { id: 'gear', label: '🛡️ Cyber Gear' },
    { id: 'badges', label: '🎖️ Heroic Badges' },
    { id: 'themes', label: '🌌 Visual Themes' },
    { id: 'titles', label: '👑 Regal Titles' },
  ];

  const filteredItems = shopItems.filter((item) => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  return (
    <div className="space-y-8 pb-16">
      <PageHeader
        tag="Store"
        title="Reward Shop"
        subtitle="Exchange earned productivity gold for gear, prestige crests, and aesthetic tokens."
        actionButton={<GoldDisplay gold={user.gold} size="lg" />}
      />

      {/* Gold Treasury Banner */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-13 h-13 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-400 flex items-center justify-center">
            <Coins className="w-7 h-7" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-medium uppercase tracking-wider text-amber-400">
              Available Vault Balance
            </span>
            <div className="text-3xl sm:text-4xl font-bold font-mono text-amber-300">
              {user.gold.toLocaleString()} <span className="text-sm font-heading text-slate-400 uppercase font-medium">Gold</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Complete daily quests in the real world to earn more gold.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
            {inventory.length} Items in Satchel
          </span>
        </div>
      </div>

      {/* Category filter tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-heading font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
              selectedCategory === cat.id
                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-transparent'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid of Reward Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map((item) => {
          const isOwned = inventory.some((inv) => inv.name === item.name);
          return <RewardCard key={item.id} item={item} isOwned={isOwned} />;
        })}
      </div>
    </div>
  );
};
