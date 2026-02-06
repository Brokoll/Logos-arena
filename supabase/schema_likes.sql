-- 1. Create Tables
CREATE TABLE public.argument_likes (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    argument_id UUID REFERENCES public.arguments(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, argument_id)
);

CREATE TABLE public.comment_likes (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, comment_id)
);

-- 2. Add like_count columns to parents (for easy display)
ALTER TABLE public.arguments ADD COLUMN IF NOT EXISTS like_count INTEGER DEFAULT 0;
ALTER TABLE public.comments ADD COLUMN IF NOT EXISTS like_count INTEGER DEFAULT 0;

-- 3. RLS
ALTER TABLE public.argument_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comment_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Arg Likes" ON public.argument_likes FOR SELECT USING (true);
CREATE POLICY "Users toggle own Arg Like" ON public.argument_likes 
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Public Read Comment Likes" ON public.comment_likes FOR SELECT USING (true);
CREATE POLICY "Users toggle own Comment Like" ON public.comment_likes 
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 4. Triggers for Score (+5 per like)
-- Function to handle Argument Like
CREATE OR REPLACE FUNCTION public.handle_argument_like()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        -- Increase Author Score
        UPDATE public.profiles
        SET total_score = total_score + 5
        WHERE id = (SELECT user_id FROM public.arguments WHERE id = NEW.argument_id);
        
        -- Increase Like Count
        UPDATE public.arguments SET like_count = like_count + 1 WHERE id = NEW.argument_id;
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        -- Decrease Author Score
        UPDATE public.profiles
        SET total_score = total_score - 5
        WHERE id = (SELECT user_id FROM public.arguments WHERE id = OLD.argument_id);
        
        -- Decrease Like Count
        UPDATE public.arguments SET like_count = like_count - 1 WHERE id = OLD.argument_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to handle Comment Like
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
        
        UPDATE public.comments SET like_count = like_count - 1 WHERE id = OLD.comment_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Bind Triggers
CREATE TRIGGER on_argument_like_change
AFTER INSERT OR DELETE ON public.argument_likes
FOR EACH ROW EXECUTE PROCEDURE public.handle_argument_like();

CREATE TRIGGER on_comment_like_change
AFTER INSERT OR DELETE ON public.comment_likes
FOR EACH ROW EXECUTE PROCEDURE public.handle_comment_like();

-- 5. DISABLE OLD AI SCORE TRIGGER
-- We need to drop the old trigger that updated score on argument creation
DROP TRIGGER IF EXISTS on_argument_created ON public.arguments;
-- If we want to keep counting arguments but NOT score, we redefine the trigger
CREATE OR REPLACE FUNCTION public.update_profile_stats_only_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.profiles
  SET 
    argument_count = argument_count + 1
    -- No score update here anymore
  WHERE id = new.user_id;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_argument_created_count
  AFTER INSERT ON public.arguments
  FOR EACH ROW EXECUTE PROCEDURE public.update_profile_stats_only_count();
