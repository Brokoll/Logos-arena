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
    optionA: string;
    optionB: string;
    onSubmit: (data: {
        debate_id: string;
        side: string;
        content: string;
        image_urls?: string[];
    }) => Promise<{ success: boolean; error?: string; score?: number; feedback?: string }>;
}

export function ArgumentForm({ debateId, currentUser, optionA, optionB, onSubmit }: ArgumentFormProps) {
    const router = useRouter();
    const [side, setSide] = useState<string | null>(null);
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
            setError("입장을 선택해주세요.");
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
                image_urls: imageUrls.length > 0 ? imageUrls : undefined,
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
            setError("제출 중 오류가 발생했습니다.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-[900] tracking-tighter uppercase">
                        ⚔️ Share Your Thoughts in the Arena
                    </h2>
                    <p className="text-sm opacity-40 font-bold uppercase tracking-widest">Share your thoughts in the Arena</p>
                </div>

                {/* Side Selection with Custom Options */}
                <div className="grid grid-cols-2 gap-4">
                    <button
                        type="button"
                        onClick={() => setSide(optionA)}
                        className={cn(
                            "py-6 border-[3px] font-black uppercase tracking-tighter transition-all duration-300 transform active:scale-95",
                            side === optionA
                                ? "bg-foreground text-background border-foreground text-2xl"
                                : "border-foreground/10 hover:border-foreground opacity-30 hover:opacity-100"
                        )}
                    >
                        {optionA}
                    </button>
                    <button
                        type="button"
                        onClick={() => setSide(optionB)}
                        className={cn(
                            "py-6 border-[3px] font-black uppercase tracking-tighter transition-all duration-300 transform active:scale-95",
                            side === optionB
                                ? "bg-foreground text-background border-foreground text-2xl"
                                : "border-foreground/10 hover:border-foreground opacity-30 hover:opacity-100"
                        )}
                    >
                        {optionB}
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
                        placeholder="논리적 근거를 제시하세요. 최소 50자 이상 작성해야 제출할 수 있습니다."
                        maxLength={2000}
                        rows={8}
                        className="w-full bg-background border-[3px] border-foreground p-4 font-medium text-foreground placeholder:opacity-30 focus:outline-none focus:border-opacity-70 transition-all resize-none"
                    />
                </div>

                {/* Error Display */}
                {error && (
                    <div className="border-[3px] border-red-500 bg-red-500/10 p-4 text-red-500 font-bold text-sm">
                        ⚠️ {error}
                    </div>
                )}

                {/* Success Display */}
                {result && (
                    <div className="border-[3px] border-foreground bg-foreground text-background p-6 space-y-2">
                        <p className="font-black uppercase tracking-widest text-sm">✅ 제출 완료!</p>
                        {result.feedback && (
                            <p className="text-sm font-medium opacity-90">{result.feedback}</p>
                        )}
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isSubmitting || content.length < 50}
                    className={cn(
                        "w-full bg-foreground text-background py-4 px-8",
                        "font-black uppercase tracking-widest text-sm",
                        "hover:opacity-80 transition-opacity",
                        "border-[3px] border-foreground",
                        "disabled:opacity-20 disabled:cursor-not-allowed"
                    )}
                >
                    {isSubmitting ? "제출 중..." : "제출하기"}
                </button>
            </form>

            <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
        </>
    );
}
