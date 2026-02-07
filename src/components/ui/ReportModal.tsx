"use client";

import { useState } from "react";
import { submitReport } from "@/app/actions";

interface ReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    targetType: 'argument' | 'comment' | 'notice_comment';
    targetId: string;
}

export function ReportModal({ isOpen, onClose, targetType, targetId }: ReportModalProps) {
    const [reason, setReason] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!reason.trim()) return alert("신고 사유를 입력해주세요.");

        setIsSubmitting(true);
        try {
            const result = await submitReport(targetType, targetId, reason);
            if (result.success) {
                alert("신고가 접수되었습니다. 관리자가 검토 후 처리하겠습니다.");
                onClose();
                setReason("");
            } else {
                alert(`신고 실패: ${result.error}`);
            }
        } catch (error: any) {
            alert(`오류 발생: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 animate-in fade-in duration-200">
            <div className="bg-background border-[3px] border-foreground p-6 w-full max-w-md space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-black uppercase tracking-tighter">🚨 Report Check</h2>
                    <button onClick={onClose} className="text-2xl hover:opacity-50">✕</button>
                </div>

                <p className="text-sm font-bold opacity-60">
                    부적절한 콘텐츠를 신고해주세요. 허위 신고 시 불이익이 있을 수 있습니다.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="신고 사유를 자세히 적어주세요..."
                        className="w-full h-32 p-3 bg-transparent border-2 border-foreground/30 text-sm focus:border-foreground focus:outline-none resize-none"
                    />

                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-xs font-black uppercase border border-foreground/30 hover:bg-foreground hover:text-background transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 text-xs font-black uppercase bg-red-600 text-white border border-red-600 hover:bg-red-700 transition-colors disabled:opacity-50"
                        >
                            {isSubmitting ? "Sending..." : "Submit Report"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
