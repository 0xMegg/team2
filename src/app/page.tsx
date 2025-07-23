"use client";

import { supabase } from "../../utils/client";
import { useEffect } from "react";

export default function Home() {
  const getData = async () => {
    const { data: test } = await supabase.from("test").select("*");
    console.log(test);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <button onClick={getData}>Get Data</button>
      <h1 className="text-3xl font-bold underline">Hello World</h1>
    </div>
  );
}
