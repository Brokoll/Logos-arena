import Link from "next/link";

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-background text-foreground p-8 md:p-24 font-sans">
            <div className="max-w-4xl mx-auto space-y-12">
                {/* Header */}
                <div className="border-b-[4px] border-foreground pb-8">
                    <Link href="/" className="text-sm font-black hover:opacity-70 transition-opacity uppercase tracking-widest block mb-8">
                        ← Back to Arena
                    </Link>
                    <h1 className="text-5xl md:text-7xl font-[900] tracking-tighter uppercase leading-none">
                        Terms of Service<br />
                        <span className="text-2xl md:text-3xl font-black">이용약관</span>
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
                            본 약관은 Rogos(이하 &quot;회사&quot;)가 운영하는 로고스 아레나(Logos Arena, 이하 &quot;서비스&quot;)의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
                        </p>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-2xl font-black uppercase tracking-tight border-l-8 border-foreground pl-4">
                            제2조 (정의)
                        </h2>
                        <div className="space-y-4 font-medium">
                            <p><span className="font-black">①</span> &quot;서비스&quot;란 로고스 아레나가 제공하는 온라인 토론 플랫폼을 의미합니다.</p>
                            <p><span className="font-black">②</span> &quot;이용자&quot;란 본 약관에 따라 회사가 제공하는 서비스를 이용하는 회원 및 비회원을 말합니다.</p>
                            <p><span className="font-black">③</span> &quot;회원&quot;이란 서비스에 가입하여 지속적으로 서비스를 이용할 수 있는 자를 말합니다.</p>
                            <p><span className="font-black">④</span> &quot;콘텐츠&quot;란 이용자가 서비스에 게시한 토론 주장, 댓글, 투표 등 모든 정보를 말합니다.</p>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-2xl font-black uppercase tracking-tight border-l-8 border-foreground pl-4">
                            제3조 (약관의 효력 및 변경)
                        </h2>
                        <div className="space-y-4 font-medium">
                            <p><span className="font-black">①</span> 본 약관은 서비스 화면에 게시하거나 기타의 방법으로 공지함으로써 효력이 발생합니다.</p>
                            <p><span className="font-black">②</span> 회사는 필요한 경우 관련 법령을 위배하지 않는 범위에서 본 약관을 변경할 수 있으며, 변경된 약관은 제1항과 같은 방법으로 공지합니다.</p>
                            <p><span className="font-black">③</span> 이용자는 변경된 약관에 동의하지 않을 경우 서비스 이용을 중단하고 탈퇴할 수 있습니다.</p>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-2xl font-black uppercase tracking-tight border-l-8 border-foreground pl-4">
                            제4조 (회원가입)
                        </h2>
                        <div className="space-y-4 font-medium">
                            <p><span className="font-black">①</span> 회원가입은 구글(Google) 계정을 통한 소셜 로그인으로만 가능합니다.</p>
                            <p><span className="font-black">②</span> 이용자는 회원가입 시 본 약관 및 개인정보처리방침에 동의해야 합니다.</p>
                            <p><span className="font-black">③</span> 회사는 다음 각 호에 해당하는 경우 회원가입을 거부하거나 사후에 회원자격을 제한·정지시킬 수 있습니다:
                                <br />- 타인의 명의를 도용한 경우
                                <br />- 허위 정보를 기재한 경우
                                <br />- 기타 회원으로 등록하는 것이 서비스의 기술상 현저히 지장이 있다고 판단되는 경우
                            </p>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-2xl font-black uppercase tracking-tight border-l-8 border-foreground pl-4">
                            제5조 (서비스의 제공)
                        </h2>
                        <div className="space-y-4 font-medium">
                            <p><span className="font-black">①</span> 회사는 다음과 같은 서비스를 제공합니다:
                                <br />- 토론 주제에 대한 찬성/반대 의견 게시
                                <br />- 다른 이용자의 주장에 대한 댓글 작성
                                <br />- 투표 및 좋아요 기능
                                <br />- 활동 점수 및 랭킹 시스템
                                <br />- 공지사항 확인
                            </p>
                            <p><span className="font-black">②</span> 서비스는 연중무휴 1일 24시간 제공함을 원칙으로 합니다. 다만, 시스템 점검, 서버 증설 등 운영상 필요한 경우 서비스를 일시 중단할 수 있습니다.</p>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-2xl font-black uppercase tracking-tight border-l-8 border-foreground pl-4">
                            제6조 (이용자의 의무)
                        </h2>
                        <div className="space-y-4 font-medium">
                            <p><span className="font-black">①</span> 이용자는 다음 각 호의 행위를 하여서는 안 됩니다:</p>
                            <div className="pl-6 space-y-2">
                                <p>- 타인의 정보 도용</p>
                                <p>- 회사가 게시한 정보의 변경</p>
                                <p>- 회사 및 제3자의 저작권 등 지적재산권 침해</p>
                                <p>- 회사 및 제3자의 명예를 손상시키거나 업무를 방해하는 행위</p>
                                <p>- 외설 또는 폭력적인 메시지, 화상, 음성 등을 공개 또는 게시하는 행위</p>
                                <p>- 욕설, 비방, 인신공격 등 건전한 토론 문화를 해치는 행위</p>
                                <p>- 허위 사실 유포</p>
                                <p>- 스팸성 콘텐츠 게시</p>
                                <p>- 기타 관련 법령에 위배되는 행위</p>
                            </div>
                            <p><span className="font-black">②</span> 이용자는 관계 법령, 본 약관, 이용안내 및 서비스와 관련하여 공지한 주의사항을 준수하여야 합니다.</p>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-2xl font-black uppercase tracking-tight border-l-8 border-foreground pl-4">
                            제7조 (콘텐츠의 관리)
                        </h2>
                        <div className="space-y-4 font-medium">
                            <p><span className="font-black">①</span> 이용자가 작성한 콘텐츠의 저작권은 해당 이용자에게 귀속됩니다.</p>
                            <p><span className="font-black">②</span> 회사는 이용자가 게시한 콘텐츠가 제6조에 위배된다고 판단되는 경우 사전 통지 없이 삭제하거나 이동 또는 등록을 거부할 수 있습니다.</p>
                            <p><span className="font-black">③</span> 회사는 서비스 운영, 개선, 홍보 등의 목적으로 이용자가 게시한 콘텐츠를 사용할 수 있습니다.</p>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-2xl font-black uppercase tracking-tight border-l-8 border-foreground pl-4">
                            제8조 (서비스 이용의 제한 및 정지)
                        </h2>
                        <div className="space-y-4 font-medium">
                            <p><span className="font-black">①</span> 회사는 이용자가 본 약관의 의무를 위반하거나 서비스의 정상적인 운영을 방해한 경우, 경고, 일시정지, 영구이용정지 등으로 서비스 이용을 단계적으로 제한할 수 있습니다.</p>
                            <p><span className="font-black">②</span> 회사는 전항에도 불구하고, 저작권법 위반, 명예훼손, 불법통신 등 관련 법령을 위반한 경우에는 즉시 영구이용정지를 할 수 있습니다.</p>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-2xl font-black uppercase tracking-tight border-l-8 border-foreground pl-4">
                            제9조 (면책조항)
                        </h2>
                        <div className="space-y-4 font-medium">
                            <p><span className="font-black">①</span> 회사는 천재지변, 전쟁, 기간통신사업자의 서비스 중지 등 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 책임이 면제됩니다.</p>
                            <p><span className="font-black">②</span> 회사는 이용자의 귀책사유로 인한 서비스 이용 장애에 대하여 책임을 지지 않습니다.</p>
                            <p><span className="font-black">③</span> 회사는 이용자가 서비스를 이용하여 기대하는 수익을 얻지 못하거나 상실한 것에 대하여 책임을 지지 않습니다.</p>
                            <p><span className="font-black">④</span> 회사는 이용자 상호간 또는 이용자와 제3자 간에 서비스를 매개로 발생한 분쟁에 대해 개입할 의무가 없으며, 이로 인한 손해를 배상할 책임도 없습니다.</p>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-2xl font-black uppercase tracking-tight border-l-8 border-foreground pl-4">
                            제10조 (분쟁 해결)
                        </h2>
                        <div className="space-y-4 font-medium">
                            <p><span className="font-black">①</span> 본 약관은 대한민국 법률에 따라 규율되고 해석됩니다.</p>
                            <p><span className="font-black">②</span> 서비스 이용과 관련하여 회사와 이용자 간에 분쟁이 발생한 경우, 양 당사자는 분쟁의 해결을 위해 성실히 협의합니다.</p>
                            <p><span className="font-black">③</span> 제2항의 협의에서도 분쟁이 해결되지 않을 경우 양 당사자는 민사소송법상의 관할법원에 소를 제기할 수 있습니다.</p>
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
