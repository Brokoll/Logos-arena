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
                    </h2>
                    <p className="text-sm opacity-50">
                        {isSignUp ? "새로운 논리 전사가 되어보세요" : "로그인하여 논쟁에 참여하세요"}
                    </p>
                </div>

                <div className="space-y-4">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        required
                        className="w-full p-4 border-[3px] border-foreground bg-transparent text-lg font-medium focus:outline-none focus:ring-4 focus:ring-foreground/10 placeholder:opacity-30"
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                        minLength={6}
                        className="w-full p-4 border-[3px] border-foreground bg-transparent text-lg font-medium focus:outline-none focus:ring-4 focus:ring-foreground/10 placeholder:opacity-30"
                    />

                    <button
                        type="submit"
                        disabled={isLoading || !email || !password}
                        className={cn(
                            "w-full py-4 font-black uppercase tracking-tighter border-[3px] border-foreground transition-all",
                            isLoading || !email || !password
                                ? "opacity-20 cursor-not-allowed"
                                : "hover:bg-foreground hover:text-background"
                        )}
                    >
                        {isLoading ? "⏳ Processing..." : isSignUp ? "Sign Up" : "Log In"}
                    </button>

                    <div className="text-center">
                        <button
                            type="button"
                            onClick={() => {
                                setIsSignUp(!isSignUp);
                                setMessage(null);
                            }}
                            className="text-sm font-bold opacity-50 hover:opacity-100 hover:underline"
                        >
                            {isSignUp ? "이미 계정이 있으신가요? 로그인하기" : "계정이 없으신가요? 가입하기"}
                        </button>
                    </div>
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
