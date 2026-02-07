"use server";

import { argumentSchema } from "@/lib/schemas";

import { createServerClient } from "@/lib/supabase";
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
    argument?: Argument;
}

// --- Helpers ---

function validateImageUrls(urls: string[] | undefined): string | null {
    if (!urls || urls.length === 0) return null;
    if (urls.length > 10) return "이미지는 최대 10장까지만 첨부할 수 있습니다.";

    for (const url of urls) {
        if (typeof url !== 'string') return "잘못된 이미지 형입니다.";
        if (url.length > 2000) return "이미지 URL이 너무 깁니다.";
        // Basic XSS protection: specific protocols only
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            return "이미지는 http 또는 https로 시작해야 합니다.";
        }
        try {
            new URL(url);
        } catch {
            return "유효하지 않은 이미지 URL입니다.";
        }
    }
    return null;
}

async function checkCooldown(table: string, userId: string, cooldownMinutes: number = 1) {
    const supabase = await createServerClient();
    const { data } = await supabase
        .from(table)
        .select("created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

    if (data) {
        const lastTime = new Date(data.created_at).getTime();
        const now = new Date().getTime();
        const diff = now - lastTime;
        const cooldownMs = cooldownMinutes * 60 * 1000;

        if (diff < cooldownMs) {
            return Math.ceil((cooldownMs - diff) / 1000);
        }
    }
    return 0;
}

// --- Actions ---
export async function postComment(argumentId: string, content: string, imageUrls: string[] = []): Promise<CommentResult> {
    try {
        const supabase = await createServerClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { success: false, error: "로그인이 필요합니다." };

        const remaining = await checkCooldown("comments", user.id, 0.5); // 30 sec cooldown
        if (remaining > 0) return { success: false, error: `⏳ 댓글 작성 쿨타임 중입니다. (${remaining}초 남음)` };


        // 2. Validate Content
        if (!content || content.trim().length === 0) {
            return { success: false, error: "댓글 내용을 입력해주세요." };
        }
        if (content.trim().length > 500) {
            return { success: false, error: "댓글 내용은 500자를 초과할 수 없습니다." };
        }

        // 2.1 Validate Images
        const imageError = validateImageUrls(imageUrls);
        if (imageError) return { success: false, error: imageError };

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

        // 3. Check Cooldown
        const remaining = await checkCooldown("arguments", userId, 1);
        if (remaining > 0) {
            return {
                success: false,
                error: `⏳ 논리 재충전 중입니다. ${remaining}초 후에 다시 시도해주세요.`,
            };
        }

        // 4. (Removed) AI Analysis - Logic score and toxicity check disabled

        // 4.1 Validate Images
        if (formData.image_urls) {
            const imageError = validateImageUrls(formData.image_urls);
            if (imageError) {
                return { success: false, error: imageError };
            }
        }

        // 5. (Removed) Toxicity check disabled

        // 6. Save to Supabase (use server client, RLS enabled)
        const insertData: NewArgument = {
            debate_id: formData.debate_id,
            user_id: userId,
            side: formData.side,
            content: formData.content,
            image_urls: formData.image_urls || [],
        };

        const { data: newArgument, error: dbError } = await supabase
            .from("arguments")
            .insert(insertData)
            .select()
            .single();

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
            argument: newArgument as Argument
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
    const supabase = await createServerClient();
    const { data, error } = await supabase
        .from("comments")
        .select("*, profiles(*)")
        .eq("argument_id", argumentId)
        .order("created_at", { ascending: true });


    let likedCommentIds = new Set<string>();
    if (currentUserId) {
        const { data: likes } = await supabase
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
        .select("id, username, total_score, argument_count")
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
    const supabase = await createServerClient();
    const { data, error } = await supabase
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
        const { data: likes } = await supabase
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

        const remaining = await checkCooldown("notice_comments", user.id, 0.5); // 30 sec
        if (remaining > 0) return { success: false, error: `⏳ 공지 댓글 작성 쿨타임 중입니다. (${remaining}초 남음)` };

        if (!content || !content.trim()) return { success: false, error: "내용이 없습니다." };
        if (content.trim().length > 500) return { success: false, error: "댓글은 500자를 초과할 수 없습니다." };

        const imageError = validateImageUrls(imageUrls);
        if (imageError) return { success: false, error: imageError };

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

    // Spam protection for likes
    const remaining = await checkCooldown("notice_likes", userId, 0.1); // 6 sec
    if (remaining > 0) return false;

    // Check if already liked using serverClient
    const { data: existing } = await supabase
        .from("notice_likes")
        .select("*")
        .eq("notice_id", noticeId)
        .eq("user_id", userId)
        .single();

    if (existing) {
        // Unlike using serverClient
        await supabase.from("notice_likes").delete().eq("notice_id", noticeId).eq("user_id", userId);
        // Use RPC for atomic decrement (Still via serverClient)
        await supabase.rpc('decrement_notice_like_count', { row_id: noticeId });

        revalidatePath("/notice");
        return false;
    } else {
        // Like using serverClient
        await supabase.from("notice_likes").insert({ notice_id: noticeId, user_id: userId });
        // Use RPC for atomic increment
        await supabase.rpc('increment_notice_like_count', { row_id: noticeId });

        revalidatePath("/notice");
        return true;
    }
}


// --- Argument Actions ---

export async function deleteArgument(argumentId: string) {
    const supabase = await createServerClient();

    // Authorization check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "로그인이 필요합니다." };

    // Delete using serverClient (RLS will check if owner or admin)
    const { error: delError } = await supabase.from("arguments").delete().eq("id", argumentId);
    if (delError) return { success: false, error: delError.message };

    revalidatePath("/");
    revalidatePath(`/debate/[id]`);
    return { success: true };
}

export async function updateArgument(argumentId: string, content: string) {
    const supabase = await createServerClient();

    // Authorization check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "로그인이 필요합니다." };

    if (!content || content.trim().length < 50) return { success: false, error: "주장은 최소 50자 이상이어야 합니다." };
    if (content.trim().length > 3000) return { success: false, error: "주장은 3000자를 초과할 수 없습니다." };

    // Update using serverClient (RLS will check permission)
    const { error: updateError } = await supabase
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
    const supabase = await createServerClient();

    // Authorization check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "로그인이 필요합니다." };

    // Delete using serverClient (RLS will check permission)
    const { error: delError } = await supabase.from("comments").delete().eq("id", commentId);
    if (delError) return { success: false, error: delError.message };

    return { success: true };
}

export async function updateComment(commentId: string, content: string) {
    const supabase = await createServerClient();

    // Authorization check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "로그인이 필요합니다." };

    if (!content || !content.trim()) return { success: false, error: "내용이 없습니다." };
    if (content.trim().length > 500) return { success: false, error: "댓글은 500자를 초과할 수 없습니다." };

    // Update using serverClient (RLS will check permission)
    const { error: updateError } = await supabase
        .from("comments")
        .update({ content: content.trim() })
        .eq("id", commentId);

    if (updateError) return { success: false, error: updateError.message };

    return { success: true };
}

// --- Notice Comment Actions ---

export async function deleteNoticeComment(commentId: string) {
    const supabase = await createServerClient();

    // Authorization check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "로그인이 필요합니다." };

    // Delete using serverClient (RLS will check permission)
    const { error: delError } = await supabase.from("notice_comments").delete().eq("id", commentId);
    if (delError) return { success: false, error: delError.message };

    revalidatePath("/notice");
    return { success: true };
}

export async function updateNoticeComment(commentId: string, content: string) {
    const supabase = await createServerClient();

    // Authorization check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "로그인이 필요합니다." };

    if (!content || !content.trim()) return { success: false, error: "내용이 없습니다." };
    if (content.trim().length > 500) return { success: false, error: "댓글은 500자를 초과할 수 없습니다." };

    // Update using serverClient (RLS will check permission)
    const { error: updateError } = await supabase
        .from("notice_comments")
        .update({ content: content.trim() })
        .eq("id", commentId);

    if (updateError) return { success: false, error: updateError.message };

    revalidatePath("/notice");
    return { success: true };
}

// --- Notice Actions (Admin Only) ---

export async function deleteNotice(noticeId: string) {
    const supabase = await createServerClient();

    // Authorization check (Admin only)
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Unauthorized" };

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (profile?.role !== 'admin') return { success: false, error: "Unauthorized" };

    // Delete using serverClient (RLS will allow this if the user is truly an admin)
    const { error } = await supabase.from("notices").delete().eq("id", noticeId);

    if (error) return { success: false, error: error.message };

    revalidatePath("/notice");
    return { success: true };
}

// --- User Profile Actions ---

export async function updateUsername(newUsername: string) {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "로그인이 필요합니다." };

    if (!newUsername || newUsername.trim().length < 2) {
        return { success: false, error: "닉네임은 최소 2글자 이상이어야 합니다." };
    }
    if (newUsername.trim().length > 15) {
        return { success: false, error: "닉네임은 최대 15글자까지 가능합니다." };
    }

    // Check availability
    const { data: existing } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", newUsername.trim())
        .single();

    if (existing && existing.id !== user.id) {
        return { success: false, error: "이미 사용 중인 닉네임입니다." };
    }

    const { error } = await supabase
        .from("profiles")
        .update({ username: newUsername.trim() })
        .eq("id", user.id);

    if (error) return { success: false, error: error.message };

    revalidatePath("/");
    return { success: true };
}

// --- Report Actions ---

import { sendEmail } from "@/lib/email";

export async function submitReport(targetType: 'argument' | 'comment' | 'notice_comment', targetId: string, reason: string) {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "로그인이 필요합니다." };
    if (!reason || reason.trim().length === 0) return { success: false, error: "신고 사유를 입력해주세요." };

    // 1. Save to DB
    const { error: dbError } = await supabase.from("reports").insert({
        reporter_id: user.id,
        target_type: targetType,
        target_id: targetId,
        reason: reason.trim()
    });

    if (dbError) return { success: false, error: "신고 접수 중 오류가 발생했습니다: " + dbError.message };

    // 2. Send Email
    // Fetch reporter username for context
    const { data: profile } = await supabase.from("profiles").select("username").eq("id", user.id).single();
    const reporterName = profile?.username || "Unknown";

    const adminEmail = "youmga778@naver.com";
    const subject = `[Logos Arena 신고] ${targetType} 신고 접수 (${reporterName})`;
    const htmlBody = `
        <h2>🚨 새로운 신고가 접수되었습니다.</h2>
        <p><strong>신고자:</strong> ${reporterName} (${user.email})</p>
        <p><strong>대상 유형:</strong> ${targetType}</p>
        <p><strong>대상 ID:</strong> ${targetId}</p>
        <p><strong>신고 사유:</strong><br/>${reason.trim()}</p>
        <hr/>
        <p>Logos Arena Admin System</p>
    `;

    // Only attempt email if SMTP is configured, otherwise just log
    if (process.env.SMTP_USER) {
        await sendEmail({
            to: adminEmail,
            subject: subject,
            html: htmlBody
        });
    } else {
        console.warn("SMTP_USER not set. Skipping email notification for report.");
    }

    return { success: true };
}
