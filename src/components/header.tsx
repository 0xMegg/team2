import Image from "next/image";
import Link from "next/link";
import SearchBox from "./searchbox";

export default function Header() {
  return (
    <div className="h-20 w-full">
      {/* 헤더 */}
      <header className="h-full w-full bg-amber-50 flex justify-between ">
        {/* 로고 */}
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="" width={120} height={120} className="" />
          <p className="flex text-2xl ">계란말이</p>
        </div>
        {/* 검색 */}
        <div className="h-full flex items-center justify-center">
          <SearchBox />
        </div>
        {/* 로그인 */}
        <div className="flex items-center gap-4">
          <Link href="/" className="text-gray-600 hover:text-gray-900">
            로그인
          </Link>
          <Link href="/" className="text-gray-600 hover:text-gray-900">
            회원가입
          </Link>
        </div>
      </header>
    </div>
  );
}
