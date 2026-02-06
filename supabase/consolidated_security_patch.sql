-- =============================================
-- LOGOS ARENA CONSOLIDATED SECURITY PATCH
-- =============================================

-- 1. PROFILE PROTECTION (Prevent Role Escalation)
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Secure Profile Update" ON profiles;
CREATE POLICY "Secure Profile Update" ON profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id AND 
    (
      -- Prevent non-admins from changing their role to admin
      CASE 
        WHEN (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin' THEN true -- Existing admins can manage roles
        WHEN role = 'admin' THEN false -- Forbidden for others to become admin
        ELSE true
      END
    )
  );

-- 2. DATA INTEGRITY (Negative Counts & Length Limits)
ALTER TABLE arguments DROP CONSTRAINT IF EXISTS arguments_like_count_check;
ALTER TABLE arguments ADD CONSTRAINT arguments_like_count_check CHECK (like_count >= 0);
ALTER TABLE arguments DROP CONSTRAINT IF EXISTS arguments_content_length_check;
ALTER TABLE arguments ADD CONSTRAINT arguments_content_length_check CHECK (char_length(content) <= 3000);

ALTER TABLE comments DROP CONSTRAINT IF EXISTS comments_like_count_check;
ALTER TABLE comments ADD CONSTRAINT comments_like_count_check CHECK (like_count >= 0);
ALTER TABLE notices DROP CONSTRAINT IF EXISTS notices_like_count_check;
ALTER TABLE notices ADD CONSTRAINT notices_like_count_check CHECK (like_count >= 0);

-- 3. PERFORMANCE INDEXES (Anti-DoS)
CREATE INDEX IF NOT EXISTS idx_arguments_debate_id ON arguments(debate_id);
CREATE INDEX IF NOT EXISTS idx_arguments_user_id ON arguments(user_id);
CREATE INDEX IF NOT EXISTS idx_arguments_created_at ON arguments(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_comments_argument_id ON comments(argument_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);

CREATE INDEX IF NOT EXISTS idx_notice_comments_notice_id ON notice_comments(notice_id);

-- 4. ATOMIC RPC FUNCTIONS (Atomic Updates)
CREATE OR REPLACE FUNCTION increment_notice_like_count(row_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE notices SET like_count = like_count + 1 WHERE id = row_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION decrement_notice_like_count(row_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE notices SET like_count = GREATEST(0, like_count - 1) WHERE id = row_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. ADMIN RLS FIX (Allow Admins to Post Notices)
DROP POLICY IF EXISTS "Admins can insert notices" ON notices;
CREATE POLICY "Admins can insert notices" ON notices
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 6. UNIQUE USERNAME CONSTRAINT
-- (Caution: This might fail if duplicates already exist. Manual cleanup needed if it fails)
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_username_unique;
ALTER TABLE profiles ADD CONSTRAINT profiles_username_unique UNIQUE (username);
