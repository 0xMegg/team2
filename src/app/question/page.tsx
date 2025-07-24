"use client";

import React, { useState } from "react";

import { supabase } from "../../../utils/client";
import { useEffect } from "react";
import MainPartComponent from "../../components/main-part";
import MainTitleComponent from "../../components/main-title";
import QuestionBoxComponent from "../../components/question-box";

export default function Home() {
  const getData = async () => {
    const { data: test } = await supabase.from("topics").select("*");
    console.log(test);
  };

  useEffect(() => {
    getData();
  }, []);

  const [questionBoxes, setQuestionBoxes] = useState([0]);
  const handleAddItem = () => {
    setQuestionBoxes((prevBoxes) => [...prevBoxes, prevBoxes.length]);
  };

  return (
    <div>
      <MainPartComponent onAddItem={handleAddItem}>
        <MainTitleComponent />
        {questionBoxes.map((_, index) => (
          <QuestionBoxComponent key={index} />
        ))}
      </MainPartComponent>
    </div>
  );
}
