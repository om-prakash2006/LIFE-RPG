import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, ShieldOff, Sparkles } from 'lucide-react';
import { InventoryItem } from '../types';
import { CategoryIcon } from './CategoryIcon';
import { useGame } from '../context/GameContext';

interface InventoryCardProps {
  item: InventoryItem;
}

export const InventoryCard: React.FC<InventoryCardProps> = ({ item }) => {
  const { equipItem, unequipItem } = useGame();

  const rarityBadge = {
    common: 'bg-slate-800 text-slate-300 border-slate-700',
    rare: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    epic: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    legendary: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  };

  return (
    <motion.div
      id={`inv-item-${item.id}`}
      whileHover={{ y: -2 }}
      className={`relative overflow-hidden rounded-2xl border p-5 transition-all duration-200 backdrop-blur-md flex flex-col justify-between shadow-sm ${
        item.isEquipped
          ? 'bg-slate-900/90 border-indigo-500/30 ring-1 ring-indigo-500/30'
          : 'bg-slate-900/85 border-slate-800 hover:border-slate-700'
      }`}
    >
      {/* Top row */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <span
          className={`text-[10px] font-heading font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
            rarityBadge[item.rarity]
          }`}
        >
          {item.rarity}
        </span>

        {item.isEquipped ? (
          <span className="text-[10px] font-heading font-medium uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            Equipped
          </span>
        ) : (
          <span className="text-[10px] font-heading uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700/80">
            In Satchel
          </span>
        )}
      </div>

      {/* Item Icon & Details */}
      <div className="flex flex-col items-center text-center my-2">
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center border mb-3 transition-transform ${
            item.isEquipped
              ? 'bg-indigo-950/40 border-indigo-500/30 text-indigo-300'
              : 'bg-slate-950 border-slate-800 text-slate-400'
          }`}
        >
          <CategoryIcon iconName={item.icon} className="w-7 h-7" />
        </div>

        <h4 className="text-base font-semibold font-heading uppercase tracking-tight text-slate-100 mb-1">
          {item.name}
        </h4>

        <p className="text-xs text-slate-400 leading-relaxed min-h-[36px]">
          {item.description}
        </p>

        {item.statBonus && (
          <div className="mt-2.5 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-indigo-300 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-indigo-400" />
            <span>+{item.statBonus.amount} {item.statBonus.stat.toUpperCase()}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
        <span className="text-[11px] font-heading uppercase tracking-wider text-slate-400 font-medium">
          Slot: {item.type}
        </span>

        {item.isEquipped ? (
          <motion.button
            id={`btn-unequip-${item.id}`}
            whileTap={{ scale: 0.95 }}
            onClick={() => unequipItem(item.id)}
            className="px-3.5 py-1.5 rounded-xl text-xs font-heading font-semibold uppercase tracking-wider bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ShieldOff className="w-3.5 h-3.5 text-slate-400" />
            <span>Unequip</span>
          </motion.button>
        ) : (
          <motion.button
            id={`btn-equip-${item.id}`}
            whileTap={{ scale: 0.95 }}
            onClick={() => equipItem(item.id)}
            className="px-4 py-1.5 rounded-xl text-xs font-heading font-semibold uppercase tracking-wider bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Equip</span>
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};
