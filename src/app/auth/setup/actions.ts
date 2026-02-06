"use server";

import { createServerClient } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const profileSchema = z.object({
    username: z.string().min(2, "닉네임은 2글자 이상이어야 합니다.").max(12, "닉네임은 12글자 이하여야 합니다."),
    gender: z.enum(["male", "female"], { errorMap: () => ({ message: "성별을 선택해주세요." }) }),
    age: z.coerce.number().min(10, "10세 이상만 이용 가능합니다.").max(100),
});

export async function updateProfile(prevState: any, formData: FormData) {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "로그인이 필요합니다." };
    }

    const rawData = {
        username: formData.get("username"),
        gender: formData.get("gender"),
        age: formData.get("age"),
    };

    const validation = profileSchema.safeParse(rawData);

    if (!validation.success) {
        return { error: validation.error.issues[0].message };
    }

    const { error } = await supabase
        .from("profiles")
        .update({
            username: validation.data.username,
            gender: validation.data.gender,
            age: validation.data.age,
        })
        .eq("id", user.id);

    if (error) {
        console.error("Profile update error:", error);
        return { error: `Error: ${error.message} (${error.code})` };
    }

    revalidatePath("/");
    redirect("/");
}
