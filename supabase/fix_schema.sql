-- 1. Ensure the Type Exists FIRST
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE public.user_role AS ENUM ('user', 'admin');
    END IF;
END
$$;

-- 2. NOW Add columns safely
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS age INTEGER,
ADD COLUMN IF NOT EXISTS gender TEXT,
ADD COLUMN IF NOT EXISTS role public.user_role DEFAULT 'user';

-- 3. Reload Schema Cache
NOTIFY pgrst, 'reload schema';
