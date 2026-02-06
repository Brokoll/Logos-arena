-- Add INSERT policy for debates table
-- This allows server actions (using service role) to insert new debates

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Service Role Insert Debates" ON debates;

-- Create INSERT policy for service role (used by server actions)
CREATE POLICY "Service Role Insert Debates" 
ON debates 
FOR INSERT 
TO authenticated
USING (true);

-- Verify policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'debates';
