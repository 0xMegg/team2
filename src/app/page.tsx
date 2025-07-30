"use client";

import EggBackground from "@/components/EggBackGround";
import SeatsTable from "@/components/seatsTable";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HomePage() {
  const router = useRouter();
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);

  const handleStart = () => {
    if (selectedSeat === null) {
      alert("좌석을 먼저 선택해주세요!");
      return;
    }

    // 나중에 여기서 /form?seat=2 이런 식으로 넘겨도 됨
    router.push("/form");
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#ffd90066] p-10 gap-10">
      <EggBackground />
      {/* 👋 환영 메시지 */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">환영합니다</h1>

        <button
          onClick={handleStart}
          className="bg-amber-400 text-white px-6 py-3 rounded-xl shadow hover:bg-amber-500 transition"
        >
          설문 시작하기
        </button>
      </div>

      {/* 🪑 좌석 선택 UI */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold text-yellow-500 mb-4">
          좌석 선택
        </h2>
        <SeatsTable seat={selectedSeat ?? -1} onSeatChange={setSelectedSeat} />
        {selectedSeat !== null && (
          <p className="mt-4 font-bold text-green-600">
            선택한 좌석: {selectedSeat}번
          </p>
        )}
        <div className="mt-6 flex justify-center">
          <Button
            onClick={handleStart}
            className="bg-yellow-400 text-white px-6 py-3 rounded-xl shadow hover:bg-yellow-500 transition"
          >
            완료
          </Button>
        </div>
      </div>
    </main>
  );
}
