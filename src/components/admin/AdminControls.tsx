"use client";

import { useState } from "react";
import { deleteArgument, deleteComment } from "@/app/admin/actions";

interface AdminControlsProps {
    type: "argument" | "comment";
    id: string;
    userRole?: 'user' | 'admin';
}

export function AdminControls({ type, id, userRole }: AdminControlsProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    if (userRole !== "admin") return null;

    const handleDelete = async () => {
        if (!confirm("정말 삭제하시겠습니까? (복구 불가)")) return;

        setIsDeleting(true);
        let result;

        if (type === "argument") {
            result = await deleteArgument(id);
        } else {
            result = await deleteComment(id);
        }

        if (result.success) {
            alert("삭제되었습니다.");
            window.location.reload(); // Simple reload to reflect changes
        } else {
            alert("삭제 실패: " + result.error);
        }
        setIsDeleting(false);
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-700 hover:underline border border-red-500/20 px-2 py-0.5 rounded"
        >
            {isDeleting ? "Deleting..." : "⚠️ DELETE"}
        </button>
    );
}
