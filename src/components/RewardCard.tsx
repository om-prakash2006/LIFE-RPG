import React from 'react';
import { motion } from 'motion/react';
import { Coins, ShoppingBag, Check } from 'lucide-react';
import { ShopItem } from '../types';
import { CategoryIcon } from './CategoryIcon';
import { useGame } from '../context/GameContext';

interface RewardCardProps {
  item: ShopItem;
  isOwned?: boolean;
}

export const RewardCard: React.FC<RewardCardProps> = ({ item, isOwned = false }) => {
  const { buyShopItem, user } = useGame();
  const canAfford = user.gold >= item.price;

  const rarityBadge = {
    common: 'bg-slate-800 text-slate-300 border-slate-700',
    rare: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    epic: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    legendary: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  };

  return (
    <motion.div
      id={`shop-item-${item.id}`}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="relative overflow-hidden rounded-2xl border border-slate-800 hover:border-slate-700 bg-slate-900/85 p-5 transition-all duration-200 backdrop-blur-md flex flex-col justify-between shadow-sm"
    >
      {/* Corner badge for rarity */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <span
          className={`text-[10px] font-heading font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
            rarityBadge[item.rarity]
          }`}
        >
          {item.rarity}
        </span>
        <span className="text-[11px] font-heading uppercase tracking-wider text-slate-400 font-medium">
          {item.category}
        </span>
      </div>

      {/* Item Visual Center */}
      <div className="flex flex-col items-center text-center my-2">
        <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-amber-400 shadow-inner mb-3">
          <CategoryIcon iconName={item.icon} className="w-7 h-7" />
        </div>

        <h4 className="text-base font-semibold font-heading uppercase tracking-tight text-slate-100 mb-1">
          {item.name}
        </h4>

        <p className="text-xs text-slate-400 leading-relaxed min-h-[36px]">
          {item.description}
        </p>
      </div>

      {/* Price & Buy Action */}
      <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 font-mono">
          <Coins className="w-4 h-4 text-amber-400" />
          <span className="text-base font-bold text-amber-300">{item.price}</span>
          <span className="text-[10px] font-heading uppercase text-slate-400 font-medium">Gold</span>
        </div>

        {isOwned ? (
          <span className="px-3 py-1.5 rounded-xl text-xs font-heading font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-1">
            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            Owned
          </span>
        ) : (
          <motion.button
            id={`btn-buy-${item.id}`}
            whileTap={{ scale: 0.95 }}
            disabled={!canAfford}
            onClick={() => buyShopItem(item)}
            className={`px-4 py-1.5 rounded-xl text-xs font-heading uppercase font-semibold tracking-wider transition-all flex items-center gap-1.5 ${
              canAfford
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-sm cursor-pointer'
                : 'bg-slate-800 text-slate-500 border border-slate-700/60 cursor-not-allowed'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Buy</span>
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};
