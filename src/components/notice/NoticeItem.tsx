"use client";

import { useRouter } from "next/navigation";

import { useState, useEffect } from "react";
import type { Notice, Profile, NoticeComment } from "@/lib/database.types";
import {
    getNoticeComments,
    postNoticeComment,
    deleteNotice,
    deleteNoticeComment,
    updateNoticeComment
} from "@/app/actions";
import { LikeButton } from "@/components/ui/LikeButton";
import { ImageUploader } from "@/components/ui/ImageUploader";
import { ActionButtons, EditControls } from "@/components/ui/ActionButtons";
import { LoginModal } from "@/components/ui/LoginModal";

interface NoticeItemProps {
    notice: Notice & { is_liked?: boolean; note_comment_count?: number };
    currentUser: { id: string } | null;
    userProfile: Profile | null;
}

export function NoticeItem({ notice, currentUser, userProfile }: NoticeItemProps) {
    const router = useRouter();
    const [isCommentsOpen, setIsCommentsOpen] = useState(false);
    const [comments, setComments] = useState<(NoticeComment & { profiles: Profile | null; is_liked: boolean })[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [commentCount, setCommentCount] = useState(notice.note_comment_count || 0);

    useEffect(() => {
        if (comments.length > 0) {
            setCommentCount(comments.length);
        }
    }, [comments.length]);

    // Post Comment State
    const [newComment, setNewComment] = useState("");
    const [newCommentImageUrls, setNewCommentImageUrls] = useState<string[]>([]);
    const [isPosting, setIsPosting] = useState(false);

    // UI State
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isDeletingNotice, setIsDeletingNotice] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);

    // Edit Comment State
    const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
    const [editingContent, setEditingContent] = useState("");
    const [isUpdatingComment, setIsUpdatingComment] = useState(false);

    // Load comments when toggled open
    const toggleComments = async () => {
        const nextState = !isCommentsOpen;
        setIsCommentsOpen(nextState);

        if (nextState && comments.length === 0) { // Fetch only if opening and empty (or always fetch? existing logic fetched always on open)
            // Re-fetching ensures up-to-date comments. 
            // The previous logic fetched every time it opened. Let's keep that behavior for freshness.
            setIsLoading(true);
            try {
                const data = await getNoticeComments(notice.id, currentUser?.id);
                setComments(data);
            } catch (error) {
                console.error("Failed to fetch notice comments:", error);
            } finally {
                setIsLoading(false);
            }
        } else if (nextState) {
            // If opening and already have data, maybe refine freshness strategy logic? 
            // Existing code fetched every time. Let's stick to simple "Fetch on open".
            // But to make it immediate, we set Open check first.
            setIsLoading(true);
            getNoticeComments(notice.id, currentUser?.id)
                .then(data => setComments(data))
                .catch(err => console.error(err))
                .finally(() => setIsLoading(false));
        }
    };

    const handlePostComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser) {
            setShowLoginModal(true);
            return;
        }
        if (!newComment.trim()) return alert("내용을 입력해주세요.");

        try {
            setIsPosting(true);
            const result = await postNoticeComment(notice.id, newComment, currentUser.id, newCommentImageUrls);

            if (result.success && result.comment) {
                const newCommentObj: NoticeComment & { profiles: Profile | null; is_liked: boolean } = {
                    ...result.comment,
                    profiles: userProfile || null,
                    is_liked: false,
                    image_urls: result.comment.image_urls || newCommentImageUrls
                };
                setComments(prev => [...prev, newCommentObj]);
                setNewComment("");
                setNewCommentImageUrls([]);
            } else {
                alert(`오류: ${result.error}`);
            }
        } catch (err: any) {
            alert(`오류: ${err.message}`);
        } finally {
            setIsPosting(false);
        }
    };

    const handleDeleteNotice = async () => {
        setIsDeletingNotice(true);
        const result = await deleteNotice(notice.id);
        if (result.success) {
            alert("공지사항이 삭제되었습니다.");
            window.location.reload();
        } else {
            alert(`삭제 실패: ${result.error}`);
            setIsDeletingNotice(false);
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        const result = await deleteNoticeComment(commentId);
        if (result.success) {
            setComments(prev => prev.filter(c => c.id !== commentId));
        } else {
            alert(`삭제 실패: ${result.error}`);
        }
    };

    const handleUpdateComment = async () => {
        if (!editingCommentId) return;
        setIsUpdatingComment(true);
        const result = await updateNoticeComment(editingCommentId, editingContent);
        if (result.success) {
            setComments(prev => prev.map(c =>
                c.id === editingCommentId ? { ...c, content: editingContent } : c
            ));
            setEditingCommentId(null);
            setEditingContent("");
        } else {
            alert(`수정 실패: ${result.error}`);
        }
        setIsUpdatingComment(false);
    };

    const isUserAdmin = userProfile?.role === 'admin';
    const isNoticeOwner = currentUser?.id === userProfile?.id; // Notices are created by admins, checking logic?
    // Actually notices don't have user_id in schema? Let's check schema.
    // Schema notices: id, title, content, created_at. No user_id. So only Admin can delete.

    return (
        <article className="border-[3px] border-foreground p-8 bg-background hover:bg-foreground/5 transition-colors bw-glow group rounded-sm relative">
            <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2 mb-4">
                <h2 className="text-2xl font-[900] tracking-tighter uppercase group-hover:underline decoration-4 underline-offset-4">
                    {notice.title}
                </h2>
                <div className="flex items-center gap-4">
                    <time className="text-sm font-bold opacity-40 uppercase tracking-widest shrink-0">
                        {new Date(notice.created_at).toLocaleDateString()}
                    </time>
                    {/* Notice Actions (Admin Only) */}
                    {isUserAdmin && (
                        <ActionButtons
                            isOwner={false} // Notices don't store owner, rely on Admin check
                            isAdmin={true}
                            onEdit={() => alert("Notice editing coming soon")} // Placeholder
                            onDelete={handleDeleteNotice}
                            isDeleting={isDeletingNotice}
                        />
                    )}
                </div>
            </div>

            <p className="text-lg font-medium leading-relaxed whitespace-pre-wrap opacity-80 mb-6">
                {notice.content}
            </p>

            {/* Action Bar */}
            <div className="pt-6 border-t border-foreground/10 flex items-center justify-between gap-4">
                <button
                    onClick={toggleComments}
                    className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity"
                >
                    <span className="group-hover:scale-110 transition-transform">💬</span>
                    <span>Comments ({commentCount})</span>
                </button>
                <div className="flex items-center gap-4">
                    <div />
                </div>
            </div>

            {/* Comment Section */}
            {isCommentsOpen && (
                <div className="mt-6 pt-6 border-t border-foreground/10 space-y-8 animate-in slide-in-from-top-2">
                    {/* Comment Form */}
                    <div className="mb-8">
                        <form onSubmit={handlePostComment} className="flex gap-2">
                            <div className="flex-1 flex gap-2 flex-col">
                                <textarea
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Write a suggestion or comment..."
                                    className="w-full p-4 border-2 border-foreground bg-background text-sm focus:outline-none focus:ring-4 focus:ring-foreground/10 resize-none h-24"
                                />
                                <div className="flex justify-between items-center">
                                    <ImageUploader onImagesSelected={setNewCommentImageUrls} maxFiles={3} images={newCommentImageUrls} />
                                    <button
                                        type="submit"
                                        disabled={isPosting}
                                        className="px-6 py-2 bg-foreground text-background text-xs font-black uppercase tracking-widest hover:opacity-80 disabled:opacity-30"
                                    >
                                        {isPosting ? "Posting..." : "Post Comment"}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Comment List */}
                    <div className="space-y-6">
                        {isLoading ? (
                            <p className="text-xs opacity-40 text-center">Loading comments...</p>
                        ) : comments.length > 0 ? (
                            comments.map(comment => (
                                <div key={comment.id} className="text-sm border-l-2 border-foreground/10 pl-4 py-1">
                                    <div className="flex items-baseline justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold">{comment.profiles?.username || "Unknown"}</span>
                                            {comment.profiles?.role === 'admin' && (
                                                <span className="text-[10px] bg-foreground text-background px-1 rounded-sm font-black uppercase">ADMIN</span>
                                            )}
                                        </div>
                                        {/* Action Buttons for Comment */}
                                        <div className="ml-auto flex items-center gap-2">
                                            <time className="text-[10px] opacity-40 uppercase tracking-widest mr-2">
                                                {new Date(comment.created_at).toLocaleTimeString()}
                                            </time>
                                            {editingCommentId !== comment.id && (
                                                <ActionButtons
                                                    isOwner={currentUser?.id === comment.user_id}
                                                    isAdmin={isUserAdmin}
                                                    onEdit={() => {
                                                        setEditingCommentId(comment.id);
                                                        setEditingContent(comment.content);
                                                    }}
                                                    onDelete={() => handleDeleteComment(comment.id)}
                                                />
                                            )}
                                        </div>
                                    </div>

                                    {/* Content or Edit Form */}
                                    {editingCommentId === comment.id ? (
                                        <div className="mt-2">
                                            <textarea
                                                value={editingContent}
                                                onChange={(e) => setEditingContent(e.target.value)}
                                                className="w-full p-2 border border-foreground/30 bg-background text-sm focus:outline-none h-20"
                                            />
                                            <EditControls
                                                onSave={handleUpdateComment}
                                                onCancel={() => {
                                                    setEditingCommentId(null);
                                                    setEditingContent("");
                                                }}
                                                isSaving={isUpdatingComment}
                                            />
                                        </div>
                                    ) : (
                                        <>
                                            <p className="font-medium leading-relaxed opacity-90">{comment.content}</p>
                                            {comment.image_urls && comment.image_urls.length > 0 && (
                                                <div className="mt-3 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                                    {comment.image_urls.map((url, idx) => (
                                                        <div
                                                            key={idx}
                                                            onClick={() => setSelectedImage(url)}
                                                            className="relative w-20 h-20 shrink-0 rounded-sm overflow-hidden border border-foreground/10 cursor-zoom-in hover:opacity-90 transition-opacity"
                                                        >
                                                            <img
                                                                src={url}
                                                                alt={`Comment attachment ${idx}`}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p className="text-xs opacity-40 italic text-center">No comments yet. Be the first to suggest!</p>
                        )}
                    </div>
                </div>
            )}

            {/* Lightbox */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-zoom-out animate-in fade-in duration-200"
                    onClick={() => setSelectedImage(null)}
                >
                    <div className="relative max-w-full max-h-full">
                        <img
                            src={selectedImage}
                            alt="Full screen view"
                            className="max-w-full max-h-[90vh] object-contain rounded-sm shadow-2xl"
                        />
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute -top-12 right-0 text-white text-xl font-bold uppercase tracking-widest hover:opacity-70"
                        >
                            Close ✕
                        </button>
                    </div>
                </div>
            )}

            <LoginModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
                onConfirm={() => router.push("/login")}
            />
        </article>
    );
}
