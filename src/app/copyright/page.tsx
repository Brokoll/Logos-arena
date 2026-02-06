import Link from "next/link";

export default function CopyrightPage() {
    return (
        <div className="min-h-screen bg-background text-foreground p-8 md:p-24 font-sans">
            <div className="max-w-4xl mx-auto space-y-12">
                {/* Header */}
                <div className="border-b-[4px] border-foreground pb-8">
                    <Link href="/" className="text-sm font-black hover:opacity-70 transition-opacity uppercase tracking-widest block mb-8">
                        ← Back to Arena
                    </Link>
                    <h1 className="text-5xl md:text-7xl font-[900] tracking-tighter uppercase leading-none">
                        Copyright Notice<br />
                        <span className="text-2xl md:text-3xl font-black">저작권 안내</span>
                    </h1>
                    <p className="mt-4 text-sm font-medium uppercase tracking-widest">
                        시행일자: 2026-02-07
                    </p>
                </div>

                {/* Content Section */}
                <div className="space-y-12 leading-relaxed">
                    <section className="space-y-6">
                        <h2 className="text-2xl font-black uppercase tracking-tight border-l-8 border-foreground pl-4">
                            제1조 (목적)
                        </h2>
                        <p className="font-medium">
                            본 저작권 안내는 로고스 아레나(이하 &quot;서비스&quot;)에서 생성되는 콘텐츠의 저작권 귀속 및 이용에 관한 사항을 명확히 하기 위함입니다.
                        </p>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-2xl font-black uppercase tracking-tight border-l-8 border-foreground pl-4">
                            제2조 (플랫폼 저작권)
                        </h2>
                        <div className="space-y-4 font-medium">
                            <p><span className="font-black">①</span> 서비스의 디자인, 로고, UI/UX, 소스코드 등 플랫폼 자체에 대한 저작권은 Rogos에게 있습니다.</p>
                            <p><span className="font-black">②</span> 서비스의 상표, 서비스 마크, 로고 등은 Rogos의 지적재산권으로 보호받습니다.</p>
                            <p><span className="font-black">③</span> 이용자는 서비스의 저작물을 무단으로 복제, 배포, 전송, 전시, 공연, 방송할 수 없습니다.</p>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-2xl font-black uppercase tracking-tight border-l-8 border-foreground pl-4">
                            제3조 (이용자 콘텐츠의 저작권)
                        </h2>
                        <div className="space-y-4 font-medium">
                            <p><span className="font-black">①</span> 이용자가 서비스에 게시한 토론 주장, 댓글 등의 콘텐츠에 대한 저작권은 해당 이용자에게 귀속됩니다.</p>
                            <p><span className="font-black">②</span> 이용자는 자신이 게시한 콘텐츠에 대해 다음과 같은 권리를 보유합니다:
                                <br />- 수정 및 삭제 권리
                                <br />- 저작권 침해에 대한 이의 제기 권리
                            </p>
                            <p><span className="font-black">③</span> 이용자는 콘텐츠를 게시함으로써 서비스에 다음과 같은 권리를 부여합니다:
                                <br />- 서비스 내에서 콘텐츠를 복제, 전송, 전시할 수 있는 권리
                                <br />- 서비스 운영, 개선, 홍보 목적으로 콘텐츠를 사용할 수 있는 권리
                                <br />- 다만, 이용자의 동의 없이 상업적 목적으로 별도 판매하거나 배포하지 않습니다
                            </p>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-2xl font-black uppercase tracking-tight border-l-8 border-foreground pl-4">
                            제4조 (제3자 저작권 보호)
                        </h2>
                        <div className="space-y-4 font-medium">
                            <p><span className="font-black">①</span> 이용자는 타인의 저작권을 침해하는 콘텐츠를 게시해서는 안 됩니다.</p>
                            <p><span className="font-black">②</span> 다음과 같은 행위는 저작권 침해에 해당할 수 있습니다:
                                <br />- 타인의 저작물을 무단으로 복제하여 게시하는 행위
                                <br />- 출처를 밝히지 않고 타인의 글을 인용하는 행위
                                <br />- 저작권자의 허락 없이 이미지, 영상 등을 사용하는 행위
                            </p>
                            <p><span className="font-black">③</span> 저작권 침해가 확인된 콘텐츠는 사전 통보 없이 삭제될 수 있으며, 해당 이용자는 서비스 이용이 제한될 수 있습니다.</p>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-2xl font-black uppercase tracking-tight border-l-8 border-foreground pl-4">
                            제5조 (저작권 침해 신고)
                        </h2>
                        <div className="space-y-4 font-medium">
                            <p><span className="font-black">①</span> 자신의 저작권이 침해되었다고 판단되는 경우, 권리자는 다음 정보를 포함하여 신고할 수 있습니다:</p>
                            <div className="pl-6 space-y-2">
                                <p>- 침해된 저작물의 설명</p>
                                <p>- 침해 콘텐츠의 위치 (URL 등)</p>
                                <p>- 권리자의 연락처</p>
                                <p>- 저작권 보유를 증명할 수 있는 자료</p>
                            </div>
                            <p><span className="font-black">②</span> 신고는 서비스 내 문의 기능을 통해 접수할 수 있습니다.</p>
                            <p><span className="font-black">③</span> 접수된 신고는 검토 후 적절한 조치가 취해집니다.</p>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-2xl font-black uppercase tracking-tight border-l-8 border-foreground pl-4">
                            제6조 (공정 이용)
                        </h2>
                        <div className="space-y-4 font-medium">
                            <p>다음과 같은 경우 저작권법상 공정 이용으로 인정될 수 있습니다:</p>
                            <div className="pl-6 space-y-2">
                                <p>✓ 비평, 논평, 뉴스 보도 목적의 인용</p>
                                <p>✓ 교육 목적의 이용</p>
                                <p>✓ 출처를 명시한 적절한 범위 내의 인용</p>
                            </div>
                            <p className="pt-4">다만, 공정 이용 여부는 개별 사안에 따라 판단되므로, 의심스러운 경우 저작권자의 허락을 받는 것을 권장합니다.</p>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-2xl font-black uppercase tracking-tight border-l-8 border-foreground pl-4">
                            제7조 (면책 조항)
                        </h2>
                        <div className="p-6 bg-foreground text-background font-medium">
                            <p>서비스는 이용자가 게시한 콘텐츠로 인해 발생하는 저작권 분쟁에 대해 책임을 지지 않습니다. 모든 법적 책임은 해당 콘텐츠를 게시한 이용자에게 있습니다.</p>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-2xl font-black uppercase tracking-tight border-l-8 border-foreground pl-4">
                            제8조 (오픈소스 라이선스)
                        </h2>
                        <div className="space-y-4 font-medium">
                            <p>서비스는 다음과 같은 오픈소스 라이브러리를 사용하고 있으며, 각 라이선스를 준수합니다:</p>
                            <div className="pl-6 space-y-2 text-sm">
                                <p>- Next.js (MIT License)</p>
                                <p>- React (MIT License)</p>
                                <p>- Supabase Client (MIT License)</p>
                                <p>- 기타 npm 패키지들 (각 라이선스 준수)</p>
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
