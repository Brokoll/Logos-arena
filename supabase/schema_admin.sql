-- 1. Create Role Enum
CREATE TYPE public.user_role AS ENUM ('user', 'admin');

-- 2. Add Role to Profiles
ALTER TABLE public.profiles 
ADD COLUMN role public.user_role DEFAULT 'user' NOT NULL;

-- 3. Update Policies for Notices (Admin only write)
-- First, drop existing if generic
DROP POLICY IF EXISTS "Anyone can view notices" ON public.notices;

CREATE POLICY "Anyone can view notices" ON public.notices
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert notices" ON public.notices
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update notices" ON public.notices
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete notices" ON public.notices
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- 4. Update Policies for Arguments (Admin delete)
CREATE POLICY "Admins can delete arguments" ON public.arguments
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- 5. Update Policies for Comments (Admin delete)
CREATE POLICY "Admins can delete comments" ON public.comments
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- 6. (Optional) Promote Logicer if exists, or you can run this manually later
-- UPDATE public.profiles
-- SET role = 'admin', username = 'Logicer'
-- WHERE id = (SELECT id FROM auth.users WHERE email = 'logicer@arena.com');
