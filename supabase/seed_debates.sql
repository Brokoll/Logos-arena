-- 기존 데이터는 유지하되, 새로운 토론 주제 4개를 추가합니다.
-- (기존에 1개가 있다고 가정)

INSERT INTO public.debates (id, topic, description, status)
VALUES 
  (uuid_generate_v4(), '탕수육 부먹 vs 찍먹', '소스, 부어야 하나 찍어야 하나? 인류 최대의 난제.', 'active'),
  (uuid_generate_v4(), '민트초코: 호 vs 불호', '치약맛인가 천상의 맛인가?', 'active'),
  (uuid_generate_v4(), '주 4일제 도입 찬반', '생산성 향상인가 시기상조인가?', 'active'),
  (uuid_generate_v4(), 'AI가 창작 영역을 대체할 것인가?', '예술은 인간의 고유 영역인가?', 'active');

-- 확인
SELECT * FROM public.debates;
