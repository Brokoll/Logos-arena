-- 중복된 '토론 주제 추천' 공지사항 삭제
-- 제목이 같은 글 중, 가장 먼저 작성된 1개만 남기고 나머지를 삭제합니다.

DELETE FROM public.notices
WHERE id IN (
    SELECT id
    FROM (
        SELECT id, ROW_NUMBER() OVER (PARTITION BY title ORDER BY created_at ASC) as r_num
        FROM public.notices
        WHERE title LIKE '%토론 주제를 추천해주세요%' 
           OR title LIKE '%건의 사항%'
    ) t
    WHERE t.r_num > 1
);
