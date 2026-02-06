# 프로젝트 원칙: Logos Arena (SsulWar)

## 1. 아키텍처 원칙 (Separation of Concerns)
- **Logic & UI Isolation**: 모든 논리적 오류 탐지 및 점수 산정 로직은 `@/lib/debate-logic.ts`에서 처리하며, UI 컴포넌트(`@/components/arena/`)는 데이터의 시각적 표현에만 집중한다.
- **Server-Side Truth**: 투표, 점수 합산, 아레나 상태 관리 등 모든 핵심 데이터 변경은 Server Actions 또는 API Route를 통해 서버에서만 검증 후 처리한다.

## 2. 보안 및 건전성 (Immune System)
- **Anti-Toxicity (Pre-save)**: Zod를 활용한 데이터 스키마 검증과 OpenAI Moderation API(또는 커스텀 필터링)를 결합하여, 혐오 표현이나 욕설이 포함된 경우 DB 저장 단계 전에 거부한다.
- **Rate Limiting**: '쿨다운 시스템'을 적용하여 API 레벨에서 단시간 내 반복적인 게시물 작성을 차단한다.

## 3. 코드 품질 (Clean Code)
- **Strict Typing**: TypeScript의 interface/type을 명확히 정의하여 아레나, 주장(Argument), 사용자 데이터 간의 관계를 관리한다.
- **Minimalist Styling**: 사용자의 요청에 따라 'Black & White' 테마를 기본으로 하며, UI의 화려함보다 정보의 가독성에 우선순위를 둔다.
