import {
  UserProfile,
  CharacterStat,
  Quest,
  InventoryItem,
  ShopItem,
  Achievement,
  XPHistoryEntry,
  DayStreak,
} from '../types';

// Clean initial state for newly created player accounts
export const defaultInitialUser: UserProfile = {
  username: 'Hero',
  title: 'Novice Adventurer',
  email: '',
  avatarUrl: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=250',
  level: 1,
  currentXp: 0,
  xpToNextLevel: 100,
  gold: 100,
  currentStreak: 0,
  longestStreak: 0,
  totalQuestsCompleted: 0,
  totalXpEarned: 0,
  classType: 'Cyber Sage',
  joinedDate: 'Joined recently',
};

// Base stats at level 1
export const defaultBaseStats: CharacterStat[] = [
  {
    id: 'intellect',
    name: 'Intellect',
    value: 20,
    maxValue: 100,
    icon: 'Brain',
    color: '#06b6d4',
    description: 'Improved by studying, coding and learning.',
  },
  {
    id: 'strength',
    name: 'Strength',
    value: 20,
    maxValue: 100,
    icon: 'Dumbbell',
    color: '#f43f5e',
    description: 'Improved by physical training, lifting and endurance.',
  },
  {
    id: 'discipline',
    name: 'Discipline',
    value: 20,
    maxValue: 100,
    icon: 'Flame',
    color: '#f59e0b',
    description: 'Improved by sticking to routines and avoiding distractions.',
  },
  {
    id: 'vitality',
    name: 'Vitality',
    value: 20,
    maxValue: 100,
    icon: 'Heart',
    color: '#10b981',
    description: 'Improved by sleep, healthy nutrition and hydration.',
  },
  {
    id: 'knowledge',
    name: 'Knowledge',
    value: 20,
    maxValue: 100,
    icon: 'BookOpen',
    color: '#8b5cf6',
    description: 'Improved by reading, deep research and curiosity.',
  },
];

// Empty list - all quests are user-created and saved in Supabase
export const defaultQuests: Quest[] = [];

// Empty initial streak
export const defaultWeeklyStreak: DayStreak[] = [
  { day: 'MON', completed: false, isToday: false },
  { day: 'TUE', completed: false, isToday: false },
  { day: 'WED', completed: false, isToday: false },
  { day: 'THU', completed: false, isToday: false },
  { day: 'FRI', completed: false, isToday: false },
  { day: 'SAT', completed: false, isToday: false },
  { day: 'SUN', completed: false, isToday: true },
];

// Achievements system (locked for new accounts)
export const realAchievements: Achievement[] = [
  {
    id: 'ach-1',
    title: 'First Quest',
    description: 'Complete your very first real-world quest in the realm.',
    icon: 'Trophy',
    isUnlocked: false,
    category: 'Progression',
    rewardXp: 50,
  },
  {
    id: 'ach-2',
    title: 'Quest Hunter',
    description: 'Complete 10 quests across categories.',
    icon: 'Swords',
    isUnlocked: false,
    category: 'Combat',
    rewardXp: 150,
  },
  {
    id: 'ach-3',
    title: '7 Day Warrior',
    description: 'Maintain a daily quest streak for 7 consecutive days.',
    icon: 'Flame',
    isUnlocked: false,
    category: 'Discipline',
    rewardXp: 200,
  },
  {
    id: 'ach-4',
    title: 'Scholar of Wisdom',
    description: 'Reach Intellect score 50 through continuous learning.',
    icon: 'GraduationCap',
    isUnlocked: false,
    category: 'Intellect',
    rewardXp: 180,
  },
  {
    id: 'ach-5',
    title: 'Iron Will',
    description: 'Complete 5 hard difficulty quests.',
    icon: 'ShieldAlert',
    isUnlocked: false,
    category: 'Mastery',
    rewardXp: 300,
  },
  {
    id: 'ach-6',
    title: 'Grandmaster of Life',
    description: 'Reach Level 10 and max out a core stat.',
    icon: 'Crown',
    isUnlocked: false,
    category: 'Legendary',
    rewardXp: 500,
  },
];

// Catalog of items purchasable with in-game gold earned from quests
export const standardShopCatalog: ShopItem[] = [
  {
    id: 'shop-1',
    name: 'Cyber Shield',
    description: 'A kinetic energy shield providing +10 Discipline barrier aura.',
    icon: 'Shield',
    price: 150,
    rarity: 'rare',
    category: 'gear',
  },
  {
    id: 'shop-2',
    name: 'Warrior Badge',
    description: 'An elite crest honoring champions who conquer physical fatigue (+15 Strength).',
    icon: 'Award',
    price: 300,
    rarity: 'epic',
    category: 'badges',
  },
  {
    id: 'shop-3',
    name: 'Neon Theme',
    description: 'Unlocks the high-voltage Synthwave Violet UI skin for your game interface.',
    icon: 'Palette',
    price: 500,
    rarity: 'epic',
    category: 'themes',
  },
  {
    id: 'shop-4',
    name: 'Legendary Crown',
    description: 'The regal coronal array worn only by sovereigns of personal discipline.',
    icon: 'Crown',
    price: 1000,
    rarity: 'legendary',
    category: 'titles',
  },
  {
    id: 'shop-5',
    name: 'Neural Codex Blade',
    description: 'A laser-edged data saber augmenting mental analytical velocity (+20 Intellect).',
    icon: 'Sword',
    price: 400,
    rarity: 'rare',
    category: 'gear',
  },
  {
    id: 'shop-6',
    name: 'Phoenix Feather Charm',
    description: 'Protects a streak if you miss a single daily quest checkpoint.',
    icon: 'Feather',
    price: 250,
    rarity: 'rare',
    category: 'gear',
  },
];

// Empty inventory
export const defaultInventory: InventoryItem[] = [];

// Empty XP history
export const defaultXPHistory: XPHistoryEntry[] = [];
