-- =============================================
-- debates 테이블에 option_a, option_b 컬럼 추가
-- Supabase SQL Editor에서 실행하세요
-- =============================================

-- 1. option_a 컬럼 추가 (기본값: 찬성)
ALTER TABLE debates 
ADD COLUMN IF NOT EXISTS option_a TEXT NOT NULL DEFAULT '찬성';

-- 2. option_b 컬럼 추가 (기본값: 반대)
ALTER TABLE debates 
ADD COLUMN IF NOT EXISTS option_b TEXT NOT NULL DEFAULT '반대';

-- 3. 결과 확인
SELECT id, topic, option_a, option_b, status, created_at FROM debates;
