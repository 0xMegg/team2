import MainPartComponent from "@/components/main-part";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { supabase } from "@/utils/client";

export default async function result() {
  // 1. 데이터베이스에서 데이터를 가져옵니다.
  let { data: survey, error } = await supabase
    .from("survey")
    .select("*")
    .order("id", { ascending: true });

  if (error) return <p>데이터를 불러오는 중 오류가 발생했습니다.</p>;
  if (!survey || survey.length === 0) return <p>표시할 데이터가 없습니다.</p>;

  // 2. 이미지 타입에 대한 서명된 URL 생성 로직 (필요시 사용)
  // ...

  // 질문 유형에 따라 content를 렌더링하는 헬퍼 함수
  const renderQuestionContent = (question) => {
    const { type, content: rawContent } = question;

    if (rawContent === null || typeof rawContent === "undefined") {
      return <p style={{ color: "#999" }}>답변 없음</p>;
    }

    // 데이터가 문자열 형태의 JSON일 수 있으므로, 먼저 객체/배열로 변환합니다.
    let content;
    try {
      content =
        typeof rawContent === "string" ? JSON.parse(rawContent) : rawContent;
    } catch (e) {
      content = rawContent; // 변환 실패 시, 원본 텍스트를 그대로 사용
    }

    // 데이터의 '구조'를 먼저 확인해서 체크박스/드롭다운인지 똑똑하게 판단합니다.
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
          {content.map((option, i) => (
            <li key={i}>{`${option.checked ? "✅" : "⬜️"} ${
              option.label
            }`}</li>
          ))}
        </ul>
      );
    }

    // 구조로 판단되지 않은 경우, 기존처럼 type으로 분기합니다.
    switch (type) {
      case "one":
      case "two":
      case "seven":
        return <p>{content}</p>;

      // === 여기가 객관식(three)을 수정한 부분입니다! ===
      case "three":
        if (Array.isArray(content)) {
          return (
            <ul style={{ margin: 0, paddingLeft: "20px", listStyle: "none" }}>
              {content.map((text, i) => (
                // 라디오 버튼 아이콘(⚪️)을 앞에 붙여서 표시
                <li key={i}>{`⚪️ ${text}`}</li>
              ))}
            </ul>
          );
        }
        return <p>{String(content)}</p>;
      // ============================================

      case "six":
        return (
          <a
            href={content}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {content}
          </a>
        );

      case "eight":
        if (Array.isArray(content)) {
          return (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {content.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt={`uploaded-image-${i}`}
                  style={{
                    width: "150px",
                    height: "150px",
                    objectFit: "cover",
                    borderRadius: "4px",
                    border: "1px solid #eee",
                  }}
                  onError={(e) =>
                    (e.currentTarget.src =
                      "https://placehold.co/150x150/eee/ccc?text=Error")
                  }
                />
              ))}
            </div>
          );
        }
        return (
          <img
            src={content}
            alt="uploaded-image"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        );

      default:
        // 위 모든 경우에 해당하지 않으면, 원본 내용을 그대로 보여줍니다.
        if (typeof content === "string") {
          return <p>{content}</p>;
        }
        // 디버깅을 위해 객체/배열은 JSON 문자열로 표시합니다.
        return (
          <pre
            style={{
              margin: 0,
              whiteSpace: "pre-wrap",
              wordBreak: "break-all",
            }}
          >
            {JSON.stringify(content, null, 2)}
          </pre>
        );
    }
  };

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
                  }}
                >
                  {/* 기본 정보는 그대로 표시 */}
                  <p>
                    <strong style={{ display: "inline-block", width: "70px" }}>
                      id
                    </strong>
                    : {item.id}
                  </p>
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

                  {/* 질문 목록을 표시하는 부분 */}
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
