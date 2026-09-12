import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { AuthUser, LocalSession, DbProfile, DbCharacter } from '../types';
import { authService, SignUpParams } from '../services/authService';
import { profileService } from '../services/profileService';
import { characterService } from '../services/characterService';
import { SUPABASE_PROJECT_ID } from '../lib/supabase';

interface AuthContextType {
  user: AuthUser | null;
  session: LocalSession | null;
  profile: DbProfile | null;
  character: DbCharacter | null;
  isLoading: boolean;
  isDataLoading: boolean;
  error: string | null;
  isSupabaseConnected: boolean;
  supabaseProjectId: string;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (params: SignUpParams) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUserData: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_SESSION_KEY = 'liferpg_auth_session';
const STORAGE_PROFILES_KEY = 'liferpg_profiles';
const STORAGE_CHARACTERS_KEY = 'liferpg_characters';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<LocalSession | null>(null);
  const [profile, setProfile] = useState<DbProfile | null>(null);
  const [character, setCharacter] = useState<DbCharacter | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  // Load user data from Supabase
  const loadUserData = useCallback(async (userId: string, userEmail?: string, userMeta?: any) => {
    setIsDataLoading(true);
    setError(null);
    try {
      // 1. Fetch Profile from Supabase
      let fetchedProfile = await profileService.getProfile(userId);
      if (!fetchedProfile) {
        fetchedProfile = await profileService.createProfile({
          user_id: userId,
          username: userMeta?.username || (userEmail ? userEmail.split('@')[0] : 'Hero'),
          email: userEmail || '',
        });
      }

      // If Supabase table is returning null/offline, cache locally
      if (!fetchedProfile) {
        const rawProfiles = localStorage.getItem(STORAGE_PROFILES_KEY);
        const profiles: Record<string, DbProfile> = rawProfiles ? JSON.parse(rawProfiles) : {};
        fetchedProfile = profiles[userId] || {
          id: `profile-${userId}`,
          user_id: userId,
          username: userMeta?.username || (userEmail ? userEmail.split('@')[0] : 'Hero'),
          email: userEmail || '',
          created_at: new Date().toISOString(),
        };
        profiles[userId] = fetchedProfile;
        localStorage.setItem(STORAGE_PROFILES_KEY, JSON.stringify(profiles));
      }

      // 2. Fetch Character from Supabase
      let fetchedCharacter = await characterService.getCharacter(userId);
      const classType = userMeta?.classType || 'Cyber Sage';
      const defaultStr = classType === 'Iron Titan' ? 30 : 20;
      const defaultInt = classType === 'Cyber Sage' ? 30 : 20;
      const defaultDis = classType === 'Shadow Stalker' ? 30 : 20;

      if (!fetchedCharacter) {
        fetchedCharacter = await characterService.createCharacter({
          user_id: userId,
          level: 1,
          xp: 0,
          gold: 100,
          strength: defaultStr,
          intellect: defaultInt,
          discipline: defaultDis,
          vitality: 20,
          knowledge: 20,
        });
      }

      if (!fetchedCharacter) {
        const rawChars = localStorage.getItem(STORAGE_CHARACTERS_KEY);
        const characters: Record<string, DbCharacter> = rawChars ? JSON.parse(rawChars) : {};
        fetchedCharacter = characters[userId] || {
          id: `char-${userId}`,
          user_id: userId,
          level: 1,
          xp: 0,
          gold: 100,
          strength: defaultStr,
          intellect: defaultInt,
          discipline: defaultDis,
          vitality: 20,
          knowledge: 20,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        characters[userId] = fetchedCharacter;
        localStorage.setItem(STORAGE_CHARACTERS_KEY, JSON.stringify(characters));
      }

      setProfile(fetchedProfile);
      setCharacter(fetchedCharacter);
    } catch (err: any) {
      console.warn('[AuthProvider] Supabase sync notice:', err);
    } finally {
      setIsDataLoading(false);
    }
  }, []);

  // Initialize session on mount
  useEffect(() => {
    let isMounted = true;

    async function initAuth() {
      try {
        // Check Supabase active session first
        const supabaseSession = await authService.getSession();
        if (supabaseSession?.user && isMounted) {
          const authUser: AuthUser = {
            id: supabaseSession.user.id,
            email: supabaseSession.user.email || '',
            user_metadata: supabaseSession.user.user_metadata,
          };
          setUser(authUser);
          setSession({
            user: authUser,
            token: supabaseSession.access_token,
          });
          await loadUserData(authUser.id, authUser.email, authUser.user_metadata);
          return;
        }

        // Check if there is a saved valid session in localStorage
        const savedSession = localStorage.getItem(STORAGE_SESSION_KEY);
        if (savedSession && isMounted) {
          try {
            const parsed: LocalSession = JSON.parse(savedSession);
            // Ensure this is a real user ID and not the old demo guest ID
            if (parsed?.user?.id && !parsed.user.id.startsWith('hero-guest')) {
              setUser(parsed.user);
              setSession(parsed);
              await loadUserData(parsed.user.id, parsed.user.email, parsed.user.user_metadata);
              return;
            } else {
              localStorage.removeItem(STORAGE_SESSION_KEY);
            }
          } catch {
            localStorage.removeItem(STORAGE_SESSION_KEY);
          }
        }

        // If no authenticated user exists, remain unauthenticated (no demo user)
        if (isMounted) {
          setUser(null);
          setSession(null);
        }
      } catch (err) {
        console.warn('[AuthProvider] Init session notice:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    initAuth();

    // Listen to Supabase auth state changes
    const { data: authListener } = authService.onAuthStateChange(async (event, newSession) => {
      if (!isMounted) return;

      if (event === 'SIGNED_OUT' || !newSession?.user) {
        setUser(null);
        setSession(null);
        setProfile(null);
        setCharacter(null);
        localStorage.removeItem(STORAGE_SESSION_KEY);
        return;
      }

      if (newSession?.user) {
        const authUser: AuthUser = {
          id: newSession.user.id,
          email: newSession.user.email || '',
          user_metadata: newSession.user.user_metadata,
        };
        const activeSession: LocalSession = {
          user: authUser,
          token: newSession.access_token,
        };
        localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(activeSession));
        setUser(authUser);
        setSession(activeSession);
        await loadUserData(authUser.id, authUser.email, authUser.user_metadata);
      }
    });

    return () => {
      isMounted = false;
      authListener?.subscription?.unsubscribe();
    };
  }, [loadUserData]);

  const signIn = async (email: string, password: string) => {
    setError(null);
    try {
      const data = await authService.signIn(email, password);
      if (data?.user) {
        const authUser: AuthUser = {
          id: data.user.id,
          email: data.user.email || email,
          user_metadata: data.user.user_metadata,
        };
        const activeSession: LocalSession = {
          user: authUser,
          token: data.session?.access_token || `token-${Date.now()}`,
        };
        localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(activeSession));
        setUser(authUser);
        setSession(activeSession);
        await loadUserData(authUser.id, authUser.email, authUser.user_metadata);
      } else {
        throw new Error('Sign in failed. Please check your credentials.');
      }
    } catch (err: any) {
      console.warn('[AuthProvider.signIn] Authentication failed:', err?.message || err);
      const userMessage = err?.message || 'Invalid email or password. Please try again.';
      setError(userMessage);
      throw new Error(userMessage);
    }
  };

  const signUp = async (params: SignUpParams) => {
    setError(null);
    try {
      const data = await authService.signUp(params);
      if (data?.user) {
        const authUser: AuthUser = {
          id: data.user.id,
          email: data.user.email || params.email,
          user_metadata: {
            username: params.username,
            classType: params.classType || 'Cyber Sage',
          },
        };
        const activeSession: LocalSession = {
          user: authUser,
          token: data.session?.access_token || `token-${Date.now()}`,
        };

        if (data.session) {
          localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(activeSession));
          setUser(authUser);
          setSession(activeSession);
          await loadUserData(authUser.id, authUser.email, authUser.user_metadata);
        } else {
          // Supabase project may have email confirmation enabled
          setUser(authUser);
          setSession(activeSession);
          await loadUserData(authUser.id, authUser.email, authUser.user_metadata);
        }
      } else {
        throw new Error('Could not create account. Please try again.');
      }
    } catch (err: any) {
      console.warn('[AuthProvider.signUp] Supabase signUp failed:', err?.message || err);
      const userMessage = err?.message || 'Could not register account. Please check details.';
      setError(userMessage);
      throw new Error(userMessage);
    }
  };

  const signOut = async () => {
    setError(null);
    try {
      await authService.signOut();
    } catch (e) {
      console.warn('Signout warning:', e);
    }
    localStorage.removeItem(STORAGE_SESSION_KEY);
    setSession(null);
    setUser(null);
    setProfile(null);
    setCharacter(null);
  };

  const refreshUserData = async () => {
    if (user) {
      await loadUserData(user.id, user.email, user.user_metadata);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        character,
        isLoading,
        isDataLoading,
        error,
        isSupabaseConnected: true,
        supabaseProjectId: SUPABASE_PROJECT_ID,
        signIn,
        signUp,
        signOut,
        refreshUserData,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
