import { supabase } from '../lib/supabase';
import { DbCharacter } from '../types';

export const characterService = {
  async getCharacter(userId: string): Promise<DbCharacter | null> {
    try {
      const { data, error } = await supabase
        .from('characters')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.warn('[characterService.getCharacter] Supabase notice:', error.message);
        return null;
      }
      return data as DbCharacter | null;
    } catch (err) {
      console.warn('[characterService.getCharacter] Error:', err);
      return null;
    }
  },

  async createCharacter(params: {
    user_id: string;
    level?: number;
    xp?: number;
    gold?: number;
    strength?: number;
    intellect?: number;
    discipline?: number;
    vitality?: number;
    knowledge?: number;
  }): Promise<DbCharacter | null> {
    try {
      const now = new Date().toISOString();
      const newChar = {
        user_id: params.user_id,
        level: params.level ?? 1,
        xp: params.xp ?? 0,
        gold: params.gold ?? 150,
        strength: params.strength ?? 20,
        intellect: params.intellect ?? 20,
        discipline: params.discipline ?? 20,
        vitality: params.vitality ?? 20,
        knowledge: params.knowledge ?? 20,
        created_at: now,
        updated_at: now,
      };

      const { data, error } = await supabase
        .from('characters')
        .insert([newChar])
        .select()
        .single();

      if (error) {
        console.warn('[characterService.createCharacter] Supabase notice:', error.message);
        return {
          id: `char-${params.user_id}`,
          ...newChar,
        };
      }
      return data as DbCharacter;
    } catch (err) {
      console.warn('[characterService.createCharacter] Error:', err);
      return null;
    }
  },

  async updateCharacter(
    userId: string,
    updates: Partial<Omit<DbCharacter, 'id' | 'user_id' | 'created_at'>>
  ): Promise<DbCharacter | null> {
    try {
      const { data, error } = await supabase
        .from('characters')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        console.warn('[characterService.updateCharacter] Supabase notice:', error.message);
        return null;
      }
      return data as DbCharacter;
    } catch (err) {
      console.warn('[characterService.updateCharacter] Error:', err);
      return null;
    }
  },

  async getAllCharacters(): Promise<DbCharacter[]> {
    try {
      const { data, error } = await supabase
        .from('characters')
        .select('*');

      if (error) {
        console.warn('[characterService.getAllCharacters] Supabase notice:', error.message);
        try {
          const stored = localStorage.getItem('liferpg_characters');
          if (stored) {
            const list: DbCharacter[] = Object.values(JSON.parse(stored));
            return list.filter((c) => c.user_id && !c.user_id.startsWith('hero-guest'));
          }
        } catch {}
        return [];
      }
      const list = (data as DbCharacter[]) || [];
      return list.filter((c) => c.user_id && !c.user_id.startsWith('hero-guest'));
    } catch (err) {
      console.warn('[characterService.getAllCharacters] Error:', err);
      return [];
    }
  },
};
