import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Backpack, ShieldCheck, Sparkles, Filter } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { InventoryCard } from '../components/InventoryCard';
import { PageHeader } from '../components/PageHeader';

export const InventoryPage: React.FC = () => {
  const { inventory } = useGame();
  const [filterType, setFilterType] = useState<string>('all');

  const equippedCount = inventory.filter((i) => i.isEquipped).length;

  const filteredInventory = inventory.filter((item) => {
    if (filterType === 'all') return true;
    if (filterType === 'equipped') return item.isEquipped;
    return item.type === filterType;
  });

  return (
    <div className="space-y-8 pb-16">
      <PageHeader
        tag="Equipment"
        title="Inventory"
        subtitle="Manage your gear and equipment loadout to boost your stats."
        actionButton={
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-mono font-medium">
            <ShieldCheck className="w-4 h-4 text-indigo-400 stroke-[2.5]" />
            <span>{equippedCount} / {inventory.length} Equipped</span>
          </div>
        }
      />

      {/* Filter Toolbar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-none">
        {[
          { id: 'all', label: 'All Items' },
          { id: 'equipped', label: '⚡ Currently Equipped' },
          { id: 'armor', label: '🛡️ Armor & Optics' },
          { id: 'badge', label: '🎖️ Badges' },
          { id: 'theme', label: '🌌 Themes' },
        ].map((btn) => (
          <button
            key={btn.id}
            onClick={() => setFilterType(btn.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-heading font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
              filterType === btn.id
                ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-transparent'
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Inventory Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredInventory.map((item) => (
          <InventoryCard key={item.id} item={item} />
        ))}
      </div>

      {filteredInventory.length === 0 && (
        <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-slate-800 bg-slate-900/20">
          <Backpack className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h4 className="text-base font-bold font-heading uppercase text-slate-300">
            No Items in This Category
          </h4>
          <p className="text-xs text-slate-500 mt-1">
            Visit the Reward Shop to unlock cybernetic gear with your gold.
          </p>
        </div>
      )}
    </div>
  );
};
