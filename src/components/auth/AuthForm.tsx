"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export function AuthForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false); // Toggle between Login and Sign Up
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);

        const supabase = createClient();
        let error;

        try {
            if (isSignUp) {
                // Sign Up Logic
                const res = await supabase.auth.signUp({
                    email,
                    password,
                });
                error = res.error;

                if (!error && res.data.user) {
                    // Check if session exists (Auto Confirm enabled)
                    if (res.data.session) {
                        setMessage({ type: "success", text: "🎉 가입 완료! 프로필 설정으로 이동합니다..." });
                        window.location.href = "/auth/setup";
                        return;
                    } else {
                        // Email confirm required
                        setMessage({ type: "success", text: "📧 인증 메일을 보냈습니다! 메일함 확인 후 로그인해주세요." });
                        setIsLoading(false); // Stop loading to let user see message
                        return;
                    }
                }
            } else {
                // Sign In Logic
                const res = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                error = res.error;
                if (!error && res.data.user) {
                    window.location.href = "/";
                    return;
                }
            }

            if (error) {
                // Translate common errors
                if (error.message.includes("Invalid login credentials")) {
                    setMessage({ type: "error", text: "이메일 또는 비밀번호가 틀렸습니다." });
                } else if (error.message.includes("User already registered")) {
                    setMessage({ type: "error", text: "이미 가입된 이메일입니다. 로그인해주세요." });
                } else {
                    setMessage({ type: "error", text: error.message });
                }
            }
        } catch (err) {
            setMessage({ type: "error", text: "오류가 발생했습니다." });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6 p-8 border-[3px] border-foreground bg-background">
                <div className="text-center space-y-2">
                    <h2 className="text-2xl font-[900] tracking-tighter uppercase">
                        {isSignUp ? "📝 Join the Arena" : "🔐 Enter the Arena"}
                        🔐 Enter the Arena
                    </h2>
                    <p className="text-sm opacity-50">
                        로그인하여 논쟁에 참여하세요
                    </p>
                </div>

                {/* Social Login Only */}
                <div className="space-y-4">
                    <button
                        type="button"
                        onClick={() => {
                            const supabase = createClient();
                            supabase.auth.signInWithOAuth({
                                provider: "google",
                                options: {
                                    redirectTo: `${window.location.origin}/auth/callback`,
                                    queryParams: {
                                        access_type: 'offline',
                                        prompt: 'consent',
                                    },
                                },
                            });
                        }}
                        className="w-full py-4 flex items-center justify-center gap-3 border-[3px] border-foreground hover:bg-foreground hover:text-background transition-all font-black uppercase text-base tracking-wide"
                    >
                        {/* Google Icon SVG */}
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="currentColor" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="currentColor" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="currentColor" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="currentColor" />
                        </svg>
                        Continue with Google
                    </button>

                    <p className="text-center text-xs opacity-40 font-medium">
                        (건전한 토론 문화를 위해 구글 로그인만 지원합니다)
                    </p>
                </div>

                {message && (
                    <div
                        className={cn(
                            "p-4 text-center font-bold text-sm",
                            message.type === "success"
                                ? "bg-foreground text-background"
                                : "border-2 border-foreground"
                        )}
                    >
                        {message.text}
                    </div>
                )}
            </form>
        </div>
    );
}
