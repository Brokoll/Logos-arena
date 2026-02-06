import { createServerClient } from "@/lib/supabase";
import { redirect } from "next/navigation";
import { DebateForm } from "@/components/admin/DebateForm";
import Link from "next/link";

export default async function AdminPage() {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/");
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (profile?.role !== "admin") {
        redirect("/");
    }

    return (
        <div className="min-h-screen bg-background text-foreground p-8 md:p-24">
            <div className="max-w-4xl mx-auto space-y-12">
                {/* Header */}
                <div className="border-b-[4px] border-foreground pb-8">
                    <Link href="/" className="text-sm font-black hover:opacity-70 transition-opacity uppercase tracking-widest block mb-8">
                        ← Back to Arena
                    </Link>
                    <h1 className="text-5xl md:text-7xl font-[900] tracking-tighter uppercase leading-none">
                        Admin Panel<br />
                        <span className="text-2xl md:text-3xl font-black">관리자 패널</span>
                    </h1>
                    <p className="mt-4 text-sm font-medium uppercase tracking-widest opacity-60">
                        토론 주제 생성 및 관리
                    </p>
                </div>

                {/* Create Debate Section */}
                <section className="space-y-6">
                    <div className="border-l-8 border-foreground pl-4">
                        <h2 className="text-2xl font-black uppercase tracking-tight">
                            새 토론 주제 생성
                        </h2>
                        <p className="text-sm font-medium opacity-60 mt-2">
                            새로운 토론 주제를 추가하여 사용자들이 의견을 나눌 수 있도록 합니다.
                        </p>
                    </div>

                    <div className="border-[3px] border-foreground p-8">
                        <DebateForm />
                    </div>
                </section>

                {/* Info Section */}
                <section className="space-y-4">
                    <div className="border-l-8 border-foreground pl-4">
                        <h2 className="text-2xl font-black uppercase tracking-tight">
                            관리 기능
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Link
                            href="/notice"
                            className="border-[3px] border-foreground p-6 hover:bg-foreground hover:text-background transition-all group"
                        >
                            <h3 className="font-black uppercase tracking-wider mb-2">공지사항 관리</h3>
                            <p className="text-sm font-medium opacity-60 group-hover:opacity-100">
                                공지사항 작성 및 관리
                            </p>
                        </Link>

                        <div className="border-[3px] border-foreground p-6 opacity-40">
                            <h3 className="font-black uppercase tracking-wider mb-2">토론 관리</h3>
                            <p className="text-sm font-medium">
                                기존 토론 수정/삭제 (준비 중)
                            </p>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <div className="pt-12 border-t-[4px] border-foreground text-xs font-black uppercase tracking-widest text-center opacity-30">
                    ADMIN ACCESS ONLY
                </div>
            </div>
        </div>
    );
}
