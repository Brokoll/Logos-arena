import Link from "next/link";

export default function YouthProtectionPage() {
    return (
        <div className="min-h-screen bg-background text-foreground p-8 md:p-24 font-sans">
            <div className="max-w-4xl mx-auto space-y-12">
                {/* Header */}
                <div className="border-b-[4px] border-foreground pb-8">
                    <Link href="/" className="text-sm font-black hover:opacity-70 transition-opacity uppercase tracking-widest block mb-8">
                        ← Back to Arena
                    </Link>
                    <h1 className="text-5xl md:text-7xl font-[900] tracking-tighter uppercase leading-none">
                        Youth Protection Policy<br />
                        <span className="text-2xl md:text-3xl font-black">청소년 보호정책</span>
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
                            로고스 아레나(이하 &quot;서비스&quot;)는 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」 및 「청소년 보호법」에 따라 청소년이 안전하게 서비스를 이용할 수 있도록 다음과 같이 청소년 보호정책을 수립·시행합니다.
                        </p>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-2xl font-black uppercase tracking-tight border-l-8 border-foreground pl-4">
                            제2조 (유해정보 차단)
                        </h2>
                        <div className="space-y-4 font-medium">
                            <p><span className="font-black">①</span> 서비스는 다음과 같은 유해정보의 게시를 금지합니다:</p>
                            <div className="pl-6 space-y-2">
                                <p>- 청소년에게 성적 수치심을 유발할 수 있는 내용</p>
                                <p>- 폭력적이거나 잔인한 내용</p>
                                <p>- 범죄를 미화하거나 조장하는 내용</p>
                                <p>- 음란물 또는 선정적인 내용</p>
                                <p>- 사행심을 조장하는 내용</p>
                                <p>- 청소년의 건전한 인격 형성을 저해하는 내용</p>
                            </div>
                            <p><span className="font-black">②</span> 위 항목에 해당하는 콘텐츠가 발견될 경우 즉시 삭제 조치됩니다.</p>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-2xl font-black uppercase tracking-tight border-l-8 border-foreground pl-4">
                            제3조 (건전한 토론 문화)
                        </h2>
                        <div className="space-y-4 font-medium">
                            <p>서비스는 청소년을 포함한 모든 이용자가 건전한 토론 문화를 경험할 수 있도록 다음 원칙을 권장합니다:</p>
                            <div className="pl-6 space-y-2">
                                <p>✓ 상대방을 존중하는 언어 사용</p>
                                <p>✓ 논리적이고 근거 있는 주장 전개</p>
                                <p>✓ 인신공격이나 비방 금지</p>
                                <p>✓ 사실에 기반한 토론</p>
                                <p>✓ 다양한 의견 수용</p>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-2xl font-black uppercase tracking-tight border-l-8 border-foreground pl-4">
                            제4조 (신고 및 처리)
                        </h2>
                        <div className="space-y-4 font-medium">
                            <p><span className="font-black">①</span> 이용자는 유해정보나 부적절한 콘텐츠를 발견한 경우 즉시 신고할 수 있습니다.</p>
                            <p><span className="font-black">②</span> 신고된 콘텐츠는 24시간 이내에 검토되며, 정책 위반이 확인될 경우 즉시 삭제됩니다.</p>
                            <p><span className="font-black">③</span> 반복적으로 유해정보를 게시하는 이용자는 서비스 이용이 제한될 수 있습니다.</p>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-2xl font-black uppercase tracking-tight border-l-8 border-foreground pl-4">
                            제5조 (보호자의 권리)
                        </h2>
                        <div className="space-y-4 font-medium">
                            <p><span className="font-black">①</span> 청소년의 보호자는 자녀의 서비스 이용 내역을 확인할 권리가 있습니다.</p>
                            <p><span className="font-black">②</span> 보호자는 자녀의 서비스 이용과 관련하여 문의 또는 요청 사항이 있을 경우 서비스 내 문의 기능을 통해 연락할 수 있습니다.</p>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-2xl font-black uppercase tracking-tight border-l-8 border-foreground pl-4">
                            제6조 (연령 제한)
                        </h2>
                        <div className="p-6 bg-foreground text-background font-medium">
                            <p className="font-black mb-3">중요 안내</p>
                            <p>현재 로고스 아레나는 <span className="font-black">연령 제한이 없는 전체 이용가 서비스</span>입니다. 다만, 건전한 토론 문화 유지를 위해 구글 계정을 통한 본인 인증을 필수로 하고 있습니다.</p>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-2xl font-black uppercase tracking-tight border-l-8 border-foreground pl-4">
                            제7조 (청소년 보호책임자)
                        </h2>
                        <div className="border-[3px] border-foreground p-8 space-y-4 font-medium">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="font-black uppercase text-sm tracking-wider">책임자</div>
                                <div className="md:col-span-2">Rogos</div>
                            </div>
                            <div className="border-t-2 border-foreground my-4"></div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="font-black uppercase text-sm tracking-wider">연락 방법</div>
                                <div className="md:col-span-2">서비스 내 문의 기능 이용</div>
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
