"use client";

import { useFormState } from "react-dom";
import { createDebate } from "@/app/admin/actions";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const initialState = { error: "", success: false };

export function DebateForm() {
    const [state, formAction] = useFormState(createDebate, initialState);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        if (state?.success) {
            setShowSuccess(true);
            const timer = setTimeout(() => setShowSuccess(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [state?.success]);

    return (
        <form action={formAction} className="space-y-8">
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
