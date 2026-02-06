import { getRanking } from "../actions";
import { AuthButton } from "@/components/auth";
import { createServerClient } from "@/lib/supabase";
import Link from "next/link";

export default async function RankingPage() {
    const ranking = await getRanking();
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    let username = undefined;
    if (user) {
        const { data: profile } = await supabase.from("profiles").select("username").eq("id", user.id).single();
        username = profile?.username;
    }

    return (
        <div className="min-h-screen bg-background selection:bg-foreground selection:text-background">
            {/* Header */}
            <header className="border-b-[3px] border-foreground sticky top-0 bg-background/80 backdrop-blur-md z-50">
                <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
                    <Link href="/" className="text-3xl font-[900] tracking-tighter hover:opacity-70 transition-opacity">
                        ⚔️ LOGOS ARENA
                    </Link>
                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex gap-6 text-sm font-bold uppercase tracking-widest">
                            <Link href="/" className="hover:line-through cursor-pointer tracking-tighter opacity-40">Arena</Link>
                            <Link href="/notice" className="hover:line-through cursor-pointer tracking-tighter opacity-40">Notices</Link>
                            <span className="hover:line-through cursor-pointer tracking-tighter">Ranking</span>
                        </div>
                        <AuthButton user={user} username={username} />
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-6 py-16 space-y-12">
                <section className="text-center space-y-4">
                    <h1 className="text-6xl font-[900] tracking-tighter uppercase italic">Hall of Fame</h1>
                    <p className="text-xl opacity-50 font-bold uppercase tracking-widest">Top Logic Warriors</p>
                </section>

                <div className="border-[3px] border-foreground bg-background">
                    <div className="grid grid-cols-12 gap-4 p-6 border-b-[3px] border-foreground font-black uppercase tracking-widest text-sm opacity-50">
                        <div className="col-span-2 text-center md:text-left">Rank</div>
                        <div className="col-span-6 md:col-span-7">User</div>
                        <div className="col-span-4 md:col-span-3 text-right">Score</div>
                    </div>

                    {ranking.length === 0 ? (
                        <div className="p-20 text-center opacity-30 font-bold uppercase tracking-widest">
                            No warriors active yet...
                        </div>
                    ) : (
                        ranking.map((profile, index) => (
                            <div
                                key={profile.id}
                                className={`grid grid-cols-12 gap-4 p-6 border-b border-foreground/10 items-center font-bold transition-all hover:bg-foreground hover:text-background group ${user?.id === profile.id ? "bg-foreground/5" : ""
                                    }`}
                            >
                                <div className="col-span-2 text-2xl font-[900] italic tracking-tighter text-center md:text-left">
                                    #{index + 1}
                                </div>
                                <div className="col-span-6 md:col-span-7 flex flex-col">
                                    <span className="truncate text-lg uppercase tracking-tight">
                                        {profile.username || "Unknown Logic"}
                                    </span>
                                    <span className="text-[10px] opacity-40 group-hover:opacity-80 font-mono">
                                        {profile.argument_count} arguments submitted
                                    </span>
                                </div>
                                <div className="col-span-4 md:col-span-3 text-right">
                                    <span className="text-3xl font-[900] tracking-tighter italic">
                                        {profile.total_score}
                                    </span>
                                    <span className="text-[10px] opacity-50 ml-1">PTS</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
}
