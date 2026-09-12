import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useAuth } from './AuthContext';
import { characterService } from '../services/characterService';
import { questService } from '../services/questService';
import {
  UserProfile,
  Quest,
  CharacterStat,
  InventoryItem,
  ShopItem,
  Achievement,
  XPHistoryEntry,
  ToastMessage,
  DayStreak,
} from '../types';
import {
  defaultInitialUser,
  defaultQuests,
  defaultBaseStats,
  defaultInventory,
  standardShopCatalog,
  realAchievements,
  defaultXPHistory,
  defaultWeeklyStreak,
} from '../data/gameDefaults';

interface GameContextType {
  user: UserProfile;
  quests: Quest[];
  stats: CharacterStat[];
  inventory: InventoryItem[];
  shopItems: ShopItem[];
  achievements: Achievement[];
  xpHistory: XPHistoryEntry[];
  weeklyStreak: DayStreak[];
  toasts: ToastMessage[];
  levelUpData: { isShowing: boolean; oldLevel: number; newLevel: number } | null;
  isDataLoading: boolean;
  dbError: string | null;
  refreshGameData: () => Promise<void>;
  completeQuest: (questId: string) => void;
  addQuest: (quest: Omit<Quest, 'id' | 'status' | 'createdAt'>) => void;
  editQuest: (questId: string, updated: Partial<Quest>) => void;
  deleteQuest: (questId: string) => void;
  buyShopItem: (item: ShopItem) => boolean;
  equipItem: (itemId: string) => void;
  unequipItem: (itemId: string) => void;
  dismissToast: (id: string) => void;
  closeLevelUpModal: () => void;
  triggerLevelUpPreview: () => void;
  resetGameData: () => void;
}

