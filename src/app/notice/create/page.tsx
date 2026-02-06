"use client";

import { useFormState } from "react-dom";
import { createNotice } from "@/app/admin/actions";
import Link from "next/link";

const initialState = {
    error: null as string | null,
};

export default function CreateNoticePage() {
    const [state, formAction] = useFormState(createNotice, initialState);

    return (
        <div className="min-h-screen bg-background p-6 md:p-12 max-w-2xl mx-auto space-y-8">
            <header className="flex justify-between items-center border-b-[3px] border-foreground pb-6">
                <h1 className="text-3xl font-[900] tracking-tighter uppercase italic">
                    📢 Write Notice
                </h1>
                <Link href="/notice" className="font-bold opacity-50 hover:underline">
                    Cancel
                </Link>
            </header>

            <form action={formAction} className="space-y-6 border-[3px] border-foreground p-8 bg-background">
                <div className="space-y-2">
                    <label className="text-sm font-black uppercase tracking-widest">Title</label>
                    <input
                        name="title"
                        type="text"
                        required
                        className="w-full p-3 border-[3px] border-foreground bg-transparent font-bold focus:outline-none"
                        placeholder="공지 제목"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-black uppercase tracking-widest">Content</label>
                    <textarea
                        name="content"
                        required
                        rows={10}
                        className="w-full p-3 border-[3px] border-foreground bg-transparent font-medium focus:outline-none"
                        placeholder="공지 내용"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full py-4 bg-foreground text-background font-black uppercase tracking-widest hover:opacity-90"
                >
                    Post Notice
                </button>

                {state?.error && (
                    <p className="text-red-500 font-bold text-center text-sm">{state.error}</p>
                )}
            </form>
        </div>
    );
}
