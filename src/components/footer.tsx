"use client";

import Link from "next/link";
import { Button } from "./ui/button";

export default function Footer() {
  return (
    <footer className="w-full h-34 bg-amber-300 py-5 flex flex-col items-center gap-2">
      {/* 타이틀 */}
      <p className="text-sm font-semibold text-white">2조</p>

      {/* 링크 버튼 */}
      <div className="flex flex-wrap justify-center gap-2">
        <Link href="/portfolio/kimjy">
          <Button variant="secondary" className="text-sm">
            김준엽
          </Button>
        </Link>
        <Link href="/portfolio/sonmj">
          <Button variant="secondary" className="text-sm">
            손민준
          </Button>
        </Link>
        <Link href="/portfolio/choijh">
          <Button variant="secondary" className="text-sm">
            최준호
          </Button>
        </Link>
        <Link href="/portfolio/kimhy">
          <Button variant="secondary" className="text-sm">
            김현영
          </Button>
        </Link>
      </div>

      {/* 저작권 정보 */}
      <p className="text-xs text-white/80 mt-2">
        &copy; {new Date().getFullYear()} 계란말이 . All rights reserved.
      </p>
    </footer>
  );
}
