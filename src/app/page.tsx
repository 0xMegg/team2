"use client";

import SeatsTable from "@/components/seatsTable";
import { supabase } from "../../utils/client";
import { useEffect } from "react";
import { useState } from "react";

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

  async function readRows() {
    const { data: seats, error } = await supabase.from("userInfo").select("*");
    if (error) {
      console.error("Error reading topics:", error);
    } else {
      console.log("seats:", seats);
      setSeatsData(seats || []);
    }
  }

  useEffect(() => {
    readRows();
  }, []);

  return (
    <div className="h-[calc(100vh-120px)] bg-[#ffd90066] flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-6xl mx-auto">
          <div className="flex flex-col justify-center items-center gap-4">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-yellow-800">
                스나컴즈 2기
              </h1>
            </div>
            <SeatsTable
              seatsData={seatsData}
              selectedSeat={undefined}
              onSeatChange={undefined}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
