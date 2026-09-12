import { supabase } from '../lib/supabase';
import { DbProfile } from '../types';

export const profileService = {
  async getProfile(userId: string): Promise<DbProfile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.warn('[profileService.getProfile] Supabase notice:', error.message);
        return null;
      }
      return data as DbProfile | null;
    } catch (err) {
      console.warn('[profileService.getProfile] Error:', err);
      return null;
    }
  },

  async createProfile(params: {
    user_id: string;
    username: string;
    email: string;
  }): Promise<DbProfile | null> {
    try {
      const newRecord = {
        user_id: params.user_id,
        username: params.username,
        email: params.email,
        created_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('profiles')
        .insert([newRecord])
        .select()
        .single();

      if (error) {
        console.warn('[profileService.createProfile] Supabase notice:', error.message);
        return {
          id: `profile-${params.user_id}`,
          ...newRecord,
        };
      }
      return data as DbProfile;
    } catch (err) {
      console.warn('[profileService.createProfile] Error:', err);
      return {
        id: `profile-${params.user_id}`,
        user_id: params.user_id,
        username: params.username,
        email: params.email,
        created_at: new Date().toISOString(),
      };
    }
  },

  async updateProfile(
    userId: string,
    updates: Partial<Pick<DbProfile, 'username'>>
  ): Promise<DbProfile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        console.warn('[profileService.updateProfile] Supabase notice:', error.message);
        return null;
      }
      return data as DbProfile;
    } catch (err) {
      console.warn('[profileService.updateProfile] Error:', err);
      return null;
    }
  },

  async getAllProfiles(): Promise<DbProfile[]> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('[profileService.getAllProfiles] Supabase notice:', error.message);
        // Fallback to local storage profiles if any
        try {
          const stored = localStorage.getItem('liferpg_profiles');
          if (stored) {
            const list: DbProfile[] = Object.values(JSON.parse(stored));
            return list.filter(
              (p) => p.user_id && !p.user_id.startsWith('hero-guest') && p.email !== 'hero@realm.local'
            );
          }
        } catch {}
        return [];
      }
      const list = (data as DbProfile[]) || [];
      return list.filter(
        (p) => p.user_id && !p.user_id.startsWith('hero-guest') && p.email !== 'hero@realm.local'
      );
    } catch (err) {
      console.warn('[profileService.getAllProfiles] Error:', err);
      return [];
    }
  },
};
