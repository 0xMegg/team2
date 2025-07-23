"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { useSurveyStore } from "@/store/surveyStore"; // ✅ Zustand import

export default function Header() {
  const reset = useSurveyStore((state) => state.reset); // ✅ 초기화 함수 가져오기

  const handleReset = () => {
    const confirmReset = confirm("정말 초기화하시겠습니까?");
    if (confirmReset) reset(); // ✅ 상태 초기화 실행
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
        <Button
          variant="outline"
          className="bg-white text-black text-sm"
          onClick={handleReset} // ✅ 여기에 이벤트 연결
        >
          초기화
        </Button>
      </div>

      {/* 우측: 로그인/회원가입 */}
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="text-gray-500 text-sm hover:text-black transition-colors"
        >
          로그인
        </Link>
        <Link
          href="/"
          className="text-gray-500 text-sm hover:text-black transition-colors"
        >
          회원가입
        </Link>
      </div>
    </header>
  );
}
