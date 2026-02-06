// Interface for debate logic functions
export interface DebateAnalysisResult {
    score: number;
    feedback: string;
    isToxic: boolean;
}

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

/**
 * Analyze argument using Google Gemini (Free Tier available) for logic scoring and toxicity check.
 */
export async function analyzeArgument(content: string): Promise<DebateAnalysisResult> {
    // If no API key, return dummy response
    if (!GEMINI_API_KEY) {
        console.warn("GEMINI_API_KEY not set. Using dummy analysis.");
        return {
            score: Math.floor(Math.random() * 40) + 50, // Random 50-90
            feedback: "AI 심판 시스템(Gemini)이 연결되지 않았습니다. (Mock Mode)",
            isToxic: false,
        };
    }

    try {
        const prompt = `당신은 논리적 토론의 심판입니다. 사용자가 작성한 주장과 근거를 분석하고 1-100점 사이의 점수를 매겨주세요.

평가 기준:
- 주장의 명확성: 무엇을 말하고 싶은지 분명한가? (25점)
- 근거의 타당성: 주장을 뒷받침하는 이유가 논리적인가? (40점)
- 논리적 일관성: 주장과 근거가 서로 연결되어 있는가? (20점)
- 논리적 오류 없음: 인신공격, 순환논리, 허수아비 논법 등이 없는가? (15점)

분석 대상:
"${content}"

다음 JSON 형식으로만 응답해주세요 (MarkDown 코드블럭 없이 raw JSON만):
{"score": 숫자, "feedback": "간단한 피드백 (한국어, 2문장 이내)"}`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }],
                generationConfig: {
                    responseMimeType: "application/json",
                },
                safetySettings: [
                    {
                        category: "HARM_CATEGORY_HARASSMENT",
                        threshold: "BLOCK_LOW_AND_ABOVE"
                    },
                    {
                        category: "HARM_CATEGORY_HATE_SPEECH",
                        threshold: "BLOCK_LOW_AND_ABOVE"
                    },
                    {
                        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                        threshold: "BLOCK_LOW_AND_ABOVE"
                    },
                    {
                        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                        threshold: "BLOCK_LOW_AND_ABOVE"
                    }
                ]
            }),
        });

        const data = await response.json();

        // 1. Check Safety (Toxicity)
        // Gemini returns candidates[0].finishReason === "SAFETY" or empty content if blocked
        const candidate = data.candidates?.[0];
        if (!candidate || candidate.finishReason === "SAFETY") {
            return {
                score: 0,
                feedback: "부적절하거나 유해한 내용이 감지되어 분석이 거부되었습니다.",
                isToxic: true,
            };
        }

        const responseText = candidate.content?.parts?.[0]?.text;
        if (!responseText) {
            throw new Error("No response text from Gemini");
        }

        // 2. Parse Logic Score
        const parsed = JSON.parse(responseText);
        const score = Math.min(100, Math.max(0, Number(parsed.score) || 50));
        const feedback = parsed.feedback || "분석 완료";

        return {
            score,
            feedback,
            isToxic: false,
        };

    } catch (error) {
        console.error("Gemini analysis error:", error);
        return {
            score: 50,
            feedback: "AI 분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
            isToxic: false,
        };
    }
}
