"use client";

import type { Argument, Profile } from "@/lib/database.types";
import { ArgumentItem } from "./ArgumentItem";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";

interface ArenaFeedProps {
    proArguments: (Argument & { profiles: Profile | null; is_liked: boolean; comment_count: number })[];
    conArguments: (Argument & { profiles: Profile | null; is_liked: boolean; comment_count: number })[];
    userProfile: Profile | null;
    optionA: string;
    optionB: string;
}

export function ArenaFeed({ proArguments, conArguments, userProfile, optionA, optionB }: ArenaFeedProps) {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const getUser = async () => {
            const supabase = createClient();
            const { data } = await supabase.auth.getUser();
            setUser(data.user);
        };
        getUser();
    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            {/* Option A Side */}
            <div className="space-y-8">
                <div className="flex justify-between items-end border-b-[3px] border-foreground pb-4">
                    <h3 className="text-2xl md:text-3xl font-[900] tracking-tighter uppercase italic flex items-center gap-2">
                        <span className="text-3xl md:text-4xl">✅</span> {optionA}
                    </h3>
                    <span className="font-black text-sm uppercase px-3 py-1 border-2 border-foreground">
                        {proArguments.length} ARGUMENTS
                    </span>
                </div>
                <div className="space-y-6">
                    {proArguments.length === 0 ? (
                        <div className="py-20 border-[3px] border-dashed border-foreground/10 flex items-center justify-center">
                            <p className="font-black uppercase tracking-widest opacity-20">아직 의견이 없습니다</p>
                        </div>
                    ) : (
                        proArguments.map((arg) => (
                            <ArgumentItem key={arg.id} argument={arg} currentUser={user} userProfile={userProfile} />
                        ))
                    )}
                </div>
            </div>

            {/* Option B Side */}
            <div className="space-y-8">
                <div className="flex justify-between items-end border-b-[3px] border-foreground pb-4">
                    <h3 className="text-2xl md:text-3xl font-[900] tracking-tighter uppercase italic flex items-center gap-2">
                        <span className="text-3xl md:text-4xl">❌</span> {optionB}
                    </h3>
                    <span className="font-black text-sm uppercase px-3 py-1 border-2 border-foreground">
                        {conArguments.length} ARGUMENTS
                    </span>
                </div>
                <div className="space-y-6">
                    {conArguments.length === 0 ? (
                        <div className="py-20 border-[3px] border-dashed border-foreground/10 flex items-center justify-center">
                            <p className="font-black uppercase tracking-widest opacity-20">아직 의견이 없습니다</p>
                        </div>
                    ) : (
                        conArguments.map((arg) => (
                            <ArgumentItem key={arg.id} argument={arg} currentUser={user} userProfile={userProfile} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
