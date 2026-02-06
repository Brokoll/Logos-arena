import Link from "next/link";

export default function BusinessInfoPage() {
    return (
        <div className="min-h-screen bg-background text-foreground p-8 md:p-24 font-sans">
            <div className="max-w-4xl mx-auto space-y-12">
                {/* Header */}
                <div className="border-b-[4px] border-foreground pb-8">
                    <Link href="/" className="text-sm font-black hover:opacity-70 transition-opacity uppercase tracking-widest block mb-8">
                        ← Back to Arena
                    </Link>
                    <h1 className="text-5xl md:text-7xl font-[900] tracking-tighter uppercase leading-none">
                        Business Information<br />
                        <span className="text-2xl md:text-3xl font-black">사업자 정보</span>
                    </h1>
                </div>

                {/* Content Section */}
                <div className="space-y-12 leading-relaxed">
                    <section className="space-y-6">
                        <h2 className="text-2xl font-black uppercase tracking-tight border-l-8 border-foreground pl-4">
                            서비스 정보
                        </h2>
                        <div className="border-[3px] border-foreground p-8 space-y-4 font-medium">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="font-black uppercase text-sm tracking-wider">서비스명</div>
                                <div className="md:col-span-2">로고스 아레나 (Logos Arena)</div>
                            </div>
                            <div className="border-t-2 border-foreground my-4"></div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="font-black uppercase text-sm tracking-wider">운영자</div>
                                <div className="md:col-span-2">Rogos</div>
                            </div>
                            <div className="border-t-2 border-foreground my-4"></div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="font-black uppercase text-sm tracking-wider">서비스 URL</div>
                                <div className="md:col-span-2">
                                    <a href="https://logosarena.com" className="underline hover:opacity-70 transition-opacity">
                                        https://logosarena.com
                                    </a>
                                </div>
                            </div>
                            <div className="border-t-2 border-foreground my-4"></div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="font-black uppercase text-sm tracking-wider">연락처</div>
                                <div className="md:col-span-2">문의는 서비스 내 문의 기능을 이용해 주시기 바랍니다.</div>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-2xl font-black uppercase tracking-tight border-l-8 border-foreground pl-4">
                            기술 인프라
                        </h2>
                        <div className="border-[3px] border-foreground p-8 space-y-4 font-medium">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="font-black uppercase text-sm tracking-wider">호스팅</div>
                                <div className="md:col-span-2">Vercel Inc.</div>
                            </div>
                            <div className="border-t-2 border-foreground my-4"></div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="font-black uppercase text-sm tracking-wider">데이터베이스</div>
                                <div className="md:col-span-2">Supabase</div>
                            </div>
                            <div className="border-t-2 border-foreground my-4"></div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="font-black uppercase text-sm tracking-wider">인증</div>
                                <div className="md:col-span-2">Google OAuth 2.0</div>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-2xl font-black uppercase tracking-tight border-l-8 border-foreground pl-4">
                            서비스 특징
                        </h2>
                        <div className="p-6 bg-foreground text-background font-medium space-y-3">
                            <p>✓ 건전한 토론 문화를 위한 구글 로그인 전용 플랫폼</p>
                            <p>✓ 찬성/반대 의견을 자유롭게 나누는 공간</p>
                            <p>✓ 활동 점수 및 랭킹 시스템을 통한 참여 독려</p>
                            <p>✓ 현재 모든 서비스 무료 제공</p>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-2xl font-black uppercase tracking-tight border-l-8 border-foreground pl-4">
                            법적 고지
                        </h2>
                        <div className="font-medium space-y-3">
                            <p>본 서비스는 「전자상거래법」, 「정보통신망법」, 「개인정보 보호법」 등 관련 법령을 준수하여 운영됩니다.</p>
                            <p className="pt-4">관련 정책:</p>
                            <div className="pl-6 space-y-2">
                                <p>→ <Link href="/privacy" className="underline hover:opacity-70 transition-opacity">개인정보처리방침</Link></p>
                                <p>→ <Link href="/terms" className="underline hover:opacity-70 transition-opacity">이용약관</Link></p>
                                <p>→ <Link href="/youth-protection" className="underline hover:opacity-70 transition-opacity">청소년 보호정책</Link></p>
                                <p>→ <Link href="/copyright" className="underline hover:opacity-70 transition-opacity">저작권 안내</Link></p>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Footer */}
                <div className="pt-12 border-t-[4px] border-foreground text-xs font-black uppercase tracking-widest text-center">
                    &copy; 2026 LOGOS ARENA. ALL RIGHTS RESERVED.
                </div>
            </div>
        </div>
    );
}
