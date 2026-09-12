export type QuestCategory = 'intellect' | 'strength' | 'discipline' | 'vitality' | 'knowledge';

export type QuestDifficulty = 'easy' | 'medium' | 'hard' | 'legendary';

export type QuestStatus = 'active' | 'completed';

export interface Quest {
  id: string;
  title: string;
  description: string;
  category: QuestCategory;
  difficulty: QuestDifficulty;
  xpReward: number;
  goldReward: number;
  status: QuestStatus;
  dueDate?: string;
  createdAt: string;
}

export interface CharacterStat {
  id: QuestCategory;
  name: string;
  value: number;
  maxValue: number;
  icon: string;
  color: string;
  description: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  isUnlocked: boolean;
  category: string;
  rewardXp: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  isEquipped: boolean;
  type: 'armor' | 'weapon' | 'badge' | 'aura' | 'theme';
  statBonus?: {
    stat: QuestCategory;
    amount: number;
  };
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  price: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  category: 'gear' | 'badges' | 'themes' | 'titles';
}

export interface XPHistoryEntry {
  id: string;
  date: string;
  title: string;
  category: QuestCategory;
  xpEarned: number;
  goldEarned: number;
}

export interface UserProfile {
  username: string;
  title: string;
  email: string;
  avatarUrl: string;
  level: number;
  currentXp: number;
  xpToNextLevel: number;
  gold: number;
  currentStreak: number;
  longestStreak: number;
  totalQuestsCompleted: number;
  totalXpEarned: number;
  classType: string;
  joinedDate: string;
}

export interface DayStreak {
  day: string; // 'MON', 'TUE', etc.
  completed: boolean;
  isToday: boolean;
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: 'xp' | 'gold' | 'level' | 'success' | 'info';
  xp?: number;
  gold?: number;
}

// Local Auth Entities
export interface AuthUser {
  id: string;
  email: string;
  user_metadata?: {
    username?: string;
    classType?: string;
  };
}

export interface LocalSession {
  user: AuthUser;
  token?: string;
}

// Player Data Entities
export interface DbProfile {
  id: string;
  user_id: string;
  username: string;
  email: string;
  created_at: string;
}

export interface DbCharacter {
  id: string;
  user_id: string;
  level: number;
  xp: number;
  gold: number;
  strength: number;
  intellect: number;
  discipline: number;
  vitality: number;
  knowledge: number;
  created_at: string;
  updated_at: string;
}

export interface DbTask {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  xp_reward: number;
  gold_reward: number;
  completed: boolean;
  created_at: string;
  completed_at: string | null;
}
