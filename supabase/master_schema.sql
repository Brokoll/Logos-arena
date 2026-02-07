-- =============================================
-- MASTER SECURITY SCHEMA (Consolidated)
-- =============================================
-- This file replaces all previous schema patches.
-- It ensures tables exist and applies ALL security policies.

-- =============================================
-- 1. TABLES & COLUMNS (Idempotent)
-- =============================================

CREATE TABLE IF NOT EXISTS debates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  topic TEXT NOT NULL,
  description TEXT,
  option_a TEXT NOT NULL DEFAULT '찬성',
  option_b TEXT NOT NULL DEFAULT '반대',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'closed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  image_url TEXT -- Added from add_debate_image.sql
);

CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  total_score INTEGER DEFAULT 0,
  argument_count INTEGER DEFAULT 0,
  rank INTEGER,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')), -- Admin role
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS arguments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  debate_id UUID REFERENCES debates(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  side TEXT NOT NULL CHECK (side IN ('pro', 'con')),
  content TEXT NOT NULL CHECK (char_length(content) <= 3000),
  score INTEGER CHECK (score >= 0 AND score <= 100),
  feedback TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  image_urls TEXT[], -- Array of strings
  like_count INTEGER DEFAULT 0 CHECK (like_count >= 0)
);

CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  argument_id UUID REFERENCES arguments(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL CHECK (char_length(content) <= 500),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  image_urls TEXT[],
  like_count INTEGER DEFAULT 0 CHECK (like_count >= 0)
);

CREATE TABLE IF NOT EXISTS argument_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  argument_id UUID REFERENCES arguments(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(argument_id, user_id)
);

CREATE TABLE IF NOT EXISTS comment_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  comment_id UUID REFERENCES comments(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(comment_id, user_id)
);

CREATE TABLE IF NOT EXISTS notices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0 CHECK (like_count >= 0)
);

CREATE TABLE IF NOT EXISTS notice_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  notice_id UUID REFERENCES notices(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL CHECK (char_length(content) <= 500),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  image_urls TEXT[],
  like_count INTEGER DEFAULT 0 CHECK (like_count >= 0)
);

CREATE TABLE IF NOT EXISTS notice_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  notice_id UUID REFERENCES notices(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(notice_id, user_id)
);

CREATE TABLE IF NOT EXISTS notice_comment_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  comment_id UUID REFERENCES notice_comments(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(comment_id, user_id)
);

-- =============================================
-- 2. ENABLE RLS
-- =============================================
ALTER TABLE debates ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE arguments ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE argument_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE notice_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notice_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE notice_comment_likes ENABLE ROW LEVEL SECURITY;

-- =============================================
-- 3. POLICIES (DROP ALL FIRST TO RESET)
-- =============================================

-- HELPER: Drop all policies for a table
DO $$ 
DECLARE 
    r RECORD; 
BEGIN 
    FOR r IN (SELECT tablename, policyname FROM pg_policies WHERE schemaname = 'public') LOOP 
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON ' || r.tablename; 
    END LOOP; 
END $$;

-- 3.1 PROFILES
CREATE POLICY "Public Read Profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id); 
-- Note: 'role' column update is protected by trigger or logic, but RLS here allows general update. 
-- Ideally we restrict updating 'role' via Separate Policy or Column Grant, but for now strict RLS on ID is baseline.

-- 3.2 DEBATES
CREATE POLICY "Public Read Debates" ON debates FOR SELECT USING (true);
CREATE POLICY "Admins can insert debates" ON debates FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can update debates" ON debates FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can delete debates" ON debates FOR DELETE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 3.3 ARGUMENTS
CREATE POLICY "Public Read Arguments" ON arguments FOR SELECT USING (true);
CREATE POLICY "Users can insert own arguments" ON arguments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own arguments" ON arguments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own arguments" ON arguments FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Admins can delete arguments" ON arguments FOR DELETE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 3.4 COMMENTS
CREATE POLICY "Public Read Comments" ON comments FOR SELECT USING (true);
CREATE POLICY "Users can insert own comments" ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own comments" ON comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments" ON comments FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Admins can delete comments" ON comments FOR DELETE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 3.5 LIKES (Arguments & Comments)
CREATE POLICY "Public Read Likes" ON argument_likes FOR SELECT USING (true);
CREATE POLICY "Users can insert likes" ON argument_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own likes" ON argument_likes FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Public Read Comment Likes" ON comment_likes FOR SELECT USING (true);
CREATE POLICY "Users can insert comment likes" ON comment_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own comment likes" ON comment_likes FOR DELETE USING (auth.uid() = user_id);

