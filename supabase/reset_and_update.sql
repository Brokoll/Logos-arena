-- 1. DATA WIPE (모든 데이터 초기화)
TRUNCATE TABLE public.comments CASCADE;
TRUNCATE TABLE public.arguments CASCADE;
TRUNCATE TABLE public.debates CASCADE;
TRUNCATE TABLE public.profiles CASCADE;
-- auth.users는 Supabase 대시보드에서 직접 지우는 것이 안전하지만, 
-- 개발 환경에서는 ON DELETE CASCADE로 연결된 데이터가 지워집니다.
-- 여기서는 public 테이블 데이터만 확실히 밉니다.

-- 2. SCHEMA UPDATE (프로필 테이블 확장)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS gender text CHECK (gender IN ('male', 'female', 'other')),
ADD COLUMN IF NOT EXISTS age int;

-- 3. RE-SEED (토론 주제 다시 넣기)
INSERT INTO public.debates (id, topic, description, status)
VALUES 
  (uuid_generate_v4(), '탕수육 부먹 vs 찍먹', '소스, 부어야 하나 찍어야 하나? 인류 최대의 난제.', 'active'),
  (uuid_generate_v4(), '민트초코: 호 vs 불호', '치약맛인가 천상의 맛인가?', 'active'),
  (uuid_generate_v4(), '주 4일제 도입 찬반', '생산성 향상인가 시기상조인가?', 'active'),
  (uuid_generate_v4(), 'AI가 창작 영역을 대체할 것인가?', '예술은 인간의 고유 영역인가?', 'active'),
  (uuid_generate_v4(), 'AI 개발을 규제해야 하는가?', '인공지능 기술의 급속한 발전에 따라, 정부 차원의 규제가 필요한지에 대한 토론입니다.', 'active');
