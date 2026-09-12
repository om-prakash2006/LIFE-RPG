import { supabase } from '../lib/supabase';
import { profileService } from './profileService';
import { characterService } from './characterService';
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js';

export interface SignUpParams {
  email: string;
  password: string;
  username: string;
  classType?: string;
}

export const authService = {
  async signUp(params: SignUpParams) {
    if (!params.email || !params.password) {
      throw new Error('Email and password are required.');
    }
    if (params.password.length < 6) {
      throw new Error('Password must be at least 6 characters.');
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: params.email.trim(),
        password: params.password,
        options: {
          data: {
            username: params.username.trim(),
            classType: params.classType || 'Cyber Sage',
          },
        },
      });

      if (error) {
        const isRateLimit = (error.message || '').toLowerCase().includes('rate limit');
        if (isRateLimit) {
          // If the email rate limit was triggered because the account was already created or registered,
          // attempt signing in with the provided password
          try {
            const loginRes = await supabase.auth.signInWithPassword({
              email: params.email.trim(),
              password: params.password,
            });
            if (loginRes.data?.user && !loginRes.error) {
              return loginRes.data;
            }
          } catch {
            // Fall through to throw error
          }
        }
        throw error;
      }

      // Automatically initialize profile and character records for the user in Supabase
      if (data.user?.id) {
        const classType = params.classType || 'Cyber Sage';
        // Starter stats calibrated for fresh Level 1 characters
        const baseVal = 20;
        const str = classType === 'Iron Titan' ? 30 : baseVal;
        const int = classType === 'Cyber Sage' ? 30 : baseVal;
        const dis = classType === 'Shadow Stalker' ? 30 : baseVal;

        try {
          await profileService.createProfile({
            user_id: data.user.id,
            username: params.username.trim(),
            email: params.email.trim(),
          });
        } catch (profileErr) {
          console.warn('[authService.signUp] Profile creation notice:', profileErr);
        }

        try {
          await characterService.createCharacter({
            user_id: data.user.id,
            level: 1,
            xp: 0,
            gold: 100,
            strength: str,
            intellect: int,
            discipline: dis,
            vitality: 20,
            knowledge: 20,
          });
        } catch (charErr) {
          console.warn('[authService.signUp] Character creation notice:', charErr);
        }
      }

      return data;
    } catch (err: any) {
      console.warn('[authService.signUp] Auth notice:', err?.message || err);
      throw err;
    }
  },

  async signIn(email: string, password: string) {
    if (!email || !password) {
      throw new Error('Please enter both email and password.');
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        throw error;
      }
      return data;
    } catch (err: any) {
      console.warn('[authService.signIn] Auth notice:', err?.message || err);
      throw err;
    }
  },

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.warn('[authService.signOut] Notice:', error.message);
      }
    } catch (err) {
      console.warn('[authService.signOut] Notice:', err);
    }
  },

  async getSession() {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.warn('[authService.getSession] Notice:', error.message);
        return null;
      }
      return data.session;
    } catch (err) {
      console.warn('[authService.getSession] Notice:', err);
      return null;
    }
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        return null;
      }
      return data.user;
    } catch (err) {
      console.warn('[authService.getCurrentUser] Notice:', err);
      return null;
    }
  },

  onAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    return supabase.auth.onAuthStateChange(callback);
  },
};
