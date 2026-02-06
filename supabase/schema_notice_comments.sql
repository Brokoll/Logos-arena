-- Create notice_comments table
CREATE TABLE IF NOT EXISTS public.notice_comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  notice_id UUID REFERENCES public.notices(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (char_length(content) <= 500),
  like_count INTEGER DEFAULT 0,
  image_urls TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notice_comments ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can view notice comments" ON public.notice_comments
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create notice comments" ON public.notice_comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notice comments/Admins can delete all" ON public.notice_comments
  FOR DELETE USING (
    auth.uid() = user_id OR 
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Create notice_comment_likes table
CREATE TABLE IF NOT EXISTS public.notice_comment_likes (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES public.notice_comments(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, comment_id)
);

ALTER TABLE public.notice_comment_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can like notice comments" ON public.notice_comment_likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY "Users can unlike notice comments" ON public.notice_comment_likes
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view notice comment likes" ON public.notice_comment_likes
  FOR SELECT USING (true);

-- Add like_count to notices
ALTER TABLE public.notices ADD COLUMN IF NOT EXISTS like_count INTEGER DEFAULT 0;

-- Create notice_likes table
CREATE TABLE IF NOT EXISTS public.notice_likes (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  notice_id UUID REFERENCES public.notices(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, notice_id)
);

ALTER TABLE public.notice_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can like notices" ON public.notice_likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike notices" ON public.notice_likes
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view notice likes" ON public.notice_likes
  FOR SELECT USING (true);