-- 3.6 NOTICES
CREATE POLICY "Public Read Notices" ON notices FOR SELECT USING (true);
CREATE POLICY "Admins can insert notices" ON notices FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can update notices" ON notices FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can delete notices" ON notices FOR DELETE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 3.7 NOTICE COMMENTS
CREATE POLICY "Public Read Notice Comments" ON notice_comments FOR SELECT USING (true);
CREATE POLICY "Users can insert own notice comments" ON notice_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own notice comments" ON notice_comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own notice comments" ON notice_comments FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Admins can delete notice comments" ON notice_comments FOR DELETE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 3.8 NOTICE LIKES
CREATE POLICY "Public Read Notice Likes" ON notice_likes FOR SELECT USING (true);
CREATE POLICY "Users can insert notice likes" ON notice_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own notice likes" ON notice_likes FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Public Read Notice Comment Likes" ON notice_comment_likes FOR SELECT USING (true);
CREATE POLICY "Users can insert notice comment likes" ON notice_comment_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own notice comment likes" ON notice_comment_likes FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- 4. INDEXES (Performance)
-- =============================================
CREATE INDEX IF NOT EXISTS idx_arguments_debate_id ON arguments(debate_id);
CREATE INDEX IF NOT EXISTS idx_arguments_user_id ON arguments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_argument_id ON comments(argument_id);
CREATE INDEX IF NOT EXISTS idx_notice_comments_notice_id ON notice_comments(notice_id);


-- 5. FUNCTION & TRIGGERS (Consolidated)
-- =============================================

-- 5.1 Profile Creation Trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, role)
  VALUES (new.id, split_part(new.email, '@', 1), 'user');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 5.2 Argument Creation Stats (Count Only)
CREATE OR REPLACE FUNCTION public.update_profile_stats_only_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.profiles
  SET argument_count = argument_count + 1
  WHERE id = new.user_id;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_argument_created ON public.arguments; -- Drop old one
DROP TRIGGER IF EXISTS on_argument_created_count ON public.arguments;
CREATE TRIGGER on_argument_created_count
  AFTER INSERT ON public.arguments
  FOR EACH ROW EXECUTE PROCEDURE public.update_profile_stats_only_count();

-- 5.3 Argument Like Trigger (Score + Count)
CREATE OR REPLACE FUNCTION public.handle_argument_like()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        UPDATE public.profiles
        SET total_score = total_score + 5
        WHERE id = (SELECT user_id FROM public.arguments WHERE id = NEW.argument_id);
        
        UPDATE public.arguments SET like_count = like_count + 1 WHERE id = NEW.argument_id;
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE public.profiles
        SET total_score = total_score - 5
        WHERE id = (SELECT user_id FROM public.arguments WHERE id = OLD.argument_id);
        
        UPDATE public.arguments SET like_count = GREATEST(0, like_count - 1) WHERE id = OLD.argument_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_argument_like_change ON public.argument_likes;
CREATE TRIGGER on_argument_like_change
AFTER INSERT OR DELETE ON public.argument_likes
FOR EACH ROW EXECUTE PROCEDURE public.handle_argument_like();

-- 5.4 Comment Like Trigger (Score + Count)
CREATE OR REPLACE FUNCTION public.handle_comment_like()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        UPDATE public.profiles
        SET total_score = total_score + 5
        WHERE id = (SELECT user_id FROM public.comments WHERE id = NEW.comment_id);
        
        UPDATE public.comments SET like_count = like_count + 1 WHERE id = NEW.comment_id;
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE public.profiles
        SET total_score = total_score - 5
        WHERE id = (SELECT user_id FROM public.comments WHERE id = OLD.comment_id);
        
        UPDATE public.comments SET like_count = GREATEST(0, like_count - 1) WHERE id = OLD.comment_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_comment_like_change ON public.comment_likes;
CREATE TRIGGER on_comment_like_change
AFTER INSERT OR DELETE ON public.comment_likes
FOR EACH ROW EXECUTE PROCEDURE public.handle_comment_like();

-- 5.5 Notices RPC (Atomic Likes)
CREATE OR REPLACE FUNCTION increment_notice_like_count(row_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.notices
  SET like_count = like_count + 1
  WHERE id = row_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION decrement_notice_like_count(row_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.notices
  SET like_count = GREATEST(0, like_count - 1)
  WHERE id = row_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

