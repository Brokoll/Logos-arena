import { AuthForm } from "@/components/auth";
import Link from "next/link";

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <Link href="/" className="hover:opacity-70 transition-opacity inline-block">
                        <h1 className="text-4xl font-[900] tracking-tighter">⚔️ LOGOS ARENA</h1>
                    </Link>
                    <p className="mt-2 opacity-50 text-sm uppercase tracking-widest">Logic is the only weapon</p>
                </div>
                <AuthForm />
                <p className="text-center text-xs opacity-30">
                    이메일로 Magic Link가 전송됩니다. 비밀번호 필요 없음!
                </p>
            </div>
        </div>
    );
}
