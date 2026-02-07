import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    default: "로고스 아레나 (Logos Arena) - 당신의 논리를 증명하라",
    template: "%s | 로고스 아레나",
  },
  description: "AI 판정단의 편향성을 간파하여 진실을 추리하는 고차원 심리 토론 게임. 다양한 주제로 논리적 토론에 참여하세요.",
  keywords: ["토론", "논리", "AI", "debate", "논쟁", "찬반토론", "커뮤니티", "로고스 아레나", "Logos Arena"],
  authors: [{ name: "Logos Arena" }],
  creator: "Logos Arena",
  publisher: "Logos Arena",
  metadataBase: new URL("https://logosarena.com"),
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://logosarena.com",
    siteName: "로고스 아레나",
    title: "로고스 아레나 (Logos Arena) - 당신의 논리를 증명하라",
    description: "AI 판정단의 편향성을 간파하여 진실을 추리하는 고차원 심리 토론 게임",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "로고스 아레나 - 논리 토론 플랫폼",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "로고스 아레나 (Logos Arena)",
    description: "AI 판정단의 편향성을 간파하여 진실을 추리하는 고차원 심리 토론 게임",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "googlecfe81672c8b0acf9",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
