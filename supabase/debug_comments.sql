-- Run this in Supabase SQL Editor to check if comments table has proper structure
-- and if there are any RLS policies blocking inserts.

-- 1. Check if image_urls column exists
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'comments';

-- 2. Check RLS policies on comments table
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'comments';

-- 3. Count existing comments
SELECT COUNT(*) as total_comments FROM public.comments;

-- 4. List all comments (to see if any exist)
SELECT id, argument_id, user_id, content, created_at FROM public.comments 
ORDER BY created_at DESC LIMIT 10;

-- 5. Try inserting a test comment directly (replace UUIDs with real ones from your data)
-- You'll need to get a valid argument_id from the arguments table first
-- INSERT INTO public.comments (argument_id, user_id, content) 
-- VALUES ('YOUR_ARGUMENT_ID', 'YOUR_USER_ID', 'Direct SQL test');
