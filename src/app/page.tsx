"use client";

import React, { useState } from "react";

import { supabase } from "../../utils/client";
import { useEffect } from "react";
import MainPartComponent from "../components/main-part";
import MainTitleComponent from "../components/main-title";
import QuestionBoxComponent from "../components/question-box";

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

  return <div className="min-w-100 min-h-100 bg-[#ffd90066]"></div>;
}
