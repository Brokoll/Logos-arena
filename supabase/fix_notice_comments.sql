-- notice_comments 테이블의 user_id 외래키 수정
-- 기존 constraint 삭제 (이름을 몰라서 찾아서 지워도 되지만, 보통 'notice_comments_user_id_fkey'임)
ALTER TABLE public.notice_comments
DROP CONSTRAINT IF EXISTS notice_comments_user_id_fkey;

-- public.profiles(id)를 참조하도록 새로 추가
ALTER TABLE public.notice_comments
ADD CONSTRAINT notice_comments_user_id_fkey
FOREIGN KEY (user_id) REFERENCES public.profiles(id)
ON DELETE CASCADE;

-- 확인용: 댓글 조회 시 프로필 정보가 나오는지 테스트
-- SELECT * FROM notice_comments nc LEFT JOIN profiles p ON nc.user_id = p.id LIMIT 5;
