"use server";

import { argumentSchema } from "@/lib/schemas";

import { createServerClient, createAdminClient } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import type { Argument, Debate, NewArgument, Profile, Comment, Notice, NoticeComment } from "@/lib/database.types";

interface CommentResult {
    success: boolean;
    error?: string;
    comment?: Comment; // Return the created comment on success
}

interface SubmitResult {
    success: boolean;
    error?: string;
    score?: number;
    feedback?: string;
}

/**
 * 특정 주장에 대한 댓글을 게시하는 서버 액션입니다.
 * @param argumentId 댓글이 달릴 주장의 ID
 * @param content 댓글 내용
 * @param userId 현재 로그인한 사용자 ID (서버에서 다시 검증)
 * @param imageUrls 댓글에 포함될 이미지 URL (현재는 사용 안 함)
 * @returns CommentResult - 성공 여부, 에러 메시지, 생성된 댓글 객체
 */
// 2. Refactored postComment: Removes userId arg, uses serverClient
export async function postComment(argumentId: string, content: string, imageUrls: string[] = []): Promise<CommentResult> {
    console.log("=== postComment Server Action Called ===");
    console.log("Input - argumentId:", argumentId, "content:", content.substring(0, 50) + "...");

    try {
        const supabase = await createServerClient();

        // 1. Check Session (Get user from session)
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            console.error("Auth Error (postComment):", authError?.message || "User not authenticated.");
            return { success: false, error: "로그인이 필요합니다." };
        }

        // 2. Validate Content
        if (!content || content.trim().length === 0) {
            return { success: false, error: "댓글 내용을 입력해주세요." };
        }
        if (content.trim().length > 500) {
            return { success: false, error: "댓글 내용은 500자를 초과할 수 없습니다." };
        }

        // 3. Verify argumentId exists
        const { data: argumentData, error: argumentError } = await supabase
            .from("arguments")
            .select("debate_id")
            .eq("id", argumentId)
            .single();

        if (argumentError || !argumentData) {
            return { success: false, error: "유효하지 않은 주장에 댓글을 달 수 없습니다." };
        }
        const debateId = argumentData.debate_id;

        // 4. Insert Comment using Server Client (Respects RLS)
        const { data: newComment, error: insertError } = await supabase.from("comments").insert({
            argument_id: argumentId,
            user_id: user.id, // Set from session
            content: content.trim(),
            image_urls: imageUrls
        }).select().single();

        if (insertError) {
            console.error("DB Insert Error (postComment):", insertError);
            return { success: false, error: `댓글 작성 중 데이터베이스 오류: ${insertError.message}` };
        }

        console.log("Comment Inserted Successfully:", newComment);

        revalidatePath(`/debate/${debateId}`); // Revalidate the specific debate page

        return { success: true, comment: newComment as Comment };
    } catch (error: any) {
        console.error("Unexpected Error (postComment):", error);
        return { success: false, error: error.message || "예상치 못한 오류가 발생했습니다." };
    }
}

// 2. Refactored submitArgument: Removes userId arg, uses serverClient
export async function submitArgument(formData: {
    debate_id: string;
    side: "pro" | "con";
    content: string;
    image_urls?: string[];
    // user_id removed from input
}): Promise<SubmitResult> {
    try {
        const supabase = await createServerClient();

        // 1. Get User from Session (Secure)
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return { success: false, error: "로그인이 필요합니다." };
        }
        const userId = user.id;

        // 2. Validate with Zod
        const validationResult = argumentSchema.safeParse({
            debate_id: formData.debate_id,
            side: formData.side,
            content: formData.content,
        });
        if (!validationResult.success) {
            const firstIssue = validationResult.error.issues[0];
            const errorMessage = firstIssue ? firstIssue.message : "유효하지 않은 입력입니다.";
            return { success: false, error: errorMessage };
        }

        // 3. Check Cooldown (Rate Limit: 1 minutes)
        const { data: lastArg } = await supabase
            .from("arguments")
            .select("created_at")
            .eq("user_id", userId)
            .order("created_at", { ascending: false })
            .limit(1)
            .single();

        if (lastArg) {
            const lastTime = new Date(lastArg.created_at).getTime();
            const now = new Date().getTime();
            const diff = now - lastTime;
            const cooldownMs = 1 * 60 * 1000; // 1 minute

            if (diff < cooldownMs) {
                const remainingSec = Math.ceil((cooldownMs - diff) / 1000);
                return {
                    success: false,
                    error: `⏳ 논리 재충전 중입니다. ${remainingSec}초 후에 다시 시도해주세요.`,
                };
            }
        }

        // 4. (Removed) AI Analysis - Logic score and toxicity check disabled

        // 5. (Removed) Toxicity check disabled

        // 6. Save to Supabase (use server client, RLS enabled)
        const insertData: NewArgument = {
            debate_id: formData.debate_id,
            user_id: userId, // From session
            side: formData.side,
            content: formData.content,
            image_urls: formData.image_urls || [],
            score: null,
            feedback: null, // AI feedback disabled
        };

        const { error: dbError } = await supabase.from("arguments").insert(insertData);

        if (dbError) {
            console.error("Supabase error:", dbError);
            return {
                success: false,
                error: `저장 중 오류가 발생했습니다: ${dbError.message}`,
            };
        }

        // 7. Revalidate the page
        revalidatePath("/");

        return {
            success: true,
            score: undefined,
            feedback: undefined,
        };
    } catch (error) {
        console.error("Submit error:", error);
        return {
            success: false,
            error: "예기치 않은 오류가 발생했습니다.",
        };
    }
}

