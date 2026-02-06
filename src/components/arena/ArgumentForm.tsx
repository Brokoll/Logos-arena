"use client";

import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ImageUploader } from "@/components/ui/ImageUploader";
import { LoginModal } from "@/components/ui/LoginModal";

interface ArgumentFormProps {
    debateId: string;
    currentUser: User | null;
    onSubmit: (data: {
        debate_id: string;
        side: "pro" | "con";
        content: string;
        image_urls?: string[];
    }) => Promise<{ success: boolean; error?: string; score?: number; feedback?: string }>;
}

export function ArgumentForm({ debateId, currentUser, onSubmit }: ArgumentFormProps) {
    const router = useRouter();
    const [side, setSide] = useState<"pro" | "con" | null>(null);
    const [content, setContent] = useState("");
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<{ score: number; feedback?: string } | null>(null);
    const [showLoginModal, setShowLoginModal] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!currentUser) {
            setShowLoginModal(true);
            return;
        }

        if (!side) {
            setError("찬성 또는 반대를 선택해주세요.");
            return;
        }

        setIsSubmitting(true);
        setError(null);
        setResult(null);

        try {
            const response = await onSubmit({
                debate_id: debateId,
                side,
                content,
                image_urls: imageUrls,
            });

            if (response.success) {
                setResult({ score: 0, feedback: response.feedback }); // Score ignored
                setContent("");
                setImageUrls([]);
                setSide(null);
            } else {
                setError(response.error || "제출에 실패했습니다.");
            }
        } catch {
            setError("오류가 발생했습니다. 다시 시도해주세요.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full mx-auto">
            <form onSubmit={handleSubmit} className="space-y-12 p-8 md:p-12 border-[3px] border-foreground bg-background bw-glow">
                <div className="space-y-2 text-center">
                    <h2 className="text-3xl font-[900] tracking-tighter uppercase italic">⚔️ 논리가 당신의 무기가 됩니다</h2>
                    <p className="text-sm opacity-40 font-bold uppercase tracking-widest">Enter the Arena with your logic</p>
                </div>

                {/* Side Selection */}
                <div className="grid grid-cols-2 gap-4">
                    <button
                        type="button"
                        onClick={() => setSide("pro")}
                        className={cn(
                            "py-6 border-[3px] font-black uppercase tracking-tighter transition-all duration-300 transform active:scale-95",
                            side === "pro"
                                ? "bg-foreground text-background border-foreground text-2xl"
                                : "border-foreground/10 hover:border-foreground opacity-30 hover:opacity-100"
                        )}
                    >
                        찬성 (PRO)
                    </button>
                    <button
                        type="button"
                        onClick={() => setSide("con")}
                        className={cn(
                            "py-6 border-[3px] font-black uppercase tracking-tighter transition-all duration-300 transform active:scale-95",
                            side === "con"
                                ? "bg-foreground text-background border-foreground text-2xl"
                                : "border-foreground/10 hover:border-foreground opacity-30 hover:opacity-100"
                        )}
                    >
                        반대 (CON)
                    </button>
                </div>

                {/* Unified Content Input */}
                <div className="space-y-4">
                    <div className="flex justify-between items-end">
                        <label className="text-xl font-black uppercase tracking-tighter italic underline decoration-[3px]">
                            ✍️ Argument & Evidence
                        </label>
                        <div className="flex items-center gap-4">
                            <ImageUploader onImagesSelected={setImageUrls} images={imageUrls} />
                            <span className={cn(
                                "text-xs font-black tracking-widest uppercase px-2 py-1 border-2 border-foreground",
                                content.length < 50 ? "opacity-20" : "bg-foreground text-background"
                            )}>
                                {content.length} / 2000
                            </span>
                        </div>
                    </div>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="당신의 입장과 그 이유를 자유롭게 서술해주세요. 논리적 완성도가 높을수록 AI 심판의 점수가 올라갑니다. (이미지를 붙여넣기 하여 첨부할 수도 있습니다)"
                        className="w-full p-6 border-[3px] border-foreground bg-transparent resize-none h-64 focus:outline-none focus:ring-4 focus:ring-foreground/5 text-lg font-medium leading-relaxed transition-all placeholder:opacity-20"
                        required
                        minLength={50}
                        maxLength={2000}
                    />
                </div>

                {/* Error Message */}
                {error && (
                    <div className="p-4 bg-foreground text-background font-black uppercase tracking-tighter text-sm text-center animate-bounce">
                        ⚠️ ERROR: {error}
                    </div>
                )}

                {/* Result */}
                {result && (
                    <div className="p-8 border-[3px] border-foreground bg-foreground text-background text-center space-y-4 animate-in zoom-in duration-500">
                        <p className="text-xs font-black uppercase tracking-[0.4em]">Battle Analysis</p>
                        {result.feedback && (
                            <p className="text-lg font-medium italic opacity-80 max-w-lg mx-auto leading-tight">
                                " {result.feedback} "
                            </p>
                        )}
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isSubmitting || !side || content.length < 50}
                    className={cn(
                        "w-full py-8 font-[900] text-3xl uppercase tracking-tighter border-[3px] border-foreground transition-all duration-300 relative overflow-hidden group",
                        isSubmitting || !side || content.length < 50
                            ? "opacity-10 cursor-not-allowed"
                            : "hover:bg-foreground hover:text-background"
                    )}
                >
                    <span className="relative z-10">
                        {isSubmitting ? "⏳ Analyzing Logic..." : "Submit Argument"}
                    </span>
                    {!isSubmitting && side && content.length >= 50 && (
                        <div className="absolute inset-0 bg-foreground translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    )}
                </button>

                {/* Toxicity Warning */}
                <p className="text-center text-xs font-medium opacity-40 leading-relaxed">
                    "논리는 칼보다 강합니다. 단, 혐오와 비방은 기사의 무기가 아닙니다."<br />
                    부적절한 표현은 제재의 대상이 될 수 있습니다.
                </p>

                <LoginModal
                    isOpen={showLoginModal}
                    onClose={() => setShowLoginModal(false)}
                    onConfirm={() => router.push("/login")}
                />
            </form>
        </div>
    );
}
