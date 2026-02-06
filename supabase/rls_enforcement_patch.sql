-- =============================================
-- RLS ENFORCEMENT & ADMIN CLIENT ELIMINATION PATCH
-- =============================================

-- 1. ARGUMENTS TABLE RLS (Update & Delete)
DROP POLICY IF EXISTS "Users can update their own arguments" ON public.arguments;
CREATE POLICY "Users can update their own arguments" ON public.arguments
  FOR UPDATE USING (
    auth.uid() = user_id OR 
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Users can delete their own arguments" ON public.arguments;
CREATE POLICY "Users can delete their own arguments" ON public.arguments
  FOR DELETE USING (
    auth.uid() = user_id OR 
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 2. COMMENTS TABLE RLS (Update & Delete)
DROP POLICY IF EXISTS "Users can update their own comments" ON public.comments;
CREATE POLICY "Users can update their own comments" ON public.comments
  FOR UPDATE USING (
    auth.uid() = user_id OR 
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Users can delete their own comments" ON public.comments;
CREATE POLICY "Users can delete their own comments" ON public.comments
  FOR DELETE USING (
    auth.uid() = user_id OR 
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 3. NOTICE_COMMENTS TABLE RLS (Update & Delete)
-- (Note: Delete policy already exists in schema_notice_comments.sql, but we standardize it here)
DROP POLICY IF EXISTS "Users can update their own notice comments" ON public.notice_comments;
CREATE POLICY "Users can update their own notice comments" ON public.notice_comments
  FOR UPDATE USING (
    auth.uid() = user_id OR 
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Users can delete their own notice comments/Admins can delete all" ON public.notice_comments;
CREATE POLICY "Users can delete their own notice comments/Admins can delete all" ON public.notice_comments
  FOR DELETE USING (
    auth.uid() = user_id OR 
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 4. NOTICE_LIKES & COMMENT_LIKES (Standardize RLS for Safety)
-- No changes needed as they are already scoped to auth.uid()