export async function getActiveDebate(): Promise<Debate | null> {
    const supabase = await createServerClient();
    const { data, error } = await supabase
        .from("debates")
        .select("*")
        .eq("status", "active")
        .limit(1)
        .single();

    if (error) {
        console.error("Debate fetch error:", error);
        return null;
    }

    return data as Debate;
}

export async function getDebateArguments(debateId: string, currentUserId?: string): Promise<{
    pro: (Argument & { profiles: Profile; is_liked: boolean; comment_count: number })[];
    con: (Argument & { profiles: Profile; is_liked: boolean; comment_count: number })[]
}> {
    const supabase = await createServerClient();
    const { data: argsData, error } = await supabase
        .from("arguments")
        .select("*, profiles(*), comments(count)")
        .eq("debate_id", debateId)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Arguments fetch error:", error);
        return { pro: [], con: [] };
    }

    let likedArgumentIds = new Set<string>();
    if (currentUserId) {
        const { data: likes } = await supabase
            .from("argument_likes")
            .select("argument_id")
            .eq("user_id", currentUserId);

        if (likes) {
            likes.forEach(l => likedArgumentIds.add(l.argument_id));
        }
    }

    const argsWithLike = (argsData || []).map(arg => ({
        ...arg,
        profiles: arg.profiles as Profile,
        is_liked: likedArgumentIds.has(arg.id),
        comment_count: (arg as any).comments?.[0]?.count || 0
    }));

    const pro = argsWithLike.filter((arg) => arg.side === "pro");
    const con = argsWithLike.filter((arg) => arg.side === "con");

    return { pro, con };
}

export async function getComments(argumentId: string, currentUserId?: string): Promise<(Comment & { profiles: Profile; is_liked: boolean })[]> {
    console.log("=== getComments called ===");
    console.log("argumentId:", argumentId);
    console.log("currentUserId:", currentUserId);

    // Use Admin Client to bypass RLS for reading comments
    const adminClient = createAdminClient();
    const { data, error } = await adminClient
        .from("comments")
        .select("*, profiles(*)")
        .eq("argument_id", argumentId)
        .order("created_at", { ascending: true });

    console.log("getComments raw data:", data);
    console.log("getComments error:", error);

    let likedCommentIds = new Set<string>();
    if (currentUserId) {
        const { data: likes } = await adminClient
            .from("comment_likes")
            .select("comment_id")
            .eq("user_id", currentUserId);

        if (likes) {
            likes.forEach(l => likedCommentIds.add(l.comment_id));
        }
    }

    return (data || []).map(comment => ({
        ...comment,
        profiles: comment.profiles as Profile,
        is_liked: likedCommentIds.has(comment.id)
    })) as (Comment & { profiles: Profile; is_liked: boolean })[];
}

export async function getDebatesList(): Promise<(Debate & { argument_count: number })[]> {
    const supabase = await createServerClient();
    const { data, error } = await supabase
        .from("debates")
        .select("*, arguments(id, comments(count))")
        .eq("status", "active")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Debates list fetch error:", error);
        return [];
    }

    return data.map((d: any) => {
        const argCount = d.arguments?.length || 0;
        const commentCount = d.arguments?.reduce((sum: number, arg: any) => {
            return sum + (arg.comments?.[0]?.count || 0);
        }, 0) || 0;

        return {
            ...d,
            argument_count: argCount + commentCount,
        };
    });
}

export async function getDebateById(id: string): Promise<Debate | null> {
    const supabase = await createServerClient();
    const { data, error } = await supabase
        .from("debates")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        console.error("Debate fetch error:", error);
        return null;
    }

    return data as Debate;
}

