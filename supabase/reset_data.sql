-- 1. 모든 댓글 삭제
DELETE FROM public.comments;

-- 2. 모든 좋아요 삭제 (글 좋아요, 댓글 좋아요)
DELETE FROM public.argument_likes;
DELETE FROM public.comment_likes;

-- 3. 모든 주장(글) 삭제 (공지사항은 notices 테이블이므로 영향 받지 않음)
DELETE FROM public.arguments;

-- 4. (선택사항) 프로필의 활동 점수 초기화
UPDATE public.profiles
SET total_score = 0; -- 점수만 0으로 초기화하고 계정은 유지

-- 확인: 공지사항(notices)은 건드리지 않았습니다.
-- 확인: 사용자(profiles/auth)는 건드리지 않았습니다.
