-- youmga778 계정을 관리자로 격상하는 SQL
-- Supabase SQL Editor에서 실행하세요.

UPDATE public.profiles
SET role = 'admin'
WHERE username = 'youmga778';

-- 결과 확인
SELECT id, username, role FROM public.profiles WHERE username = 'youmga778';