export async function getRanking(): Promise<Profile[]> {
    const supabase = await createServerClient();
    const { data } = await supabase
        .from("profiles")
        .select("*")
        .order("total_score", { ascending: false })
        .limit(100);

    return (data || []) as Profile[];
}

export async function getNotices(): Promise<(Notice & { note_comment_count: number })[]> {
    const supabase = await createServerClient();
    const { data } = await supabase
        .from("notices")
        .select("*, notice_comments(count)")
        .order("created_at", { ascending: false });

    return (data || []).map((n: any) => ({
        ...n,
        note_comment_count: n.notice_comments?.[0]?.count || 0
    }));
}

// --- Notice Comment & Like Actions ---

interface NoticeCommentResult {
    success: boolean;
    error?: string;
    comment?: NoticeComment;
}

export async function getNoticeComments(noticeId: string, currentUserId?: string): Promise<(NoticeComment & { profiles: Profile; is_liked: boolean })[]> {
    console.log("=== getNoticeComments called ===");

    // Use Admin Client to bypass RLS
    const adminClient = createAdminClient();
    const { data, error } = await adminClient
        .from("notice_comments")
        .select("*, profiles(*)")
        .eq("notice_id", noticeId)
        .order("created_at", { ascending: true });

    if (error) {
        console.error("getNoticeComments error:", error);
        return [];
    }

    let likedCommentIds = new Set<string>();
    if (currentUserId) {
        const { data: likes } = await adminClient
            .from("notice_comment_likes")
            .select("comment_id")
            .eq("user_id", currentUserId);

        if (likes) {
            likes.forEach(l => likedCommentIds.add(l.comment_id));
        }
    }

    return (data || []).map(comment => ({
        ...comment,
        profiles: comment.profiles as Profile,
        is_liked: likedCommentIds.has(comment.id)
    })) as (NoticeComment & { profiles: Profile; is_liked: boolean })[];
}

// Refactored postNoticeComment: Removes userId arg, uses serverClient
export async function postNoticeComment(noticeId: string, content: string, imageUrls: string[] = []): Promise<NoticeCommentResult> {
    try {
        const supabase = await createServerClient();

        // 1. Get User
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return { success: false, error: "로그인 세션이 유효하지 않습니다." };
        }

        if (!content.trim()) return { success: false, error: "내용이 없습니다." };

        // 2. Insert using serverClient (RLS)
        const { data, error } = await supabase.from("notice_comments").insert({
            notice_id: noticeId,
            user_id: user.id, // From session
            content: content.trim(),
            image_urls: imageUrls
        }).select().single();

        if (error) throw error;

        revalidatePath("/notice");
        return { success: true, comment: data as NoticeComment };
    } catch (error: any) {
        console.error("Post Notice Comment Error:", error);
        return { success: false, error: error.message };
    }
}

// Refactored toggleNoticeLike: Uses RPC for atomic updates
export async function toggleNoticeLike(noticeId: string): Promise<boolean> {
    const supabase = await createServerClient();

    // Get user securely
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    const userId = user.id;

    // Use admin client ONLY for the like check/insert to avoid complex RLS on likes table if needed,
    // BUT we should iterate to use serverClient with proper RLS for likes too.
    // For now, consistent with goal: Use simple logic but secure the user ID.
    // Actually, let's stick to admin client for the like relationship managing to be safe on permission errors,
    // BUT use RPC for the count update to ensure atomicity.
    const adminClient = createAdminClient();

    // Check if already liked
    const { data: existing } = await adminClient
        .from("notice_likes")
        .select("*")
        .eq("notice_id", noticeId)
        .eq("user_id", userId)
        .single();

    if (existing) {
        // Unlike
        await adminClient.from("notice_likes").delete().eq("notice_id", noticeId).eq("user_id", userId);
        // Use RPC for atomic decrement
        await adminClient.rpc('decrement_notice_like_count', { row_id: noticeId });

        revalidatePath("/notice");
        return false;
    } else {
        // Like
        await adminClient.from("notice_likes").insert({ notice_id: noticeId, user_id: userId });
        // Use RPC for atomic increment
        await adminClient.rpc('increment_notice_like_count', { row_id: noticeId });

        revalidatePath("/notice");
        return true;
    }
}

// --- Generic Permission Helper ---
async function verifyUserOrAdmin(targetUserId: string): Promise<{ authorized: boolean; error?: string }> {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { authorized: false, error: "로그인이 필요합니다." };

    // Owner check
    if (user.id === targetUserId) return { authorized: true };

    // Admin check
    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (profile?.role === "admin") return { authorized: true };

    return { authorized: false, error: "권한이 없습니다." };
}

