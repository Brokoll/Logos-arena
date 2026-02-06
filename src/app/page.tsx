import { createServerClient } from "@/lib/supabase";
import { getDebatesList } from "./actions";
import { AuthButton } from "@/components/auth";
import { RotatingText } from "@/components/ui/RotatingText";
import Link from "next/link";

export default async function Home() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  let username = undefined;
  if (user) {
    const { data: profile } = await supabase.from("profiles").select("username").eq("id", user.id).single();
    username = profile?.username;
  }

  const debates = await getDebatesList();

  return (
    <div className="min-h-screen bg-background selection:bg-foreground selection:text-background">
      {/* Header */}
      <header className="border-b-[3px] border-foreground sticky top-0 bg-background/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          <Link href="/" className="hover:opacity-60 transition-opacity">
            <h1 className="text-3xl font-[900] tracking-tighter cursor-pointer">
              ⚔️ LOGOS ARENA
            </h1>
          </Link>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex gap-6 text-sm font-bold uppercase tracking-widest">
              <span className="hover:line-through cursor-pointer tracking-tighter opacity-100">Lobby</span>
              <Link href="/notice" className="hover:line-through cursor-pointer tracking-tighter opacity-40">Notices</Link>
              <Link href="/ranking" className="hover:line-through cursor-pointer tracking-tighter opacity-40">Ranking</Link>
            </div>
            <AuthButton user={user} username={username} />
          </div>
        </div>
      </header>

      {/* Main Content: Dashboard */}
      <main className="max-w-7xl mx-auto px-6 py-16 space-y-16">

        {/* Intro */}
        <section className="text-center space-y-6 py-12">
          <h2 className="text-5xl md:text-8xl font-[900] tracking-tighter uppercase leading-[0.9]">
            Choose Your<br />Arena
          </h2>
          <RotatingText />
        </section>

        {/* Debate Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {debates.map((debate) => (
            <Link
              key={debate.id}
              href={`/debate/${debate.id}`}
              className="group relative block h-full"
            >
              <div className="h-full border-[3px] border-foreground bg-background p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <span className="inline-block px-3 py-1 border-2 border-foreground text-[10px] font-black uppercase tracking-widest bg-foreground text-background">
                      Active
                    </span>
                    <span className="text-xs font-bold opacity-40">
                      {new Date(debate.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-2xl font-[900] tracking-tighter leading-tight group-hover:underline decoration-4 underline-offset-4">
                    {debate.topic}
                  </h3>

                  {debate.description && (
                    <p className="text-sm font-medium opacity-60 line-clamp-3 leading-relaxed">
                      {debate.description}
                    </p>
                  )}
                </div>

                <div className="mt-8 pt-6 border-t-2 border-foreground/10 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">💬</span>
                    <span className="font-black text-lg">{debate.argument_count}</span>
                  </div>
                  <span className="font-bold text-sm uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                    참여하기 →
                  </span>
                </div>
              </div>
            </Link>
          ))}

          {debates.length === 0 && (
            <div className="col-span-full h-64 flex flex-col items-center justify-center text-center opacity-40 border-[3px] border-dashed border-foreground">
              <p className="text-xl font-bold">진행 중인 토론이 없습니다.</p>
            </div>
          )}
        </div>

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
