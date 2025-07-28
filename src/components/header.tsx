"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";

export default function Header() {
  return (
    <header className="w-full h-20 flex items-center justify-between px-6 bg-yellow-50">
      {/* 좌측: 로고 + 제목 */}
      <div className="flex items-center gap-4">
        <Image src="/logo.png" alt="로고" width={140} height={140} />
        <h1 className="text-xl font-bold text-yellow-700">후라이잉</h1>
      </div>

      {/* 우측: 로그인/회원가입 */}
      <div className="flex items-center gap-4">
        <Link
          href="/sign-in"
          className="text-gray-500 text-sm hover:text-black transition-colors"
        >
          로그인
        </Link>
        <Link
          href="/sign-up"
          className="text-gray-500 text-sm hover:text-black transition-colors"
        >
          회원가입
        </Link>
      </div>
    </header>
  );
}
