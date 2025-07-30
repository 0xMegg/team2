"use client";

import React, { useState } from "react";

import { supabase } from "../../utils/client";
import { useEffect } from "react";
import MainPartComponent from "../components/main-part";
import MainTitleComponent from "../components/main-title";
import QuestionBoxComponent from "../components/question-box";
import SeatsTable from "@/components/seatsTable";

interface SeatData {
  id: number;
  seat: number;
  profileImage?: string;
  // 다른 필요한 필드들도 추가할 수 있습니다
}

export default function Home() {
  const [seatsData, setSeatsData] = useState<SeatData[]>([]);

  async function readRows() {
    const { data: seats, error } = await supabase.from("seats").select("*");
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
    <div className="min-w-100 min-h-100 bg-[#ffd90066]">
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4 text-center">좌석 현황</h1>
        <SeatsTable
          seatsData={seatsData}
          selectedSeat={undefined}
          onSeatChange={undefined}
        />
      </div>
    </div>
  );
}