// --- Argument Actions ---

export async function deleteArgument(argumentId: string) {
    const adminClient = createAdminClient();
    const { data: item } = await adminClient.from("arguments").select("user_id").eq("id", argumentId).single();
    if (!item) return { success: false, error: "삭제할 항목을 찾을 수 없습니다." };

    const { authorized, error } = await verifyUserOrAdmin(item.user_id);
    if (!authorized) return { success: false, error };

    const { error: delError } = await adminClient.from("arguments").delete().eq("id", argumentId);
    if (delError) return { success: false, error: delError.message };

    revalidatePath("/");
    revalidatePath(`/debate/[id]`);
    return { success: true };
}

export async function updateArgument(argumentId: string, content: string) {
    const adminClient = createAdminClient();
    const { data: item } = await adminClient.from("arguments").select("user_id").eq("id", argumentId).single();
    if (!item) return { success: false, error: "수정할 항목을 찾을 수 없습니다." };

    const { authorized, error } = await verifyUserOrAdmin(item.user_id);
    if (!authorized) return { success: false, error };

    const { error: updateError } = await adminClient
        .from("arguments")
        .update({ content: content.trim() })
        .eq("id", argumentId);

    if (updateError) return { success: false, error: updateError.message };

    revalidatePath("/");
    revalidatePath(`/debate/[id]`);
    return { success: true };
}

// --- Comment Actions ---

export async function deleteComment(commentId: string) {
    const adminClient = createAdminClient();
    const { data: item } = await adminClient.from("comments").select("user_id, argument_id").eq("id", commentId).single();
    if (!item) return { success: false, error: "삭제할 항목을 찾을 수 없습니다." };

    const { authorized, error } = await verifyUserOrAdmin(item.user_id);
    if (!authorized) return { success: false, error };

    const { error: delError } = await adminClient.from("comments").delete().eq("id", commentId);
    if (delError) return { success: false, error: delError.message };

    // Revalidate related paths if possible, though comments are often client-fetched
    // Optimized revalidation is tricky for comments, client usually handles UI
    return { success: true };
}

export async function updateComment(commentId: string, content: string) {
    const adminClient = createAdminClient();
    const { data: item } = await adminClient.from("comments").select("user_id").eq("id", commentId).single();
    if (!item) return { success: false, error: "수정할 항목을 찾을 수 없습니다." };

    const { authorized, error } = await verifyUserOrAdmin(item.user_id);
    if (!authorized) return { success: false, error };

    const { error: updateError } = await adminClient
        .from("comments")
        .update({ content: content.trim() })
        .eq("id", commentId);

    if (updateError) return { success: false, error: updateError.message };

    return { success: true };
}

// --- Notice Comment Actions ---

export async function deleteNoticeComment(commentId: string) {
    const adminClient = createAdminClient();
    const { data: item } = await adminClient.from("notice_comments").select("user_id").eq("id", commentId).single();
    if (!item) return { success: false, error: "삭제할 항목을 찾을 수 없습니다." };

    const { authorized, error } = await verifyUserOrAdmin(item.user_id);
    if (!authorized) return { success: false, error };

    const { error: delError } = await adminClient.from("notice_comments").delete().eq("id", commentId);
    if (delError) return { success: false, error: delError.message };

    revalidatePath("/notice");
    return { success: true };
}

export async function updateNoticeComment(commentId: string, content: string) {
    const adminClient = createAdminClient();
    const { data: item } = await adminClient.from("notice_comments").select("user_id").eq("id", commentId).single();
    if (!item) return { success: false, error: "수정할 항목을 찾을 수 없습니다." };

    const { authorized, error } = await verifyUserOrAdmin(item.user_id);
    if (!authorized) return { success: false, error };

    const { error: updateError } = await adminClient
        .from("notice_comments")
        .update({ content: content.trim() })
        .eq("id", commentId);

    if (updateError) return { success: false, error: updateError.message };

    revalidatePath("/notice");
    return { success: true };
}

// --- Notice Actions (Admin Only) ---

export async function deleteNotice(noticeId: string) {
    // Reuse verifyUserOrAdmin but only allow admin logic? Or simple checkAdmin
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Unauthorized" };

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (profile?.role !== 'admin') return { success: false, error: "Unauthorized" };

    const adminClient = createAdminClient();
    const { error } = await adminClient.from("notices").delete().eq("id", noticeId);

    if (error) return { success: false, error: error.message };

    revalidatePath("/notice");
    return { success: true };
}
