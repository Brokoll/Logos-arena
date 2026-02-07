-- =============================================
-- 사용하지 않는 컬럼 정리
-- Supabase SQL Editor에서 실행하세요
-- =============================================

-- 1. profiles 테이블에서 불필요한 컬럼 삭제
ALTER TABLE profiles DROP COLUMN IF EXISTS rank;
ALTER TABLE profiles DROP COLUMN IF EXISTS gender;
ALTER TABLE profiles DROP COLUMN IF EXISTS age;

-- 2. arguments 테이블에서 AI 채점 관련 컬럼 삭제
ALTER TABLE arguments DROP COLUMN IF EXISTS score;
ALTER TABLE arguments DROP COLUMN IF EXISTS feedback;

-- 3. score 관련 트리거 제거 (더 이상 필요 없음)
DROP TRIGGER IF EXISTS on_argument_created ON public.arguments;
DROP FUNCTION IF EXISTS public.update_profile_stats();

-- =============================================
-- 삭제 완료! 다음 컬럼들이 제거됨:
-- - profiles.rank
-- - profiles.gender  
-- - profiles.age
-- - arguments.score
-- - arguments.feedback
-- =============================================
