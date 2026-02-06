import Link from "next/link";

export default function AuthCodeErrorPage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <div className="text-center space-y-6">
                <h1 className="text-4xl font-[900]">⚠️ 인증 오류</h1>
                <p className="opacity-50">Magic Link가 만료되었거나 잘못되었습니다.</p>
                <Link
                    href="/login"
                    className="inline-block px-6 py-3 border-[3px] border-foreground font-black uppercase hover:bg-foreground hover:text-background transition-all"
                >
                    다시 시도하기
                </Link>
            </div>
        </div>
    );
}
