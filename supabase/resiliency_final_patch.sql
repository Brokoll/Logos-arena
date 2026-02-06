-- =============================================
-- LOGOS ARENA RESILIENCY & FINAL POLISH PATCH
-- =============================================

-- 1. ROBUST NEW USER TRIGGER (Handles Username Collisions)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  base_username TEXT;
  final_username TEXT;
  counter INTEGER := 0;
BEGIN
  -- Get email prefix
  base_username := split_part(new.email, '@', 1);
  final_username := base_username;

  -- Attempt to insert, but loop if username exists
  WHILE EXISTS (SELECT 1 FROM public.profiles WHERE username = final_username) LOOP
    counter := counter + 1;
    final_username := base_username || '_' || counter || (floor(random() * 90) + 10)::text;
    
    -- Safety break
    IF counter > 10 THEN
       final_username := base_username || '_' || md5(random()::text || clock_timestamp()::text)::text;
       EXIT;
    END IF;
  END LOOP;

  INSERT INTO public.profiles (id, username, role)
  VALUES (new.id, final_username, 'user');
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. SECURE DELETION (Ensure negative counts are NEVER possible via triggers)
-- Note: Consolidated patch already added negative check constraints,
-- BUT we can also improve the RPCs to be paranoid.

CREATE OR REPLACE FUNCTION decrement_notice_like_count(row_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE notices SET like_count = GREATEST(0, like_count - 1) WHERE id = row_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- (Repeat for others if needed, but the constraint on the table is the ultimate wall)
