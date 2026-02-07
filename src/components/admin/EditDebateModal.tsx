"use client";

import { useState } from "react";
import { updateDebate } from "@/app/admin/actions";
import { cn } from "@/lib/utils";

interface Debate {
    id: string;
    topic: string;
    description: string | null;
    option_a: string;
    option_b: string;
    status: string;
}

interface EditDebateModalProps {
    debate: Debate;
    onClose: () => void;
    onSuccess: () => void;
}

export function EditDebateModal({ debate, onClose, onSuccess }: EditDebateModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const result = await updateDebate(debate.id, formData);

        if (result.success) {
            onSuccess();
            onClose();
        } else {
            setError(result.error || "수정 실패");
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-background border-[4px] border-foreground w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="p-6 border-b-[3px] border-foreground flex justify-between items-center bg-foreground/5">
                    <h2 className="text-xl font-black uppercase tracking-tight">
                        토론 수정
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-lg font-bold hover:opacity-50 transition-opacity"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {/* Topic */}
                    <div className="space-y-2">
                        <label className="text-sm font-black uppercase tracking-wider block">
                            주제 <span className="text-red-500">*</span>
                        </label>
                        <input
                            name="topic"
                            type="text"
                            defaultValue={debate.topic}
                            required
                            minLength={5}
                            className="w-full bg-background border-[3px] border-foreground p-3 font-bold focus:outline-none focus:ring-4 focus:ring-foreground/20 transition-all"
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="text-sm font-black uppercase tracking-wider block">
                            설명
                        </label>
                        <textarea
                            name="description"
                            defaultValue={debate.description || ""}
                            rows={3}
                            className="w-full bg-background border-[3px] border-foreground p-3 font-medium focus:outline-none focus:ring-4 focus:ring-foreground/20 transition-all resize-none"
                        />
                    </div>

                    {/* Options */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-black uppercase tracking-wider block">
                                선택지 A <span className="text-red-500">*</span>
                            </label>
                            <input
                                name="option_a"
                                type="text"
                                defaultValue={debate.option_a}
                                required
                                maxLength={50}
                                className="w-full bg-background border-[3px] border-foreground p-3 font-bold focus:outline-none focus:ring-4 focus:ring-foreground/20 transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-black uppercase tracking-wider block">
                                선택지 B <span className="text-red-500">*</span>
                            </label>
                            <input
                                name="option_b"
                                type="text"
                                defaultValue={debate.option_b}
                                required
                                maxLength={50}
                                className="w-full bg-background border-[3px] border-foreground p-3 font-bold focus:outline-none focus:ring-4 focus:ring-foreground/20 transition-all"
                            />
                        </div>
                    </div>

                    {/* Status */}
                    <div className="space-y-2">
                        <label className="text-sm font-black uppercase tracking-wider block">
                            상태
                        </label>
                        <select
                            name="status"
                            defaultValue={debate.status}
                            className="w-full bg-background border-[3px] border-foreground p-3 font-bold focus:outline-none focus:ring-4 focus:ring-foreground/20 transition-all appearance-none cursor-pointer"
                        >
                            <option value="active">🟢 진행중 (Active)</option>
                            <option value="closed">🔴 종료 (Closed)</option>
                        </select>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="p-4 bg-red-500/10 border-[3px] border-red-500 text-red-500 font-bold text-sm">
                            ⚠️ {error}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex justify-end gap-4 pt-4 border-t-[3px] border-foreground/10">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="px-6 py-3 border-[3px] border-transparent font-black uppercase tracking-wider hover:opacity-50 transition-opacity"
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={cn(
                                "px-8 py-3 bg-foreground text-background border-[3px] border-foreground font-black uppercase tracking-wider transition-all hover:opacity-90",
                                isSubmitting && "opacity-50 cursor-not-allowed"
                            )}
                        >
                            {isSubmitting ? "저장 중..." : "변경사항 저장"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
