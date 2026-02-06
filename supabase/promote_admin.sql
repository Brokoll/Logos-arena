-- ⚠️ CHANGE TITLE TO "Logicer" & GRANT ADMIN ⚠️

-- 1. Replace 'YOUR_EMAIL@EXAMPLE.COM' with the email you signed up with.
--    (Example: 'logicer@logos.arena')
UPDATE public.profiles
SET 
  role = 'admin', 
  username = 'Logicer' -- Optional: Force set username to Logicer
WHERE id = (
  SELECT id 
  FROM auth.users 
  WHERE email = 'logicer@logos.arena' -- 👈 CHANGE THIS EMAIL IF NEEDED
);

-- Check if it worked
SELECT * FROM public.profiles WHERE role = 'admin';
