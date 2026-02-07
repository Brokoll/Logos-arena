-- Add image_url column to debates table
-- Run this in Supabase SQL Editor

ALTER TABLE debates 
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Verify the column was added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'debates' 
AND column_name = 'image_url';
