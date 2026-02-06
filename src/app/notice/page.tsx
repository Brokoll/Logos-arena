import { createServerClient } from "@/lib/supabase";
import Link from "next/link";
import { NoticeItem } from "@/components/notice/NoticeItem";
import { getNotices } from "@/app/actions";

export default async function NoticePage() {
    const notices = await getNotices();
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    let userProfile = null;
    let isAdmin = false;
    if (user) {
        const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
        userProfile = profile;
        isAdmin = profile?.role === 'admin';
    }

    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-foreground selection:text-background p-6 md:p-12 max-w-4xl mx-auto space-y-12">
            {/* Header */}
            <header className="flex justify-between items-center border-b-[3px] border-foreground pb-6">
                <Link href="/" className="text-2xl font-[900] tracking-tighter italic uppercase hover:opacity-50 transition-opacity">
                    ← Back to Arena
                </Link>
                <h1 className="text-4xl font-[900] tracking-tighter uppercase italic">
                    📢 Notices
                </h1>
                {isAdmin && (
                    <Link href="/notice/create" className="px-4 py-2 bg-foreground text-background font-black uppercase tracking-widest hover:opacity-80">
                        + Write Notice
                    </Link>
                )}
            </header>

            {/* Notice List */}
            <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
                {notices.length === 0 ? (
                    <div className="py-20 text-center border-[3px] border-dashed border-foreground/20">
                        <p className="font-bold opacity-30 uppercase tracking-widest">No notices yet.</p>
                    </div>
                ) : (
                    notices.map((notice) => (
                        <NoticeItem
                            key={notice.id}
                            notice={notice}
                            currentUser={user}
                            userProfile={userProfile}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
