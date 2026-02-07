import { createServerClient } from "@/lib/supabase";
import { getDebateById, getDebateArguments } from "@/app/actions";
import { ArenaClient } from "@/app/ArenaClient";
import { AuthButton } from "@/components/auth";
import { ShareButton } from "@/components/ui/ShareButton";
import type { Argument, Profile } from "@/lib/database.types";
import Link from "next/link";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function DebatePage({ params }: PageProps) {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    let userProfile: Profile | null = null;
    if (user) {
        const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
        userProfile = data;
    }

    const resolvedParams = await params;
    const debate = await getDebateById(resolvedParams.id);
    let pro: (Argument & { profiles: Profile | null; is_liked: boolean })[] = [];
    let con: (Argument & { profiles: Profile | null; is_liked: boolean })[] = [];

    if (debate) {
        const args = await getDebateArguments(debate.id, user?.id);
        pro = args.pro;
        con = args.con;
    }

    return (
        <div className="min-h-screen bg-background selection:bg-foreground selection:text-background">
            {/* Header */}
            <header className="border-b-[3px] border-foreground sticky top-0 bg-background/80 backdrop-blur-md z-50">
                <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
                    <Link href="/" className="hover:opacity-60 transition-opacity">
                        <h1 className="text-3xl font-[900] tracking-tighter">
                            ⚔️ LOGOS ARENA
                        </h1>
                    </Link>
                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex gap-6 text-sm font-bold uppercase tracking-widest">
                            <Link href="/" className="hover:line-through cursor-pointer tracking-tighter opacity-40">Arena</Link>
                            <Link href="/notice" className="hover:line-through cursor-pointer tracking-tighter opacity-40">Notices</Link>
                            <Link href="/ranking" className="hover:line-through cursor-pointer tracking-tighter opacity-40">Ranking</Link>
                        </div>
                        <AuthButton user={user} username={userProfile?.username} />
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-16 space-y-24">
                {debate ? (
                    <div className="space-y-20">
                        {/* Topic Hero Section */}
                        <section className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                            <div className="inline-block px-4 py-1 border-2 border-foreground text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                                Current Battle
                            </div>
                            <h2 className="text-5xl md:text-7xl font-[900] leading-[0.9] tracking-tighter text-balance">
                                {debate.topic}
                            </h2>
                            <div className="flex justify-center">
                                <ShareButton />
                            </div>
                            {debate.description && (
                                <p className="max-w-2xl mx-auto text-xl opacity-60 font-medium leading-relaxed">
                                    {debate.description}
                                </p>
                            )}
                        </section>

                        {/* Arena Client (Form + Feed) */}
                        <div className="animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
                            <ArenaClient
                                debateId={debate.id}
                                optionA={debate.option_a || "찬성"}
                                optionB={debate.option_b || "반대"}
                                initialProArguments={pro}
                                initialConArguments={con}
                                user={user}
                                userProfile={userProfile}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-6">
                        <p className="text-2xl font-bold opacity-30">존재하지 않는 토론입니다.</p>
                        <Link href="/" className="px-6 py-3 bg-foreground text-background font-bold hover:opacity-80 transition-opacity">
                            돌아가기
                        </Link>
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="border-t-[3px] border-foreground mt-32 py-12">
                <div className="max-w-7xl mx-auto px-6 space-y-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                        <p className="font-black tracking-tighter">LOGOS ARENA © 2026</p>
                        <p className="text-sm font-bold opacity-40 uppercase tracking-widest italic">Logic is the only weapon.</p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-4 text-xs font-bold uppercase tracking-wider opacity-60">
                        <Link href="/privacy" className="hover:opacity-100 transition-opacity">개인정보처리방침</Link>
                        <span>|</span>
                        <Link href="/terms" className="hover:opacity-100 transition-opacity">이용약관</Link>
                        <span>|</span>
                        <Link href="/business-info" className="hover:opacity-100 transition-opacity">사업자 정보</Link>
                        <span>|</span>
                        <Link href="/youth-protection" className="hover:opacity-100 transition-opacity">청소년 보호정책</Link>
                        <span>|</span>
                        <Link href="/copyright" className="hover:opacity-100 transition-opacity">저작권 안내</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
