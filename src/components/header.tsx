"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Header() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 스크롤 감지
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/sign-in");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200"
          : "bg-yellow-50"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 lg:h-16">
          {/* 로고 섹션 */}
          <Link
            href="/"
            className="flex items-center gap-2 group"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div className="relative w-14 h-14 lg:w-16 lg:h-16">
              <Image
                src="/logo.png"
                alt="후라이잉 로고"
                fill
                className="object-contain transition-transform group-hover:scale-105"
                priority
              />
            </div>
            <h1
              className="text-lg lg:text-xl font-bold text-yellow-700 group-hover:text-yellow-800 transition-colors"
              style={{ fontFamily: "'BagelFatOne-Regular', sans-serif" }}
            >
              후라이잉
            </h1>
          </Link>

          {/* 데스크톱 네비게이션 */}
          <nav className="hidden md:flex items-center gap-6">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-4">
                <span
                  className="text-sm text-gray-700 font-medium"
                  style={{ fontFamily: "'BagelFatOne-Regular', sans-serif" }}
                >
                  {user.name}님
                </span>
                <Link href="/profile/edit">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200 transition-all duration-200"
                  >
                    회원정보 변경
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 transition-all duration-200"
                >
                  로그아웃
                </Button>
              </div>
            ) : (
              <Link
                href="/sign-in"
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200"
              >
                로그인
              </Link>
            )}
          </nav>

          {/* 모바일 메뉴 버튼 - 로그인 상태일 때만 표시 */}
          {isAuthenticated && user && (
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              aria-label="메뉴 열기"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          )}

          {/* 로그인하지 않은 상태에서는 모바일에서도 로그인 링크 표시 */}
          {!isAuthenticated && (
            <Link
              href="/sign-in"
              className="md:hidden text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              로그인
            </Link>
          )}
        </div>

        {/* 모바일 메뉴 - 로그인 상태일 때만 표시 */}
        {isAuthenticated && user && isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white/95 backdrop-blur-md">
            <div className="px-4 py-4 space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p
                      className="font-medium text-gray-900"
                      style={{
                        fontFamily: "'BagelFatOne-Regular', sans-serif",
                      }}
                    >
                      {user.name}님
                    </p>
                    <p className="text-sm text-gray-500">환영합니다</p>
                  </div>
                </div>
                <Link
                  href="/profile/edit"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Button
                    variant="outline"
                    className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200"
                  >
                    회원정보 변경
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  로그아웃
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
