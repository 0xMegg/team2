"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/utils/client";
import { useParams } from "next/navigation";

// survey 배열에 들어갈 객체 하나의 타입을 정의합니다.
interface SurveyItem {
  id: number;
  created_at: string;
  title: string;
  title_contents: string;
  author: string;
  questions: any[];
}

export default function ResultPage() {
  const [survey, setSurvey] = useState<SurveyItem[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const seat = params.seat as string;

  useEffect(() => {
    const checkUserAndFetchData = async () => {
      setLoading(true);

      // 현재 로그인된 사용자 세션 정보를 Supabase에서 직접 가져옵니다.
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const currentUserId = session?.user?.id || null;
      setUserId(currentUserId);

      // 확인용 콘솔 로그
      console.log("컴포넌트에서 직접 확인한 userId:", currentUserId);
      console.log("현재 seat 값:", seat);

      try {
        // 1. seats 테이블에서 해당 seat의 author 값을 가져옵니다.
        const { data: seatData, error: seatError } = await supabase
          .from("seats")
          .select("author")
          .eq("seat", seat)
          .single();

        if (seatError) {
          setError("해당 좌석 정보를 찾을 수 없습니다.");
          console.error(seatError);
          setLoading(false);
          return;
        }

        if (!seatData || !seatData.author) {
          setError("해당 좌석의 작성자 정보를 찾을 수 없습니다.");
          setLoading(false);
          return;
        }

        console.log("찾은 author:", seatData.author);

        // 2. survey 테이블에서 해당 author와 같은 author를 가진 데이터를 가져옵니다.
        const { data: surveyData, error: surveyError } = await supabase
          .from("survey")
          .select("*")
          .eq("author", seatData.author)
          .order("id", { ascending: true });

        if (surveyError) {
          setError("데이터를 불러오는 중 오류가 발생했습니다.");
          console.error(surveyError);
        } else {
          setSurvey(surveyData as SurveyItem[]);
        }
      } catch (error) {
        setError("데이터를 불러오는 중 오류가 발생했습니다.");
        console.error(error);
      }

      setLoading(false);
    };

    checkUserAndFetchData();
  }, [seat]);

  // 질문 유형에 따라 content를 렌더링하는 헬퍼 함수
  const renderQuestionContent = (question: any) => {
    const { type, content: rawContent } = question;
    if (rawContent === null || typeof rawContent === "undefined") {
      return <p style={{ color: "#999" }}>답변 없음</p>;
    }
    let content;
    try {
      content =
        typeof rawContent === "string" ? JSON.parse(rawContent) : rawContent;
    } catch (e) {
      content = rawContent;
    }
    if (
      Array.isArray(content) &&
      content.length > 0 &&
      typeof content[0] === "object" &&
      content[0] !== null &&
      "label" in content[0] &&
      "checked" in content[0]
    ) {
      return (
        <ul style={{ margin: 0, paddingLeft: "20px", listStyle: "none" }}>
          {content.map((option: any, i: number) => (
            <li key={i}>{`${option.checked ? "✅" : "⬜️"} ${
              option.label
            }`}</li>
          ))}
        </ul>
      );
    }
    switch (type) {
      case "one":
      case "two":
      case "seven":
        return <p>{content}</p>;
      case "three":
        if (Array.isArray(content)) {
          return (
            <ul style={{ margin: 0, paddingLeft: "20px", listStyle: "none" }}>
              {content.map((text: string, i: number) => (
                <li key={i}>{`⚪️ ${text}`}</li>
              ))}
            </ul>
          );
        }
        return <p>{String(content)}</p>;
      default:
        return <pre>{JSON.stringify(content, null, 2)}</pre>;
    }
  };

  if (loading)
    return (
      <p style={{ textAlign: "center", padding: "20px" }}>
        결과를 불러오는 중...
      </p>
    );
  if (error)
    return (
      <p style={{ textAlign: "center", padding: "20px", color: "red" }}>
        {error}
      </p>
    );
  if (!survey || survey.length === 0)
    return (
      <p style={{ textAlign: "center", padding: "20px" }}>
        표시할 데이터가 없습니다.
      </p>
    );

  return (
    <div>
      <div className="flex flex-col min-h-[100%-54px] w-full h-fit items-center bg-[#ffd90066] p-10 gap-5">
        <div className="w-[768px] h-auto min-h-[136px] bg-white flex flex-col rounded-sm p-3 justify-center border items-center">
          <h1>결과 보러왔구나?</h1>
          <div className="w-full mt-4">
            {survey.map((item) => {
              const date = new Date(item.created_at);
              const formattedDate = `${date.getFullYear()}년 ${String(
                date.getMonth() + 1
              ).padStart(2, "0")}월 ${String(date.getDate()).padStart(
                2,
                "0"
              )}일 ${String(date.getHours()).padStart(2, "0")}:${String(
                date.getMinutes()
              ).padStart(2, "0")}`;

              return (
                <div
                  key={item.id}
                  style={{
                    border: "1px solid #ccc",
                    padding: "12px",
                    margin: "12px 0",
                    borderRadius: "4px",
                    position: "relative",
                  }}
                >
                  {userId && item.uuid === userId && (
                    <button
                      style={{
                        position: "absolute",
                        top: "12px",
                        right: "12px",
                        padding: "4px 8px",
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      수정
                    </button>
                  )}

                  <p>
                    <strong style={{ display: "inline-block", width: "70px" }}>
                      생성일
                    </strong>
                    : {formattedDate}
                  </p>
                  <p>
                    <strong style={{ display: "inline-block", width: "70px" }}>
                      제목
                    </strong>
                    : {item.title}
                  </p>
                  <p>
                    <strong style={{ display: "inline-block", width: "70px" }}>
                      내용
                    </strong>
                    : {item.title_contents}
                  </p>
                  <div
                    style={{
                      marginTop: "12px",
                      paddingTop: "12px",
                      borderTop: "1px solid #eee",
                    }}
                  >
                    {Array.isArray(item.questions) ? (
                      item.questions.map((question, index) => (
                        <div
                          key={index}
                          style={{
                            backgroundColor: "#f5f5f5",
                            padding: "10px",
                            margin: "8px 0",
                            borderRadius: "4px",
                          }}
                        >
                          <p style={{ margin: 0, fontWeight: "bold" }}>
                            {question.title}
                          </p>
                          <div style={{ margin: "4px 0 0 0" }}>
                            {renderQuestionContent(question)}
                          </div>
                        </div>
                      ))
                    ) : (
                      <pre style={{ margin: 0 }}>
                        {JSON.stringify(item.questions, null, 2)}
                      </pre>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
