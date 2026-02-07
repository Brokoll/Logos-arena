"use client";

import { useFormState } from "react-dom";
import { createDebate } from "@/app/admin/actions";
import { cn } from "@/lib/utils";
import { useEffect, useState, useRef } from "react";
import { ImageUploader } from "@/components/ui/ImageUploader";

const initialState = { error: "", success: false };

export function DebateForm() {
    const [state, formAction] = useFormState(createDebate, initialState);
    const [showSuccess, setShowSuccess] = useState(false);
    const [imageUrl, setImageUrl] = useState<string>("");
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (state?.success) {
            setShowSuccess(true);
            setImageUrl("");
            formRef.current?.reset();
            const timer = setTimeout(() => setShowSuccess(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [state?.success]);

    const handleImagesSelected = (urls: string[]) => {
        // 첫 번째 이미지만 사용 (토론당 하나의 대표 이미지)
        setImageUrl(urls[0] || "");
    };

    return (
        <form ref={formRef} action={formAction} className="space-y-8">
            <input type="hidden" name="image_url" value={imageUrl} />

            <div className="space-y-4">
                <div>
                    <label htmlFor="topic" className="block text-sm font-black uppercase tracking-wider mb-2">
                        토론 주제 *
                    </label>
                    <input
                        type="text"
                        id="topic"
                        name="topic"
                        required
                        minLength={5}
                        placeholder="예: 인공지능은 인류에게 유익한가?"
                        className="w-full bg-background border-[3px] border-foreground p-4 font-bold text-foreground placeholder:opacity-30 focus:outline-none focus:border-opacity-70 transition-all"
                    />
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-black uppercase tracking-wider mb-2">
                        설명 (선택)
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        rows={4}
                        placeholder="토론 주제에 대한 추가 설명을 입력하세요..."
                        className="w-full bg-background border-[3px] border-foreground p-4 font-medium text-foreground placeholder:opacity-30 focus:outline-none focus:border-opacity-70 transition-all resize-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-black uppercase tracking-wider mb-2">
                        대표 이미지 (선택)
                    </label>
                    <div className="border-[3px] border-foreground/30 border-dashed p-4">
                        <ImageUploader
                            onImagesSelected={handleImagesSelected}
                            maxFiles={1}
                            images={imageUrl ? [imageUrl] : []}
                        />
                        {imageUrl && (
                            <div className="mt-4">
                                <img
                                    src={imageUrl}
                                    alt="대표 이미지 미리보기"
                                    className="max-h-48 rounded border border-foreground/20"
                                />
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="option_a" className="block text-sm font-black uppercase tracking-wider mb-2">
                            선택지 A *
                        </label>
                        <input
                            type="text"
                            id="option_a"
                            name="option_a"
                            required
                            maxLength={50}
                            placeholder="예: 찬성, A안, 고양이파"
                            className="w-full bg-background border-[3px] border-foreground p-4 font-bold text-foreground placeholder:opacity-30 focus:outline-none focus:border-opacity-70 transition-all"
                        />
                    </div>

                    <div>
                        <label htmlFor="option_b" className="block text-sm font-black uppercase tracking-wider mb-2">
                            선택지 B *
                        </label>
                        <input
                            type="text"
                            id="option_b"
                            name="option_b"
                            required
                            maxLength={50}
                            placeholder="예: 반대, B안, 강아지파"
                            className="w-full bg-background border-[3px] border-foreground p-4 font-bold text-foreground placeholder:opacity-30 focus:outline-none focus:border-opacity-70 transition-all"
                        />
                    </div>
                </div>
            </div>

            {state?.error && (
                <div className="border-[3px] border-red-500 bg-red-500/10 p-4 text-red-500 font-bold text-sm">
                    ⚠️ {state.error}
                </div>
            )}

            {showSuccess && (
                <div className="border-[3px] border-green-500 bg-green-500/10 p-4 text-green-500 font-bold text-sm animate-pulse">
                    ✅ 토론 주제가 성공적으로 생성되었습니다!
                </div>
            )}

            <button
                type="submit"
                className={cn(
                    "w-full bg-foreground text-background py-4 px-8",
                    "font-black uppercase tracking-widest text-sm",
                    "hover:opacity-80 transition-opacity",
                    "border-[3px] border-foreground"
                )}
            >
                토론 주제 생성
            </button>
        </form>
    );
}

