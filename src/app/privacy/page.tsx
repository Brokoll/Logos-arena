import Link from "next/link";

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-background text-foreground p-8 md:p-24 font-sans">
            <div className="max-w-4xl mx-auto space-y-12">
                {/* Header */}
                <div className="border-b-[4px] border-foreground pb-8">
                    <Link href="/" className="text-sm font-black hover:opacity-70 transition-opacity uppercase tracking-widest block mb-8">
                        ← Back to Arena
                    </Link>
                    <h1 className="text-5xl md:text-7xl font-[900] tracking-tighter uppercase leading-none">
                        Privacy Policy<br />
                        <span className="text-2xl md:text-3xl opacity-50 font-black">개인정보처리방침 (초안)</span>
                    </h1>
                    <p className="mt-4 text-sm font-medium opacity-50 uppercase tracking-widest">
                        공고일자: 2025-09-30 · 시행일자: 2025-09-30
                    </p>
                </div>

                {/* Content Section */}
                <div className="space-y-12 leading-relaxed">
                    <section className="space-y-6">
                        <h2 className="text-2xl font-black uppercase tracking-tight border-l-8 border-foreground pl-4">
                            총칙
                        </h2>
                        <div className="p-6 bg-foreground text-background font-medium italic">
                            mozi/mozy(이하 개발자)(이하 &apos;회사&apos;라 합니다)는 개인정보 보호법 제30조에 따라 이용자의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보처리방침을 수립·공개합니다.
                        </div>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-2xl font-black uppercase tracking-tight border-l-8 border-foreground pl-4">
                            제1조 (수집하는 개인정보의 항목 및 수집방법)
                        </h2>
                        <div className="overflow-x-auto border-[3px] border-foreground">
                            <table className="w-full text-left text-sm border-collapse">
                                <thead className="bg-foreground text-background">
                                    <tr>
                                        <th className="p-4 border-r border-background font-black uppercase">수집 시점</th>
                                        <th className="p-4 border-r border-background font-black uppercase">구분</th>
                                        <th className="p-4 border-r border-background font-black uppercase">수집 항목</th>
                                        <th className="p-4 font-black uppercase">수집 목적</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b-[2px] border-foreground">
                                        <td className="p-4 border-r border-foreground font-bold">회원가입 시</td>
                                        <td className="p-4 border-r border-foreground"><span className="px-2 py-0.5 border-2 border-foreground rounded-full text-[10px] font-black uppercase">필수</span></td>
                                        <td className="p-4 border-r border-foreground">닉네임, 계정 식별 정보(자체 또는 플랫폼)</td>
                                        <td className="p-4">이용자 식별 및 서비스 제공</td>
                                    </tr>
                                    <tr className="border-b-[2px] border-foreground">
                                        <td className="p-4 border-r border-foreground font-bold">서비스 이용 시</td>
                                        <td className="p-4 border-r border-foreground"><span className="px-2 py-0.5 border-2 border-foreground rounded-full text-[10px] font-black uppercase opacity-50">자동</span></td>
                                        <td className="p-4 border-r border-foreground">기기 정보(OS, 기기 식별자), IP 주소, 게임 이용 기록(플레이 기록, 아이템 구매 내역), 접속 기록, 쿠키</td>
                                        <td className="p-4">불량 이용 방지, 서비스 개선 및 통계 분석</td>
                                    </tr>
                                    <tr className="border-b-[2px] border-foreground">
                                        <td className="p-4 border-r border-foreground font-bold">유료 결제 시</td>
                                        <td className="p-4 border-r border-foreground"><span className="px-2 py-0.5 border-2 border-foreground rounded-full text-[10px] font-black uppercase">플랫폼</span></td>
                                        <td className="p-4 border-r border-foreground">Google Play 주문 번호 등 결제 기록</td>
                                        <td className="p-4">결제 처리 및 결제 도용 방지</td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 border-r border-foreground font-bold">고객 문의 시</td>
                                        <td className="p-4 border-r border-foreground"><span className="px-2 py-0.5 border-2 border-foreground rounded-full text-[10px] font-black uppercase opacity-50">선택</span></td>
                                        <td className="p-4 border-r border-foreground">이메일 주소, 추가 제공 정보</td>
                                        <td className="p-4">문의 내용 확인 및 회신</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section className="space-y-4 text-sm opacity-80 font-medium">
                        <p className="font-black text-base opacity-100">② 수집 방법</p>
                        <p>- 회원가입 및 서비스 이용 과정에서 이용자가 개인정보 수집에 대해 동의를 하고 직접 정보를 입력하는 경우</p>
                    </section>
                </div>

                {/* Footer */}
                <div className="pt-12 border-t-[4px] border-foreground opacity-30 text-xs font-black uppercase tracking-widest text-center">
                    &copy; 2025 LOGOS ARENA. ALL RIGHTS RESERVED.
                </div>
            </div>
        </div>
    );
}
