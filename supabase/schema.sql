-- Supabase Database Schema for LifeRPG
-- Project ID: pixatvidlimrbimmuzqs
-- Run this script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/pixatvidlimrbimmuzqs/sql/new

-- 1. Create Profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT unique_user_profile UNIQUE (user_id)
);

-- 2. Create Characters table (stores RPG stats, level, xp, gold)
CREATE TABLE IF NOT EXISTS public.characters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  level INTEGER DEFAULT 1 NOT NULL,
  xp INTEGER DEFAULT 0 NOT NULL,
  gold INTEGER DEFAULT 150 NOT NULL,
  strength INTEGER DEFAULT 20 NOT NULL,
  intellect INTEGER DEFAULT 20 NOT NULL,
  discipline INTEGER DEFAULT 20 NOT NULL,
  vitality INTEGER DEFAULT 20 NOT NULL,
  knowledge INTEGER DEFAULT 20 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT unique_user_character UNIQUE (user_id)
);

-- 3. Create User Quests table
CREATE TABLE IF NOT EXISTS public.user_quests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'discipline' NOT NULL,
  difficulty TEXT DEFAULT 'medium' NOT NULL,
  xp_reward INTEGER DEFAULT 50 NOT NULL,
  gold_reward INTEGER DEFAULT 25 NOT NULL,
  completed BOOLEAN DEFAULT false NOT NULL,
  streak INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_quests ENABLE ROW LEVEL SECURITY;

-- 5. Profiles RLS Policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- 6. Characters RLS Policies
CREATE POLICY "Users can view their own character"
  ON public.characters FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own character"
  ON public.characters FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own character"
  ON public.characters FOR UPDATE
  USING (auth.uid() = user_id);

-- 7. Quests RLS Policies
CREATE POLICY "Users can view their own quests"
  ON public.user_quests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own quests"
  ON public.user_quests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own quests"
  ON public.user_quests FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own quests"
  ON public.user_quests FOR DELETE
  USING (auth.uid() = user_id);
