-- Create notices table
CREATE TABLE IF NOT EXISTS public.notices (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can view notices" ON public.notices
  FOR SELECT USING (true);

-- Seed Data
INSERT INTO public.notices (title, content, created_at)
VALUES
  ('🚀 LOGOS ARENA 그랜드 오픈!', '논리의 전장, LOGOS ARENA가 정식 오픈했습니다. 여러분의 날카로운 논리로 세상을 설득해보세요!', now()),
  ('📜 토론 규칙 안내', '1. 상호 존중은 필수입니다. \n2. 논리적인 근거를 제시해주세요. \n3. 비방 및 욕설은 제재 대상입니다.', now() - interval '1 day'),
  ('🔥 실시간 랭킹 시스템 업데이트', '활동량과 논리 점수를 기반으로 한 랭킹 시스템이 도입되었습니다. 명예의 전당에 도전하세요!', now() - interval '2 days');
