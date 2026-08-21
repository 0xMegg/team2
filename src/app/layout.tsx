import type { Metadata } from "next";
import "./globals.css";
import Header from "../components/header";
import Footer from "../components/footer";
import { Toaster } from "@/components/ui/sonner";
import AuthSessionSync from "@/components/auth-session-sync";

export const metadata: Metadata = {
  title: "후라이잉 | 스나컴즈 2기 좌석 디렉터리",
  description:
    "교육 과정 참여자가 좌석과 프로필, 공유 링크를 연결해 서로를 탐색하는 팀 프로젝트",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        <AuthSessionSync />
        <Header />
        <main className="pt-14 lg:pt-16">{children}</main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
