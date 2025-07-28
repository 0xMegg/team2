"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import {
  useAuthStore,
  getCurrentUser,
  isUserAuthenticated,
} from "@/stores/auth";
import { useRouter } from "next/navigation";

export default function Header() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/sign-in");
  };

  return (
    <header className="w-full h-20 flex items-center justify-between px-6 bg-yellow-50">
      {/* 좌측: 로고 + 제목 */}
      <div className="flex items-center gap-4">
        <Image src="/logo.png" alt="로고" width={140} height={140} />
        <h1 className="text-xl font-bold text-yellow-700">후라이잉</h1>
      </div>


      {/* 기능 버튼들 */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-3">
        <Button variant="outline" className="bg-white text-black text-sm">
          미리보기
        </Button>
      </div>

      {/* 우측: 인증 상태에 따른 동적 UI */}
      <div className="flex items-center gap-4">
        {isAuthenticated && user ? (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-700">
              안녕하세요, {user.name}님!
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="text-red-600 hover:text-red-700"
            >
              로그아웃
            </Button>
          </div>
        ) : (
          <>
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
          </>
        )}
      </div>
    </header>
  );
}
