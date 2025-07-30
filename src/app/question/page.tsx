"use client";

import React, { useState, useEffect } from "react";
import MainPartComponent from "../../components/main-part";
import MainTitleComponent from "../../components/main-title";
import QuestionBoxComponent from "../../components/question-box";
import { supabase } from "@/utils/client";
import { useRouter } from "next/navigation";

type Question = {
  id: number;
  title: string;
  type: string;
  content: any;
  required: boolean;
};

// type 라벨 → uuid
const typeLabelToUUID: Record<string, string> = {
  one: "uuid-for-one",
  two: "uuid-for-two",
  three: "uuid-for-three",
  four: "uuid-for-four",
  five: "uuid-for-five",
  six: "uuid-for-six",
  seven: "uuid-for-seven",
  eight: "uuid-for-eight",
};

// uuid → type 라벨 (역변환)
const uuidToLabel: Record<string, string> = {
  "uuid-for-one": "one",
  "uuid-for-two": "two",
  "uuid-for-three": "three",
  "uuid-for-four": "four",
  "uuid-for-five": "five",
  "uuid-for-six": "six",
  "uuid-for-seven": "seven",
  "uuid-for-eight": "eight",
};

export default function Home() {
  const router = useRouter();

  const [mode, setMode] = useState<"create" | "edit" | null>(null);
  const [surveyId, setSurveyId] = useState<string | null>(null);
  const [mainTitle, setMainTitle] = useState("");
  const [mainDesc, setMainDesc] = useState("");
  const [questions, setQuestions] = useState<Question[]>([
    { id: 0, title: "", type: "one", required: false, content: null },
  ]);

  useEffect(() => {
    const checkSurvey = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/sign-in");
        return;
      }

      const { data, error } = await supabase
        .from("survey")
        .select("*")
        .eq("author", user.id)
        .single();

      if (data) {
        setMode("edit");
        setSurveyId(data.id);
        setMainTitle(data.title);
        setMainDesc(data.title_contents);

        // 🔁 질문 type을 uuid → 라벨로 변환
        const converted = data.questions.map((q: any, i: number) => ({
          id: i,
          title: q.title,
          content: q.content,
          type: uuidToLabel[q.type] ?? "one", // 핵심 변환!
          required: q.required ?? false,
        }));

        setQuestions(converted);
      } else {
        setMode("create");
      }
    };

    checkSurvey();
  }, []);

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
    setQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, ...updated } : q))
    );
  };

  const handleSubmit = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    const questionData = questions.map((q) => ({
      title: q.title,
      type: typeLabelToUUID[q.type], // 라벨 → uuid 변환
      content: q.content,
    }));

    if (mode === "create") {
      const { error } = await supabase.from("survey").insert([
        {
          title: mainTitle,
          title_contents: mainDesc,
          questions: questionData,
          author: user.id,
          bool: true,
        },
      ]);

      if (error) {
        console.error("❌ 저장 실패:", error.message);
        alert("저장 실패");
      } else {
        alert("성공적으로 저장되었습니다!");
        router.push("/result");
      }
    }

    if (mode === "edit" && surveyId) {
      const { error } = await supabase
        .from("survey")
        .update({
          title: mainTitle,
          title_contents: mainDesc,
          questions: questionData,
        })
        .eq("id", surveyId);

      if (error) {
        console.error("❌ 수정 실패:", error.message);
        alert("수정 실패");
      } else {
        alert("성공적으로 수정되었습니다!");
        router.push("/result");
      }
    }
  };

  if (mode === null) return <div>로딩 중...</div>;

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
