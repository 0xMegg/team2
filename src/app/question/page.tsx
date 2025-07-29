"use client";

import React, { useState } from "react";
import MainPartComponent from "../../components/main-part";
import MainTitleComponent from "../../components/main-title";
import QuestionBoxComponent from "../../components/question-box";
import { supabase } from "@/utils/client";

type Question = {
  id: number;
  title: string;
  type: string;
  content: any; // ✅ 추가됨
  required: boolean;
};

// type 문자열 → uuid로 매핑
const typeLabelToUUID: Record<string, string> = {
  one: "uuid-for-one", // 주관식
  two: "uuid-for-two", // 서술형
  three: "uuid-for-three", // 객관식
  four: "uuid-for-four", // 체크박스
  five: "uuid-for-five", // 드롭다운
  six: "uuid-for-six", // 파일업로드
  seven: "uuid-for-seven", // 블로그 주소
  eight: "uuid-for-eight", // 이미지
};

export default function Home() {
  const [mainTitle, setMainTitle] = useState("");
  const [mainDesc, setMainDesc] = useState("");

  const [questions, setQuestions] = useState<Question[]>([
    { id: 0, title: "", type: "one", required: false, content: null },
  ]);

  const handleAddItem = () => {
    setQuestions((prev) => [
      ...prev,
      {
        id: prev.length,
        title: "",
        type: "one",
        required: false,
        content: null,
      },
    ]);
  };

  const updateQuestion = (index: number, updated: Partial<Question>) => {
    console.log("🔧 질문 업데이트됨:", index, updated); // 디버깅용
    setQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, ...updated } : q))
    );
  };

  const handleSubmit = async () => {
    const questionData = questions.map((q) => ({
      title: q.title,
      type: typeLabelToUUID[q.type],
      content: q.content, // ✅ 반드시 이 부분에서 값이 있어야 함
    }));

    console.log("🧾 저장 전 질문 데이터:", questionData); // 이걸 꼭 확인!

    const { data, error } = await supabase.from("survey").insert([
      {
        title: mainTitle,
        title_contents: mainDesc,
        questions: questionData,
      },
    ]);

    if (error) {
      console.error("❌ 저장 실패:", error.message);
      alert("저장 실패");
    } else {
      alert("성공적으로 저장되었습니다!");
      console.log("✅ 저장된 데이터:", data);
    }
  };

  return (
    <div>
      <MainPartComponent onAddItem={handleAddItem} onSubmit={handleSubmit}>
        <MainTitleComponent
          title={mainTitle}
          onTitleChange={setMainTitle}
          titleContents={mainDesc}
          onTitleContentsChange={setMainDesc}
        />
        {questions.map((q, index) => (
          <QuestionBoxComponent
            key={q.id}
            index={index}
            question={q}
            onChange={updateQuestion}
          />
        ))}
      </MainPartComponent>
    </div>
  );
}
