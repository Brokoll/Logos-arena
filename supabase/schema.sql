-- =============================================
-- Logos Arena Database Schema (Phase 5: Production Ready)
-- Run this in Supabase SQL Editor to UPGRADE
-- =============================================

-- WARNING: This drops existing tables to reset properly
DROP TABLE IF EXISTS arguments;
DROP TABLE IF EXISTS debates;
DROP TABLE IF EXISTS profiles;

-- 1. DEBATES TABLE
CREATE TABLE debates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  topic TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'closed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PROFILES TABLE (Linked to Auth)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT,  -- Email prefix or custom handle
  total_score INTEGER DEFAULT 0,
  argument_count INTEGER DEFAULT 0,
  rank INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ARGUMENTS TABLE (Linked to Debates & Profiles)
CREATE TABLE arguments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  debate_id UUID REFERENCES debates(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL, -- Link to Profile (which links to Auth)
  side TEXT NOT NULL CHECK (side IN ('pro', 'con')),
  content TEXT NOT NULL,
  score INTEGER CHECK (score >= 0 AND score <= 100),
  feedback TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- RLS POLICIES
-- =============================================

ALTER TABLE debates ENABLE ROW LEVEL SECURITY;
ALTER TABLE arguments ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Debates: Public Read, Service Role Write (Use Dashboard for inserts)
CREATE POLICY "Public Read Debates" ON debates FOR SELECT USING (true);

-- Arguments: Public Read, Auth User Write
CREATE POLICY "Public Read Arguments" ON arguments FOR SELECT USING (true);
CREATE POLICY "Users can insert own arguments" ON arguments FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Profiles: Public Read, Auth User Update
CREATE POLICY "Public Read Profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- =============================================
-- TRIGGERS & FUNCTIONS
-- =============================================

-- Trigger 1: Auto-create Profile on Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (new.id, split_part(new.email, '@', 1));
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if exists to avoid errors on repeatedly running this script
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Trigger 2: Auto-update Score on Argument Submission
CREATE OR REPLACE FUNCTION public.update_profile_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.profiles
  SET 
    total_score = total_score + COALESCE(new.score, 0),
    argument_count = argument_count + 1
  WHERE id = new.user_id;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_argument_created ON public.arguments;
CREATE TRIGGER on_argument_created
  AFTER INSERT ON public.arguments
  FOR EACH ROW EXECUTE PROCEDURE public.update_profile_stats();

-- =============================================
-- SAMPLE DATA
-- =============================================

INSERT INTO debates (topic, description, status)
VALUES (
  'AI 개발을 규제해야 하는가?',
  '인공지능 기술의 급속한 발전에 따라, 정부 차원의 규제가 필요한지에 대한 토론입니다. 자유롭게 의견을 남겨주세요!',
  'active'
);