const STORAGE_GAME_DATA_KEY = 'liferpg_game_data_v2';

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user: authUser, profile, character, isDataLoading: isAuthLoading, refreshUserData } = useAuth();
  
  // Clean initial state (no dummy records)
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_GAME_DATA_KEY}_user`);
      return saved ? JSON.parse(saved) : defaultInitialUser;
    } catch {
      return defaultInitialUser;
    }
  });

  const [quests, setQuests] = useState<Quest[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_GAME_DATA_KEY}_quests`);
      return saved ? JSON.parse(saved) : defaultQuests;
    } catch {
      return defaultQuests;
    }
  });

  const [stats, setStats] = useState<CharacterStat[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_GAME_DATA_KEY}_stats`);
      return saved ? JSON.parse(saved) : defaultBaseStats;
    } catch {
      return defaultBaseStats;
    }
  });

  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_GAME_DATA_KEY}_inventory`);
      return saved ? JSON.parse(saved) : defaultInventory;
    } catch {
      return defaultInventory;
    }
  });

  const [shopItems] = useState<ShopItem[]>(standardShopCatalog);
  const [achievements, setAchievements] = useState<Achievement[]>(realAchievements);
  const [xpHistory, setXpHistory] = useState<XPHistoryEntry[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_GAME_DATA_KEY}_history`);
      return saved ? JSON.parse(saved) : defaultXPHistory;
    } catch {
      return defaultXPHistory;
    }
  });
  const [weeklyStreak, setWeeklyStreak] = useState<DayStreak[]>(defaultWeeklyStreak);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [levelUpData, setLevelUpData] = useState<{ isShowing: boolean; oldLevel: number; newLevel: number } | null>(null);
  const [isQuestsLoading, setIsQuestsLoading] = useState(false);

  // Load real quests from Supabase when user is authenticated
  useEffect(() => {
    let isCancelled = false;
    async function loadUserQuests() {
      if (!authUser?.id) {
        setQuests([]);
        return;
      }
      setIsQuestsLoading(true);
      try {
        const dbQuests = await questService.getQuests(authUser.id);
        if (!isCancelled && dbQuests) {
          setQuests(dbQuests);
        }
      } catch (err) {
        console.warn('[GameContext] Quest loading notice:', err);
      } finally {
        if (!isCancelled) setIsQuestsLoading(false);
      }
    }

    loadUserQuests();
    return () => {
      isCancelled = true;
    };
  }, [authUser?.id]);

  // Persist game state to local storage on changes
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_GAME_DATA_KEY}_user`, JSON.stringify(user));
    } catch (e) {
      console.warn('Could not save user data to localStorage', e);
    }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_GAME_DATA_KEY}_quests`, JSON.stringify(quests));
    } catch (e) {
      console.warn('Could not save quests to localStorage', e);
    }
  }, [quests]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_GAME_DATA_KEY}_stats`, JSON.stringify(stats));
    } catch (e) {
      console.warn('Could not save stats to localStorage', e);
    }
  }, [stats]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_GAME_DATA_KEY}_inventory`, JSON.stringify(inventory));
    } catch (e) {
      console.warn('Could not save inventory to localStorage', e);
    }
  }, [inventory]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_GAME_DATA_KEY}_history`, JSON.stringify(xpHistory));
    } catch (e) {
      console.warn('Could not save history to localStorage', e);
    }
  }, [xpHistory]);

  // Synchronize authenticated profile details from Supabase
  useEffect(() => {
    if (!authUser) {
      setUser(defaultInitialUser);
      setQuests([]);
      setInventory([]);
      setXpHistory([]);
      return;
    }

    if (profile || character) {
      setUser((prev) => ({
        ...prev,
        username: profile?.username || prev.username,
        email: profile?.email || authUser?.email || prev.email,
        level: character?.level ?? prev.level,
        currentXp: character?.xp ?? prev.currentXp,
        xpToNextLevel: Math.max(100, Math.round((character?.level ?? 1) * 150)),
        gold: character?.gold ?? prev.gold,
        classType: (authUser?.user_metadata?.classType as string) || prev.classType,
      }));
    }

    if (character) {
      setStats((prev) =>
        prev.map((s) => {
          if (s.id === 'intellect') return { ...s, value: character.intellect };
          if (s.id === 'strength') return { ...s, value: character.strength };
          if (s.id === 'discipline') return { ...s, value: character.discipline };
          if (s.id === 'vitality') return { ...s, value: character.vitality };
          if (s.id === 'knowledge') return { ...s, value: character.knowledge };
          return s;
        })
      );
    }
  }, [profile, character, authUser]);

  // Synchronize progression back to Supabase for logged-in user
  useEffect(() => {
    if (authUser?.id) {
      const timer = setTimeout(() => {
        const intel = stats.find((s) => s.id === 'intellect')?.value;
        const str = stats.find((s) => s.id === 'strength')?.value;
        const dis = stats.find((s) => s.id === 'discipline')?.value;
        const vit = stats.find((s) => s.id === 'vitality')?.value;
        const knw = stats.find((s) => s.id === 'knowledge')?.value;

        characterService
          .updateCharacter(authUser.id, {
            level: user.level,
            xp: user.currentXp,
            gold: user.gold,
            intellect: intel,
            strength: str,
            discipline: dis,
            vitality: vit,
            knowledge: knw,
          })
          .catch((err) => console.warn('[GameContext] Supabase character sync notice:', err));
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [user.level, user.currentXp, user.gold, stats, authUser?.id]);

  const resetGameData = () => {
    localStorage.removeItem(`${STORAGE_GAME_DATA_KEY}_user`);
    localStorage.removeItem(`${STORAGE_GAME_DATA_KEY}_quests`);
    localStorage.removeItem(`${STORAGE_GAME_DATA_KEY}_stats`);
    localStorage.removeItem(`${STORAGE_GAME_DATA_KEY}_inventory`);
    localStorage.removeItem(`${STORAGE_GAME_DATA_KEY}_history`);
    setUser(defaultInitialUser);
    setQuests(defaultQuests);
    setStats(defaultBaseStats);
    setInventory(defaultInventory);
    setXpHistory(defaultXPHistory);
    setWeeklyStreak(defaultWeeklyStreak);
    addToast({
      title: 'Progress Reset',
      description: 'Clean level 1 state initialized.',
      type: 'info',
    });
  };

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const newToast: ToastMessage = {
      ...toast,
      id: Math.random().toString(36).substring(2, 9),
    };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#06b6d4', '#f59e0b', '#8b5cf6', '#10b981'],
      });
    } catch {
      // safe fallback
    }
  };

  const triggerLevelUp = (oldLevel: number, newLevel: number) => {
    try {
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#f59e0b', '#fbbf24', '#ec4899', '#38bdf8', '#a855f7'],
      });
    } catch {
      // safe fallback
    }
    setLevelUpData({ isShowing: true, oldLevel, newLevel });
  };

  const closeLevelUpModal = () => {
    setLevelUpData(null);
  };

  const triggerLevelUpPreview = () => {
    triggerLevelUp(user.level, user.level + 1);
  };

  const completeQuest = (questId: string) => {
    const quest = quests.find((q) => q.id === questId);
    if (!quest || quest.status === 'completed') return;

    // Update quest status locally
    setQuests((prev) =>
      prev.map((q) => (q.id === questId ? { ...q, status: 'completed' } : q))
    );

    // Sync to Supabase if logged in
    if (authUser?.id) {
      questService.updateQuestStatus(questId, true).catch((err) =>
        console.warn('[completeQuest] Supabase sync notice:', err)
      );
    }

    // Update stats by category
    setStats((prev) =>
      prev.map((s) => {
        if (s.id === quest.category) {
          return {
            ...s,
            value: Math.min(s.maxValue, s.value + 4),
          };
        }
        return s;
      })
    );

    // Add to XP history
    const newHistoryEntry: XPHistoryEntry = {
      id: `hist-${Date.now()}`,
      date: 'Today',
      title: quest.title,
      category: quest.category,
      xpEarned: quest.xpReward,
      goldEarned: quest.goldReward,
    };
    setXpHistory((prev) => [newHistoryEntry, ...prev]);

    // Calculate progression
    let newXp = user.currentXp + quest.xpReward;
    let newLevel = user.level;
    let nextLevelXp = user.xpToNextLevel;
    let didLevelUp = false;

    if (newXp >= nextLevelXp) {
      didLevelUp = true;
      newLevel += 1;
      newXp = newXp - nextLevelXp;
      nextLevelXp = Math.round(nextLevelXp * 1.35);
    }

    const newGold = user.gold + quest.goldReward;

    setUser((prev) => ({
      ...prev,
      level: newLevel,
      currentXp: newXp,
      xpToNextLevel: nextLevelXp,
      gold: newGold,
      totalQuestsCompleted: prev.totalQuestsCompleted + 1,
      totalXpEarned: prev.totalXpEarned + quest.xpReward,
    }));

    // Check and unlock real achievements dynamically
    setAchievements((prev) =>
      prev.map((ach) => {
        if (ach.id === 'ach-1' && !ach.isUnlocked) {
          return { ...ach, isUnlocked: true, unlockedAt: 'Today' };
        }
        if (ach.id === 'ach-2' && !ach.isUnlocked && user.totalQuestsCompleted + 1 >= 10) {
          return { ...ach, isUnlocked: true, unlockedAt: 'Today' };
        }
        return ach;
      })
    );

    triggerCelebration();

    addToast({
      title: 'Quest Completed!',
      description: `"${quest.title}" conquered!`,
      type: 'success',
      xp: quest.xpReward,
      gold: quest.goldReward,
    });

    if (didLevelUp) {
      setTimeout(() => {
        triggerLevelUp(user.level, newLevel);
      }, 500);
    }
  };

  const addQuest = async (newQuestData: Omit<Quest, 'id' | 'status' | 'createdAt'>) => {
    const tempId = `quest-${Date.now()}`;
    const today = new Date().toISOString().split('T')[0];

    const localQuest: Quest = {
      ...newQuestData,
      id: tempId,
      status: 'active',
      createdAt: today,
      dueDate: 'Today',
    };

    setQuests((prev) => [localQuest, ...prev]);

    addToast({
      title: 'Quest Created',
      description: `"${localQuest.title}" added to your log!`,
      type: 'info',
    });

    // Save to Supabase if logged in
    if (authUser?.id) {
      try {
        const created = await questService.createQuest(authUser.id, newQuestData);
        if (created) {
          // Replace temp id with real database id
          setQuests((prev) => prev.map((q) => (q.id === tempId ? created : q)));
        }
      } catch (err) {
        console.warn('[addQuest] Supabase create notice:', err);
      }
    }
  };

  const editQuest = (questId: string, updated: Partial<Quest>) => {
    setQuests((prev) =>
      prev.map((q) => (q.id === questId ? { ...q, ...updated } : q))
    );

    if (authUser?.id) {
      questService.updateQuest(questId, updated).catch((err) =>
        console.warn('[editQuest] Supabase notice:', err)
      );
    }

    addToast({
      title: 'Quest Updated',
      description: 'Changes successfully saved to quest log.',
      type: 'info',
    });
  };

  const deleteQuest = (questId: string) => {
    const target = quests.find((q) => q.id === questId);
    setQuests((prev) => prev.filter((q) => q.id !== questId));

    if (authUser?.id) {
      questService.deleteQuest(questId).catch((err) =>
        console.warn('[deleteQuest] Supabase notice:', err)
      );
    }

    addToast({
      title: 'Quest Abandoned',
      description: target ? `"${target.title}" removed.` : 'Quest removed.',
      type: 'info',
    });
  };

  const buyShopItem = (item: ShopItem): boolean => {
    if (user.gold < item.price) {
      addToast({
        title: 'Not Enough Gold!',
        description: `You need ${item.price - user.gold} more gold to acquire this item.`,
        type: 'info',
      });
      return false;
    }

    // Deduct gold
    setUser((prev) => ({
      ...prev,
      gold: prev.gold - item.price,
    }));

    // Add to inventory if not already present
    const existing = inventory.find((inv) => inv.name === item.name);
    if (!existing) {
      const newInvItem: InventoryItem = {
        id: `inv-${Date.now()}`,
        name: item.name,
        description: item.description,
        icon: item.icon,
        rarity: item.rarity,
        isEquipped: false,
        type: item.category === 'badges' ? 'badge' : item.category === 'themes' ? 'theme' : 'armor',
        statBonus: {
          stat: 'discipline',
          amount: item.rarity === 'legendary' ? 25 : 12,
        },
      };
      setInventory((prev) => [newInvItem, ...prev]);
    }

    addToast({
      title: 'Item Acquired!',
      description: `Added "${item.name}" to your hero vault.`,
      type: 'success',
      gold: -item.price,
    });

    return true;
  };

  const equipItem = (itemId: string) => {
    setInventory((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, isEquipped: true } : item))
    );
    const item = inventory.find((i) => i.id === itemId);
    addToast({
      title: 'Gear Equipped',
      description: item ? `${item.name} is now active.` : 'Item equipped.',
      type: 'info',
    });
  };

  const unequipItem = (itemId: string) => {
    setInventory((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, isEquipped: false } : item))
    );
    const item = inventory.find((i) => i.id === itemId);
    addToast({
      title: 'Gear Unequipped',
      description: item ? `${item.name} moved to vault.` : 'Item unequipped.',
      type: 'info',
    });
  };

  const refreshGameData = async () => {
    await refreshUserData();
    if (authUser?.id) {
      const dbQuests = await questService.getQuests(authUser.id);
      if (dbQuests) {
        setQuests(dbQuests);
      }
    }
  };

  return (
    <GameContext.Provider
      value={{
        user,
        quests,
        stats,
        inventory,
        shopItems,
        achievements,
        xpHistory,
        weeklyStreak,
        toasts,
        levelUpData,
        isDataLoading: isAuthLoading || isQuestsLoading,
        dbError: null,
        refreshGameData,
        completeQuest,
        addQuest,
        editQuest,
        deleteQuest,
        buyShopItem,
        equipItem,
        unequipItem,
        dismissToast,
        closeLevelUpModal,
        triggerLevelUpPreview,
        resetGameData,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
