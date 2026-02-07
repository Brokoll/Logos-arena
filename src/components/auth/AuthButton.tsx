"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

interface AuthButtonProps {
    user: User | null;
    username?: string | null;
}

export function AuthButton({ user, username }: AuthButtonProps) {
    const router = useRouter();
    const supabase = createClient();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.refresh();
    };

    const [showNicknameModal, setShowNicknameModal] = useState(false);

    if (user) {
        return (
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-widest opacity-50 hidden md:block">
                        {username || user.email?.split("@")[0]}
                    </span>
                    <button
                        onClick={() => setShowNicknameModal(true)}
                        className="text-[10px] opacity-30 hover:opacity-100 transition-opacity"
                        title="Change Nickname"
                    >
                        ⚙️
                    </button>
                </div>
                <button
                    onClick={handleSignOut}
                    className="px-4 py-2 text-xs font-black uppercase tracking-widest border-2 border-foreground hover:bg-foreground hover:text-background transition-all"
                >
                    Logout
                </button>

                <NicknameChangeModal
                    isOpen={showNicknameModal}
                    onClose={() => setShowNicknameModal(false)}
                    currentUsername={username || ""}
                />
            </div>
        );
    }

    return (
        <a
            href="/login"
            className="px-4 py-2 text-xs font-black uppercase tracking-widest border-2 border-foreground hover:bg-foreground hover:text-background transition-all"
        >
            Login
        </a>
    );
}

import { useState } from "react";
import { NicknameChangeModal } from "@/components/ui/NicknameChangeModal";
