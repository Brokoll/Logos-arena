"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

interface AuthButtonProps {
    user: User | null;
}

export function AuthButton({ user }: AuthButtonProps) {
    const router = useRouter();
    const supabase = createClient();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.refresh();
    };

    if (user) {
        return (
            <div className="flex items-center gap-4">
                <span className="text-xs font-black uppercase tracking-widest opacity-50 hidden md:block">
                    {user.email?.split("@")[0]}
                </span>
                <button
                    onClick={handleSignOut}
                    className="px-4 py-2 text-xs font-black uppercase tracking-widest border-2 border-foreground hover:bg-foreground hover:text-background transition-all"
                >
                    Logout
                </button>
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
