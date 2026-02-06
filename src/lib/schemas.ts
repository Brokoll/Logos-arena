import { z } from "zod";

export const argumentSchema = z.object({
    debate_id: z.string().uuid({ message: "유효한 토론 ID가 필요합니다." }),
    side: z.string().min(1, { message: "입장을 선택해야 합니다." }),
    content: z.string()
        .min(50, { message: "주장과 근거를 포함하여 최소 50자 이상 작성해주세요." })
        .max(2000, { message: "최대 2000자까지 작성 가능합니다." }),
});

export type ArgumentInput = z.infer<typeof argumentSchema>;

// Server-side only validation (includes user_id)
export const serverArgumentSchema = argumentSchema.extend({
    user_id: z.string().uuid(),
});
