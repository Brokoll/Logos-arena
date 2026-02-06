"use client";

import { useFormState, useFormStatus } from "react-dom";
import { postComment } from "@/app/actions";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface CommentFormProps {
    argumentId: string;
    userId: string;
    onCommentPosted: () => void; // 댓글이 성공적으로 게시되면 호출될 콜백 함수
}

const initialState = {
    success: false,
    error: undefined,
};

export function CommentForm({ argumentId, userId, onCommentPosted }: CommentFormProps) {
    const [state, formAction] = useFormState(postCommentWithArgs, initialState);
    const { pending } = useFormStatus();
    const formRef = useRef<HTMLFormElement>(null);
    const [commentContent, setCommentContent] = useState(''); // 로컬 상태로 내용 관리

    // postCommentWithArgs는 useFormState의 액션 함수 시그니처에 맞게 argumentId와 userId를 바인딩합니다.
    // useFormState의 첫 번째 인자로 사용될 함수는 `(prevState, formData) => newState` 시그니처를 가집니다.
    // argumentId와 userId를 클로저를 통해 전달합니다.
    const postCommentWithArgs = async (_: any, formData: FormData) => {
        const content = formData.get("content") as string;
        // postComment 서버 액션은 userId를 직접 인자로 받으므로 formData에서 다시 추출할 필요 없음
        const result = await postComment(argumentId, content, userId);
        if (result.success) {
            onCommentPosted(); // 댓글 게시 성공 시 콜백 호출
        }
        return result;
    };

    useEffect(() => {
        if (state.success) {
            setCommentContent(''); // 폼 초기화
        }
        if (state.error) {
            console.error("댓글 작성 에러:", state.error);
        }
    }, [state]);

    return (
        <form ref={formRef} action={formAction} className="mt-4 space-y-3">
            {/* hidden field는 useFormState를 사용할 때 자동으로 formData에 포함되므로 필요 없음. */}
            {/* 하지만 명시적으로 userId를 전달해야 하므로 postCommentWithArgs 클로저를 사용. */}
            <textarea
                name="content"
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="댓글을 작성해주세요..."
                rows={2}
                className="w-full p-3 border-[2px] border-foreground bg-background resize-none focus:outline-none focus:ring-2 focus:ring-foreground/5 text-base font-medium leading-relaxed placeholder:opacity-40"
                maxLength={500}
                required
            />
            <button
                type="submit"
                disabled={pending || commentContent.trim().length === 0}
                className={cn(
                    "w-full py-2 px-4 bg-foreground text-background font-bold uppercase tracking-tighter transition-all",
                    pending || commentContent.trim().length === 0
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-foreground/80"
                )}
            >
                {pending ? "작성 중..." : "댓글 게시"}
            </button>
            {state.error && (
                <p className="text-sm text-red-500 mt-2">{state.error}</p>
            )}
        </form>
    );
}
