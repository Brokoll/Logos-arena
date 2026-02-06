"use client";

import { useState } from "react";
import { deleteDebate } from "@/app/admin/actions";

interface Debate {
    id: string;
    topic: string;
    option_a: string;
    option_b: string;
    status: string;
    created_at: string;
}

interface DebateListProps {
    debates: Debate[];
}

export function DebateList({ debates }: DebateListProps) {
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleDelete = async (id: string, topic: string) => {
        if (!confirm(`정말로 "${topic}" 토론을 삭제하시겠습니까?\n\n⚠️ 관련된 모든 논증과 댓글도 함께 삭제됩니다!`)) {
            return;
        }

        setDeletingId(id);
        const result = await deleteDebate(id);

        if (result.success) {
            alert("토론이 삭제되었습니다.");
            window.location.reload();
        } else {
            alert("삭제 실패: " + result.error);
        }
        setDeletingId(null);
    };

    if (debates.length === 0) {
        return (
            <div className="border-[3px] border-foreground/30 border-dashed p-8 text-center">
                <p className="text-sm font-medium opacity-60">
                    생성된 토론이 없습니다.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {debates.map((debate) => (
                <div
                    key={debate.id}
                    className="border-[3px] border-foreground p-6 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                    <div className="flex-1 min-w-0">
                        <h3 className="font-black text-lg truncate">{debate.topic}</h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                            <span className="text-xs font-bold bg-foreground/10 px-2 py-1">
                                {debate.option_a}
                            </span>
                            <span className="text-xs font-bold opacity-50">vs</span>
                            <span className="text-xs font-bold bg-foreground/10 px-2 py-1">
                                {debate.option_b}
                            </span>
                        </div>
                        <p className="text-xs font-medium opacity-50 mt-2">
                            {new Date(debate.created_at).toLocaleDateString("ko-KR")} ·
                            상태: {debate.status === "active" ? "🟢 진행중" : "🔴 종료"}
                        </p>
                    </div>
                    <button
                        onClick={() => handleDelete(debate.id, debate.topic)}
                        disabled={deletingId === debate.id}
                        className="shrink-0 border-[3px] border-red-500 text-red-500 px-4 py-2 font-black text-sm uppercase tracking-wider hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                    >
                        {deletingId === debate.id ? "삭제 중..." : "🗑️ 삭제"}
                    </button>
                </div>
            ))}
        </div>
    );
}
