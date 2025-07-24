"use client";

import React, { useState } from "react";

import { supabase } from "../../utils/client";
import { useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const getData = async () => {
    const { data: test } = await supabase.from("topics").select("*");
    console.log(test);
  };

  return (
    <div className="flex items-center justify-center min-w-100 min-h-100 bg-[#ffd90066]">
      <Link className=" border-2 border-amber-600" href="/question">
        설문
      </Link>
    </div>
  );
}
