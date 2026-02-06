"use server";

import { createServerClient } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

// Schema for creating a notice
const noticeSchema = z.object({
    title: z.string().min(1, "제목을 입력세요."),
    content: z.string().min(1, "내용을 입력하세요."),
});

async function checkAdmin() {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return false;

    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    return profile?.role === "admin";
}

export async function createNotice(prevState: any, formData: FormData) {
    const isAdmin = await checkAdmin();
    if (!isAdmin) {
        return { error: "권한이 없습니다." };
    }

    const rawData = {
        title: formData.get("title"),
        content: formData.get("content"),
    };

    const validation = noticeSchema.safeParse(rawData);
    if (!validation.success) {
        return { error: validation.error.issues[0].message };
    }

    const supabase = await createServerClient();
    const { error } = await supabase.from("notices").insert(validation.data);

    if (error) {
        console.error("Notice create error:", error);
        return { error: "공지사항 작성 실패" };
    }

    revalidatePath("/notice");
    redirect("/notice");
}

export async function deleteArgument(argumentId: string) {
    const isAdmin = await checkAdmin();
    if (!isAdmin) return { success: false, error: "Unauthorized" };

    const supabase = await createServerClient();
    const { error } = await supabase.from("arguments").delete().eq("id", argumentId);

    if (error) {
        console.error("Delete argument error:", error);
        return { success: false, error: "Deletion failed" };
    }

    revalidatePath("/"); // Revalidate home/feed
    revalidatePath(`/debate/[id]`); // Ideally strictly dependent path, but "/" covers feed
    return { success: true };
}

export async function deleteComment(commentId: string) {
    const isAdmin = await checkAdmin();
    if (!isAdmin) return { success: false, error: "Unauthorized" };

    const supabase = await createServerClient();
    const { error } = await supabase.from("comments").delete().eq("id", commentId);

    if (error) {
        console.error("Delete comment error:", error);
        return { success: false, error: "Deletion failed" };
    }

    revalidatePath(`/debate/[id]`); // Best guess revalidation
    return { success: true };
}
