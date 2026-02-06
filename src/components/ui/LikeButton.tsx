"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toggleArgumentLike, toggleCommentLike } from "@/app/likes/actions";
import { LoginModal } from "@/components/ui/LoginModal";

interface LikeButtonProps {
    type: "argument" | "comment";
    targetId: string;
    initialCount?: number;
    initialLiked?: boolean; // We might need to fetch this or pass it
    currentUser: any;
}

export function LikeButton({ type, targetId, initialCount = 0, initialLiked = false, currentUser }: LikeButtonProps) {
    const [liked, setLiked] = useState(initialLiked);
    const [count, setCount] = useState(initialCount);
    const [isPending, setIsPending] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const router = useRouter();

    const handleToggle = async () => {
        if (!currentUser) {
            setShowLoginModal(true);
            return;
        }
        if (isPending) return;

        // Optimistic
        const previousLiked = liked;
        const previousCount = count;
        setLiked(!liked);
        setCount(liked ? count - 1 : count + 1);
        setIsPending(true);

        const action = type === "argument" ? toggleArgumentLike : toggleCommentLike;
        const result = await action(targetId);

        if (!result.success) {
            // Revert
            setLiked(previousLiked);
            setCount(previousCount);
        }
        setIsPending(false);
    };

    return (
        <>
            <button
                onClick={handleToggle}
                disabled={isPending}
                className={`flex items-center gap-1.5 transition-all active:scale-95 group ${liked ? 'opacity-100' : 'opacity-40 hover:opacity-70'}`}
            >
                <span className={`text-lg transition-transform ${liked ? 'scale-110' : 'group-hover:scale-110'}`}>
                    {liked ? "❤️" : "🤍"}
                </span>
                <span className="text-xs font-black tracking-widest tabular-nums">
                    {count}
                </span>
            </button>
            <LoginModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
                onConfirm={() => router.push("/login")}
            />
        </>
    );
}
