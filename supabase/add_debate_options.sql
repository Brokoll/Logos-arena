-- Add option_a and option_b columns to debates table
-- This allows admins to define custom debate choices instead of fixed PRO/CON

ALTER TABLE debates 
ADD COLUMN IF NOT EXISTS option_a TEXT NOT NULL DEFAULT '찬성',
ADD COLUMN IF NOT EXISTS option_b TEXT NOT NULL DEFAULT '반대';

-- Verify the changes
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'debates' 
ORDER BY ordinal_position;
