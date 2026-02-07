-- =============================================
-- debates 테이블에 관리자 권한(UPDATE, DELETE) 추가
-- =============================================

-- 1. debates 테이블의 UPDATE 권한 허용 (관리자만)
CREATE POLICY "Admins can update debates" ON public.debates
FOR UPDATE
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
)
WITH CHECK (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

-- 2. debates 테이블의 DELETE 권한 허용 (관리자만)
CREATE POLICY "Admins can delete debates" ON public.debates
FOR DELETE
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);
