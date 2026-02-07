-- =============================================
-- 랭킹 점수 초기화 (Reset Ranking Scores)
-- =============================================

-- 모든 사용자의 total_score를 0으로 초기화
UPDATE public.profiles
SET total_score = 0;

-- (선택사항) 논증 점수가 있다면 초기화할 수 있겠지만, 
-- 현재 구조에서는 profiles.total_score가 핵심 랭킹 기준입니다.
