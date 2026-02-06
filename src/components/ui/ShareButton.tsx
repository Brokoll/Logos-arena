"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export function ShareButton() {
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        const url = window.location.href;
        const title = document.title;

        if (navigator.share) {
            try {
                await navigator.share({
                    title,
                    url,
                });
            } catch (err) {
                console.error("Share failed:", err);
            }
        } else {
            try {
                await navigator.clipboard.writeText(url);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (err) {
                console.error("Clipboard failed:", err);
            }
        }
    };

    return (
        <button
            onClick={handleShare}
            className={cn(
                "group relative inline-flex items-center gap-2 px-4 py-2 border-2 border-foreground bg-background text-sm font-bold uppercase tracking-widest hover:bg-foreground hover:text-background transition-all",
                copied ? "bg-foreground text-background" : ""
            )}
        >
            <span>{copied ? "✅ Copied!" : "🔗 Share"}</span>
        </button>
    );
}
