-- 1. Enable RLS on all key tables
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notice_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.arguments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies to avoid conflicts (clean slate)
DROP POLICY IF EXISTS "Comments are viewable by everyone" ON public.comments;
DROP POLICY IF EXISTS "Users can insert their own comments" ON public.comments;
DROP POLICY IF EXISTS "Users can update their own comments" ON public.comments;
DROP POLICY IF EXISTS "Users can delete their own comments" ON public.comments;

DROP POLICY IF EXISTS "Notice comments are viewable by everyone" ON public.notice_comments;
DROP POLICY IF EXISTS "Users can insert their own notice comments" ON public.notice_comments;
DROP POLICY IF EXISTS "Users can update their own notice comments" ON public.notice_comments;
DROP POLICY IF EXISTS "Users can delete their own notice comments" ON public.notice_comments;

DROP POLICY IF EXISTS "Arguments are viewable by everyone" ON public.arguments;
DROP POLICY IF EXISTS "Users can insert their own arguments" ON public.arguments;

-- 3. Create RLS Policies

-- COMMENTS Table
CREATE POLICY "Comments are viewable by everyone" 
ON public.comments FOR SELECT 
USING (true);

CREATE POLICY "Users can insert their own comments" 
ON public.comments FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" 
ON public.comments FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" 
ON public.comments FOR DELETE 
USING (auth.uid() = user_id);

-- NOTICE_COMMENTS Table
CREATE POLICY "Notice comments are viewable by everyone" 
ON public.notice_comments FOR SELECT 
USING (true);

CREATE POLICY "Users can insert their own notice comments" 
ON public.notice_comments FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notice comments" 
ON public.notice_comments FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notice comments" 
ON public.notice_comments FOR DELETE 
USING (auth.uid() = user_id);

-- ARGUMENTS Table
CREATE POLICY "Arguments are viewable by everyone" 
ON public.arguments FOR SELECT 
USING (true);

CREATE POLICY "Users can insert their own arguments" 
ON public.arguments FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- NOTICES Table
-- Notices: Public Read, Only Admin Write (assuming admin has a way, or we restrict it)
CREATE POLICY "Notices are viewable by everyone" 
ON public.notices FOR SELECT 
USING (true);

-- 4. Create RPC functions for Atomic Updates (Likes)

-- Function to increment notice like count safely
CREATE OR REPLACE FUNCTION increment_notice_like_count(row_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.notices
  SET like_count = like_count + 1
  WHERE id = row_id;
END;
$$ LANGUAGE plpgsql;

-- Function to decrement notice like count safely
CREATE OR REPLACE FUNCTION decrement_notice_like_count(row_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.notices
  SET like_count = like_count - 1
  WHERE id = row_id;
END;
$$ LANGUAGE plpgsql;

-- Function to increment argument like count safely (if needed)
CREATE OR REPLACE FUNCTION increment_argument_like_count(row_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.arguments
  SET like_count = like_count + 1
  WHERE id = row_id;
END;
$$ LANGUAGE plpgsql;

-- Function to decrement argument like count safely
CREATE OR REPLACE FUNCTION decrement_argument_like_count(row_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.arguments
  SET like_count = like_count - 1
  WHERE id = row_id;
END;
$$ LANGUAGE plpgsql;

-- Function to increment comment like count safely
CREATE OR REPLACE FUNCTION increment_comment_like_count(row_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.comments
  SET like_count = like_count + 1
  WHERE id = row_id;
END;
$$ LANGUAGE plpgsql;

-- Function to decrement comment like count safely
CREATE OR REPLACE FUNCTION decrement_comment_like_count(row_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.comments
  SET like_count = like_count - 1
  WHERE id = row_id;
END;
$$ LANGUAGE plpgsql;
