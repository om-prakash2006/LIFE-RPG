import { supabase } from '../lib/supabase';
import { Quest } from '../types';

export const questService = {
  async getQuests(userId: string): Promise<Quest[]> {
    try {
      const { data, error } = await supabase
        .from('user_quests')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('[questService.getQuests] Supabase notice:', error.message);
        return [];
      }

      if (!data) return [];

      return data.map((row: any) => ({
        id: row.id,
        title: row.title,
        description: row.description || '',
        category: row.category || 'discipline',
        difficulty: row.difficulty || 'medium',
        xpReward: row.xp_reward ?? 50,
        goldReward: row.gold_reward ?? 25,
        status: row.completed ? 'completed' : 'active',
        dueDate: 'Today',
        createdAt: row.created_at ? row.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
      }));
    } catch (err) {
      console.warn('[questService.getQuests] Error:', err);
      return [];
    }
  },

  async createQuest(userId: string, quest: Omit<Quest, 'id' | 'status' | 'createdAt'>): Promise<Quest | null> {
    try {
      const now = new Date().toISOString();
      const newRow = {
        user_id: userId,
        title: quest.title,
        description: quest.description,
        category: quest.category,
        difficulty: quest.difficulty,
        xp_reward: quest.xpReward,
        gold_reward: quest.goldReward,
        completed: false,
        streak: 0,
        created_at: now,
      };

      const { data, error } = await supabase
        .from('user_quests')
        .insert([newRow])
        .select()
        .single();

      if (error) {
        console.warn('[questService.createQuest] Supabase notice:', error.message);
        return {
          ...quest,
          id: `quest-${Date.now()}`,
          status: 'active',
          dueDate: 'Today',
          createdAt: now.split('T')[0],
        };
      }

      return {
        id: data.id,
        title: data.title,
        description: data.description || '',
        category: data.category || 'discipline',
        difficulty: data.difficulty || 'medium',
        xpReward: data.xp_reward,
        goldReward: data.gold_reward,
        status: data.completed ? 'completed' : 'active',
        dueDate: 'Today',
        createdAt: data.created_at ? data.created_at.split('T')[0] : now.split('T')[0],
      };
    } catch (err) {
      console.warn('[questService.createQuest] Error:', err);
      return {
        ...quest,
        id: `quest-${Date.now()}`,
        status: 'active',
        dueDate: 'Today',
        createdAt: new Date().toISOString().split('T')[0],
      };
    }
  },

  async updateQuestStatus(questId: string, completed: boolean): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_quests')
        .update({ completed })
        .eq('id', questId);

      if (error) {
        console.warn('[questService.updateQuestStatus] Supabase notice:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.warn('[questService.updateQuestStatus] Error:', err);
      return false;
    }
  },

  async updateQuest(questId: string, updates: Partial<Quest>): Promise<boolean> {
    try {
      const dbUpdates: any = {};
      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.description !== undefined) dbUpdates.description = updates.description;
      if (updates.category !== undefined) dbUpdates.category = updates.category;
      if (updates.difficulty !== undefined) dbUpdates.difficulty = updates.difficulty;
      if (updates.xpReward !== undefined) dbUpdates.xp_reward = updates.xpReward;
      if (updates.goldReward !== undefined) dbUpdates.gold_reward = updates.goldReward;
      if (updates.status !== undefined) dbUpdates.completed = updates.status === 'completed';

      const { error } = await supabase
        .from('user_quests')
        .update(dbUpdates)
        .eq('id', questId);

      if (error) {
        console.warn('[questService.updateQuest] Supabase notice:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.warn('[questService.updateQuest] Error:', err);
      return false;
    }
  },

  async deleteQuest(questId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_quests')
        .delete()
        .eq('id', questId);

      if (error) {
        console.warn('[questService.deleteQuest] Supabase notice:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.warn('[questService.deleteQuest] Error:', err);
      return false;
    }
  },
};
