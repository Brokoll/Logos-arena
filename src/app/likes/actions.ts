"use server";

import { createServerClient } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function toggleArgumentLike(argumentId: string) {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "Login required" };

    // Check if like exists
    const { data: existingLike } = await supabase
        .from("argument_likes")
        .select("*")
        .eq("user_id", user.id)
        .eq("argument_id", argumentId)
        .single();

    if (existingLike) {
        // Unlike
        await supabase.from("argument_likes").delete().eq("user_id", user.id).eq("argument_id", argumentId);
    } else {
        // Like
        await supabase.from("argument_likes").insert({
            user_id: user.id,
            argument_id: argumentId
        });
    }

    revalidatePath("/");
    return { success: true };
}

export async function toggleCommentLike(commentId: string) {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "Login required" };

    const { data: existingLike } = await supabase
        .from("comment_likes")
        .select("*")
        .eq("user_id", user.id)
        .eq("comment_id", commentId)
        .single();

    if (existingLike) {
        await supabase.from("comment_likes").delete().eq("user_id", user.id).eq("comment_id", commentId);
    } else {
        await supabase.from("comment_likes").insert({
            user_id: user.id,
            comment_id: commentId
        });
    }

    revalidatePath("/"); // Ideally more specific
    return { success: true };
}
