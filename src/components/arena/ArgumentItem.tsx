"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import type { Argument, Comment, Profile } from "@/lib/database.types";
import {
    getComments,
    postComment,
    updateArgument,
    deleteArgument,
    updateComment,
    deleteComment
} from "@/app/actions";
import { LikeButton } from "@/components/ui/LikeButton";
import { ImageUploader } from "@/components/ui/ImageUploader";
import { ActionButtons, EditControls } from "@/components/ui/ActionButtons";
import { LoginModal } from "@/components/ui/LoginModal";

interface ArgumentItemProps {
    argument: Argument & { profiles: Profile | null; is_liked: boolean; comment_count: number };
    currentUser: { id: string } | null;
    userProfile: Profile | null;
}

export function ArgumentItem({ argument, currentUser, userProfile }: ArgumentItemProps) {
    const router = useRouter();
    // Comments State
    const [isCommentsOpen, setIsCommentsOpen] = useState(false);
    const [comments, setComments] = useState<(Comment & { profiles: Profile | null; is_liked: boolean })[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [commentCount, setCommentCount] = useState(argument.comment_count || 0);

    useEffect(() => {
        if (comments.length > 0) {
            setCommentCount(comments.length);
        }
    }, [comments.length]);

    // ... (rest of state stays same) ...

    // Post Comment State
    const [newComment, setNewComment] = useState("");
    const [newCommentImageUrls, setNewCommentImageUrls] = useState<string[]>([]);
    const [isPosting, setIsPosting] = useState(false);

    // Argument Edit State
    const [isEditingArgument, setIsEditingArgument] = useState(false);
    const [editArgumentContent, setEditArgumentContent] = useState("");
    const [isUpdatingArgument, setIsUpdatingArgument] = useState(false);

    // Comment Edit State
    const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
    const [editCommentContent, setEditCommentContent] = useState("");
    const [isUpdatingComment, setIsUpdatingComment] = useState(false);

    // Image & UI State
    const [showArgumentImages, setShowArgumentImages] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    // Login Modal State
    const [showLoginModal, setShowLoginModal] = useState(false);

    // --- Actions ---

    const toggleComments = async () => {
        const nextState = !isCommentsOpen;
        setIsCommentsOpen(nextState);

        if (nextState) {
            setIsLoading(true);
            try {
                const data = await getComments(argument.id, currentUser?.id);
                setComments(data);
            } catch (error) {
                console.error("Failed to fetch comments:", error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handlePostComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser) {
            setShowLoginModal(true);
            return;
        }
        if (!newComment.trim()) return alert("댓글 내용을 입력해주세요.");

        try {
            setIsPosting(true);
            const result = await postComment(argument.id, newComment, newCommentImageUrls);

            if (result.success && result.comment) {
                const newCommentObj: Comment & { profiles: Profile | null; is_liked: boolean } = {
                    ...result.comment,
                    profiles: userProfile || null,
                    is_liked: false,
                    image_urls: result.comment.image_urls || newCommentImageUrls
                };
                setComments(prev => [...prev, newCommentObj]);
                setNewComment("");
                setNewCommentImageUrls([]);
            } else {
                alert(`오류 발생: ${result.error || "알 수 없는 오류"}`);
            }
        } catch (err: any) {
            alert(`예기치 않은 오류: ${err.message}`);
        } finally {
            setIsPosting(false);
        }
    };

    const handleDeleteArgument = async () => {
        const result = await deleteArgument(argument.id);
        if (result.success) {
            alert("삭제되었습니다.");
            window.location.reload(); // Simple way to refresh feed
        } else {
            alert(`삭제 실패: ${result.error}`);
        }
    };

    const handleUpdateArgument = async () => {
        setIsUpdatingArgument(true);
        const result = await updateArgument(argument.id, editArgumentContent);
        if (result.success) {
            window.location.reload();
        } else {
            alert(`수정 실패: ${result.error}`);
        }
        setIsUpdatingArgument(false);
    };

    const handleDeleteComment = async (commentId: string) => {
        const result = await deleteComment(commentId);
        if (result.success) {
            setComments(prev => prev.filter(c => c.id !== commentId));
        } else {
            alert(`삭제 실패: ${result.error}`);
        }
    };

    const handleUpdateComment = async () => {
        if (!editingCommentId) return;
        setIsUpdatingComment(true);
        const result = await updateComment(editingCommentId, editCommentContent);
        if (result.success) {
            setComments(prev => prev.map(c =>
                c.id === editingCommentId ? { ...c, content: editCommentContent } : c
            ));
            setEditingCommentId(null);
            setEditCommentContent("");
        } else {
            alert(`수정 실패: ${result.error}`);
        }
        setIsUpdatingComment(false);
    };

    const isUserAdmin = userProfile?.role === 'admin';
    const isArgOwner = currentUser?.id === argument.user_id;

    // Report State
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportTarget, setReportTarget] = useState<{ type: 'argument' | 'comment', id: string } | null>(null);

    const handleReport = (type: 'argument' | 'comment', id: string) => {
        if (!currentUser) {
            setShowLoginModal(true);
            return;
        }
        setReportTarget({ type, id });
        setShowReportModal(true);
    };

    return (
        <div className="border border-foreground/20 shadow-sm p-8 bg-background space-y-6 relative rounded-sm hover:shadow-md transition-shadow">
            {/* Argument Content */}
            <div className="flex justify-between items-start">
                <div className="space-y-4 w-full">
                    <div className="flex items-center gap-3 mb-2">
                        {/* ... (Side badge and User) ... */}
                        <span className={`inline-block px-3 py-1 text-[10px] uppercase font-black tracking-[0.2em] border border-foreground/10 rounded-full ${argument.side === 'pro' ? 'bg-foreground text-background' : 'bg-background text-foreground'}`}>
                            {argument.side.toUpperCase()}
                        </span>
                        <span className="text-xs font-bold opacity-40 uppercase tracking-widest">
                            {argument.profiles?.username || "Unknown Warrior"}
                        </span>

                        {/* Action Buttons (Edit/Delete) */}
                        <ActionButtons
                            isOwner={isArgOwner}
                            isAdmin={isUserAdmin}
                            onEdit={() => {
                                setIsEditingArgument(true);
                                setEditArgumentContent(argument.content);
                            }}
                            onDelete={handleDeleteArgument}
                        />

                        {/* Report Button (Argument) */}
                        {!isArgOwner && (
                            <button
                                onClick={() => handleReport('argument', argument.id)}
                                className="ml-auto text-xs opacity-20 hover:opacity-100 hover:text-red-500 transition-all"
                                title="Report"
                            >
                                🏳️
                            </button>
                        )}
                    </div>

                    {/* ... (Edit/View Logic) ... */}
                    {isEditingArgument ? (
                        <div>
                            <textarea
                                value={editArgumentContent}
                                onChange={(e) => setEditArgumentContent(e.target.value)}
                                className="w-full p-4 border-2 border-foreground bg-background text-lg font-serif leading-loose resize-none h-48 focus:outline-none"
                            />
                            <EditControls
                                onSave={handleUpdateArgument}
                                onCancel={() => setIsEditingArgument(false)}
                                isSaving={isUpdatingArgument}
                            />
                        </div>
                    ) : (
                        <p className="text-lg md:text-xl font-serif font-light leading-loose text-foreground/90 whitespace-pre-wrap selection:bg-foreground/10 selection:text-foreground">
                            {argument.content}
                        </p>
                    )}

                    {/* ... (Images Logic) ... */}
                    {argument.image_urls && argument.image_urls.length > 0 && !isEditingArgument && (
                        <div className="mt-4">
                            <button
                                onClick={() => setShowArgumentImages(!showArgumentImages)}
                                className="text-xs font-bold uppercase tracking-widest border border-foreground/30 px-3 py-2 hover:bg-foreground hover:text-background transition-colors flex items-center gap-2"
                            >
                                <span>📷 View Images ({argument.image_urls.length})</span>
                                <span className={`text-[10px] transition-transform ${showArgumentImages ? 'rotate-180' : ''}`}>▼</span>
                            </button>

                            {showArgumentImages && (
                                <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-2 animate-in slide-in-from-top-2">
                                    {argument.image_urls.map((url, idx) => (
                                        <div
                                            key={idx}
                                            onClick={() => setSelectedImage(url)}
                                            className="relative aspect-video rounded-sm overflow-hidden border border-foreground/10 cursor-zoom-in hover:opacity-90 transition-opacity"
                                        >
                                            <img
                                                src={url}
                                                alt={`Evidence ${idx + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Action Bar */}
            <div className="pt-6 border-t border-foreground/5 flex items-center justify-between gap-4">
                <button
                    onClick={toggleComments}
                    className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity"
                >
                    <span className="group-hover:scale-110 transition-transform">💬</span>
                    <span>Comments ({commentCount})</span>
                </button>

                <div className="flex items-center gap-4">
                    <LikeButton
                        type="argument"
                        targetId={argument.id}
                        initialCount={argument.like_count || 0}
                        initialLiked={argument.is_liked}
                        currentUser={currentUser}
                    />
                </div>
            </div>

            {/* Comment Section */}
            {isCommentsOpen && (
                <div className="mt-4 pl-4 border-l-[3px] border-foreground/10 space-y-6 animate-in slide-in-from-top-2">
                    <div className="space-y-3">
                        {isLoading ? (
                            <p className="text-xs opacity-40">Loading comments...</p>
                        ) : comments.length > 0 ? (
                            comments.map(comment => (
                                <div key={comment.id} className="text-sm group/comment">
                                    <div className="flex items-center justify-between gap-2 mb-0.5">
                                        <div className="flex items-center gap-2">
                                            <p className="font-bold opacity-30 text-[10px]">
                                                {comment.profiles?.username || "Unknown Warrior"} • {new Date(comment.created_at || "").toLocaleTimeString()}
                                            </p>
                                            {/* Report Button (Comment) */}
                                            {currentUser?.id !== comment.user_id && (
                                                <button
                                                    onClick={() => handleReport('comment', comment.id)}
                                                    className="opacity-0 group-hover/comment:opacity-20 hover:!opacity-100 text-[10px] hover:text-red-500 transition-all"
                                                    title="Report Comment"
                                                >
                                                    🏳️
                                                </button>
                                            )}
                                        </div>

                                        {editingCommentId !== comment.id && (
                                            <ActionButtons
                                                isOwner={currentUser?.id === comment.user_id}
                                                isAdmin={isUserAdmin}
                                                onEdit={() => {
                                                    setEditingCommentId(comment.id);
                                                    setEditCommentContent(comment.content);
                                                }}
                                                onDelete={() => handleDeleteComment(comment.id)}
                                            />
                                        )}
                                    </div>

                                    {/* ... (Comment Content Logic) ... */}
                                    {editingCommentId === comment.id ? (
                                        <div className="mt-1">
                                            <textarea
                                                value={editCommentContent}
                                                onChange={(e) => setEditCommentContent(e.target.value)}
                                                className="w-full p-2 border border-foreground/30 bg-background text-sm focus:outline-none h-20"
                                            />
                                            <EditControls
                                                onSave={handleUpdateComment}
                                                onCancel={() => {
                                                    setEditingCommentId(null);
                                                    setEditCommentContent("");
                                                }}
                                                isSaving={isUpdatingComment}
                                            />
                                        </div>
                                    ) : (
                                        <>
                                            <p className="font-medium">{comment.content}</p>
                                            {comment.image_urls && comment.image_urls.length > 0 && (
                                                <div className="mt-2 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                                    {comment.image_urls.map((url, idx) => (
                                                        <div
                                                            key={idx}
                                                            onClick={() => setSelectedImage(url)}
                                                            className="relative w-24 h-24 shrink-0 rounded-sm overflow-hidden border border-foreground/10 cursor-zoom-in hover:opacity-90 transition-opacity"
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

                                    <div className="mt-1 flex items-center justify-between">
                                        <LikeButton
                                            type="comment"
                                            targetId={comment.id}
                                            initialCount={comment.like_count || 0}
                                            initialLiked={false}
                                            currentUser={currentUser}
                                        />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-xs opacity-40 italic">No comments yet. Start the discussion.</p>
                        )}
                    </div>

                    <form onSubmit={handlePostComment} className="flex gap-2">
                        <div className="flex-1 flex gap-2 flex-col">
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Add a comment..."
                                className="w-full p-2 border-2 border-foreground bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 resize-none h-20"
                            />
                            <div className="flex justify-between items-center">
                                <ImageUploader onImagesSelected={setNewCommentImageUrls} maxFiles={3} images={newCommentImageUrls} />
                                <button
                                    type="submit"
                                    disabled={isPosting}
                                    className="px-4 py-2 bg-foreground text-background text-xs font-black uppercase tracking-widest hover:opacity-80 disabled:opacity-30"
                                >
                                    {isPosting ? "..." : "Post"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            )}

            {/* Modals */}
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

            {reportTarget && (
                <ReportModal
                    isOpen={showReportModal}
                    onClose={() => setShowReportModal(false)}
                    targetType={reportTarget.type}
                    targetId={reportTarget.id}
                />
            )}
        </div >
    );
}

import { ReportModal } from "@/components/ui/ReportModal";
