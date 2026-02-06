"use client";

import { useState } from "react";
import { ArgumentForm, ArenaFeed } from "@/components/arena";
import { submitArgument } from "./actions";
import type { Argument, Profile } from "@/lib/database.types";
import type { User } from "@supabase/supabase-js";
import Link from "next/link";

interface ArenaClientProps {
    debateId: string;
    initialProArguments: (Argument & { profiles: Profile | null; is_liked: boolean })[];
    initialConArguments: (Argument & { profiles: Profile | null; is_liked: boolean })[];
    user: User | null;
    userProfile: Profile | null;
}

export function ArenaClient({
    debateId,
    initialProArguments,
    initialConArguments,
    user,
    userProfile,
}: ArenaClientProps) {
    const [proArguments, setProArguments] = useState(initialProArguments);
    const [conArguments, setConArguments] = useState(initialConArguments);

    const handleSubmit = async (data: {
        debate_id: string;
        side: "pro" | "con";
        content: string;
        image_urls?: string[];
    }) => {
        if (!user) {
            return { success: false, error: "로그인이 필요합니다." };
        }

        const result = await submitArgument({
            ...data,
            user_id: user.id,
        });

        if (result.success) {
            const newArg: Argument & { profiles: Profile | null; is_liked: boolean } = {
                id: crypto.randomUUID(),
                debate_id: data.debate_id,
                user_id: user.id,
                side: data.side,
                content: data.content,
                score: null, // Initial score
                like_count: 0,
                feedback: result.feedback ?? null,
                created_at: new Date().toISOString(),
                profiles: null,
                is_liked: false,
                image_urls: data.image_urls || []
            };

            if (data.side === "pro") {
                setProArguments([newArg, ...proArguments]);
            } else {
                setConArguments([newArg, ...conArguments]);
            }
        }

        return result;
    };

    return (
        <div className="space-y-16">
            {/* Argument Form or Login Prompt */}
            <section>
                {/* Argument Form (Handles guest check internally) */}
                <section>
                    <ArgumentForm debateId={debateId} currentUser={user} onSubmit={handleSubmit} />
                </section>
            </section>

            {/* Debate Feed */}
            <section>
                <div className="text-center mb-8">
                    <h3 className="text-3xl font-[900] tracking-tighter uppercase italic">📊 Current Debate</h3>
                    <p className="mt-2 text-sm opacity-40 uppercase tracking-widest">
                        {proArguments.length + conArguments.length} arguments submitted
                    </p>
                </div>
                <ArenaFeed proArguments={proArguments} conArguments={conArguments} userProfile={userProfile} />
            </section>
        </div>
    );
}
