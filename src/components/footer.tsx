"use client";

import Link from "next/link";
import { Button } from "./ui/button";

export default function Footer() {
  return (
    <footer className="w-full bg-amber-300 py-5 flex flex-col items-center gap-2">
      {/* 타이틀 */}
      <p className="text-sm font-semibold text-white">2조</p>

      <div className="flex flex-wrap justify-center gap-2">
        김준엽 손민준 최준호 김현영
      </div>

      {/* 저작권 정보 */}
      <p className="text-xs text-white/80 mt-2">
        &copy; {new Date().getFullYear()} 후라이잉 . All rights reserved.
      </p>
    </footer>
  );
}
