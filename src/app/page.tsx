"use client";

import React, { useState } from "react";

import { supabase } from "../../utils/client";
import { useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const getData = async () => {
    const { data: test } = await supabase.from("test").select("*");
    console.log("2", test);
  };

  useEffect(() => {
    getData();
  }, []);
  const [questionBoxes, setQuestionBoxes] = useState([0]);
  const handleAddItem = () => {
    setQuestionBoxes((prevBoxes) => [...prevBoxes, prevBoxes.length]);
  };

  return (
    <div className="flex items-center justify-center w-full  min-h-[calc(100vh-216px)] bg-[#ffd90066] gap-5">
      <Link
        className="flex 
      "
        href="/question"
      >
        설문
      </Link>
      <Link
        className="flex 
      "
        href="/result"
      >
        결과
      </Link>
    </div>
  );
}
