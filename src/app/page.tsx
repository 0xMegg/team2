"use client";

import SeatsTable from "@/components/seatsTable";
import { supabase } from "../../utils/client";
import { useEffect, useState } from "react";
import EggBackground from "@/components/eggBackground";

interface SeatData {
  id: number;
  seat: number;
  profileImage?: string;
  userName: string;
  title?: string;
  // 다른 필요한 필드들도 추가할 수 있습니다
}

export default function Home() {
  const [seatsData, setSeatsData] = useState<SeatData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let active = true;

    void supabase
      .from("userInfo")
      .select("*")
      .then(({ data: seats, error }) => {
        if (!active) return;

        if (error) {
          console.error("좌석 정보를 불러오지 못했습니다:", error);
          setLoadError(true);
        } else {
          setLoadError(false);
          setSeatsData(seats || []);
        }
        setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="h-[calc(100vh-120px)] bg-[#ffd90066] flex flex-col relative">
      <EggBackground />
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 relative z-10">
        <div className="w-full max-w-6xl mx-auto">
          <div className="flex flex-col justify-center items-center gap-4">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-yellow-800">
                스나컴즈 2기
              </h1>
            </div>
            {isLoading ? (
              <p role="status" className="rounded-lg bg-white/80 px-4 py-2">
                좌석 정보를 불러오는 중입니다.
              </p>
            ) : loadError ? (
              <p
                role="alert"
                className="rounded-lg bg-red-50 px-4 py-2 text-red-800"
              >
                현재 좌석 정보를 표시할 수 없습니다.
              </p>
            ) : (
              <SeatsTable seatsData={seatsData} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
