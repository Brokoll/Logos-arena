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
                            Rogos(이하 개발자)(이하 &apos;회사&apos;라 합니다)는 개인정보 보호법 제30조에 따라 이용자의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보처리방침을 수립·공개합니다.
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
                                        <th className="p-4 border-r border-background font-black uppercase min-w-[120px]">수집 시점</th>
                                        <th className="p-4 border-r border-background font-black uppercase min-w-[80px]">구분</th>
                                        <th className="p-4 border-r border-background font-black uppercase">수집 항목</th>
                                        <th className="p-4 font-black uppercase">수집 목적</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b-[2px] border-foreground">
                                        <td className="p-4 border-r border-foreground font-bold">회원가입 시</td>
                                        <td className="p-4 border-r border-foreground"><span className="px-3 py-1 border-2 border-foreground rounded-full text-[10px] font-black uppercase whitespace-nowrap">필수</span></td>
                                        <td className="p-4 border-r border-foreground">이메일 주소, 이름(닉네임), 프로필 사진 URL, 구글 계정 고유 ID</td>
                                        <td className="p-4">이용자 식별, 회원 관리 및 서비스 제공</td>
                                    </tr>
                                    <tr className="border-b-[2px] border-foreground">
                                        <td className="p-4 border-r border-foreground font-bold">서비스 이용 시</td>
                                        <td className="p-4 border-r border-foreground"><span className="px-3 py-1 border-2 border-foreground rounded-full text-[10px] font-black uppercase whitespace-nowrap opacity-50">자동</span></td>
                                        <td className="p-4 border-r border-foreground">토론 주장 및 댓글 작성 내역, 투표/좋아요 기록, 활동 점수 및 랭킹 데이터, IP 주소, 기기 정보(OS, 브라우저), 접속 기록, 쿠키</td>
                                        <td className="p-4">토론 서비스 제공, 부정 이용 방지, 서비스 개선 및 분석</td>
                                    </tr>
                                    <tr className="border-b-[2px] border-foreground">
                                        <td className="p-4 border-r border-foreground font-bold">유료 결제 시</td>
                                        <td className="p-4 border-r border-foreground"><span className="px-3 py-1 border-2 border-foreground rounded-full text-[10px] font-black uppercase whitespace-nowrap">플랫특</span></td>
                                        <td className="p-4 border-r border-foreground">결제 승인 번호 및 결제 기록 (기능 도입 시 수집)</td>
                                        <td className="p-4">결제 처리 및 이용 권한 확인 (현재 모든 서비스 무료)</td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 border-r border-foreground font-bold">고객 문의 시</td>
                                        <td className="p-4 border-r border-foreground"><span className="px-3 py-1 border-2 border-foreground rounded-full text-[10px] font-black uppercase opacity-50">선택</span></td>
                                        <td className="p-4 border-r border-foreground">이메일 주소, 문의 내용 및 첨부 파일</td>
                                        <td className="p-4">문의 사항 확인 및 답변 안내</td>
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
