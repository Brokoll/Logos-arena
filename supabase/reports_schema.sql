-- =============================================
-- REPORTS SCHEMA
-- =============================================

CREATE TABLE IF NOT EXISTS reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_id UUID REFERENCES profiles(id) ON DELETE SET NULL, -- Keep report even if user deleted
  target_type TEXT NOT NULL CHECK (target_type IN ('argument', 'comment', 'notice_comment')),
  target_id UUID NOT NULL,
  reason TEXT NOT NULL CHECK (char_length(reason) <= 1000),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'dismissed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  admin_notes TEXT
);

-- RLS
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- 1. Anyone authenticated can insert a report
CREATE POLICY "Users can insert reports" ON reports FOR INSERT WITH CHECK (auth.uid() = reporter_id);

-- 2. Only Admins can view/update/delete reports
CREATE POLICY "Admins can do everything on reports" ON reports FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 3. Reporters can see their own reports (Optional, but good for UX)
CREATE POLICY "Reporters can view own reports" ON reports FOR SELECT USING (auth.uid() = reporter_id);

-- Add to publication for realtime if needed (not needed yet)
