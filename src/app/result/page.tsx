import MainPartComponent from "@/components/main-part";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { supabase } from "@/utils/client";

export default async function result() {
  let { data: test, error } = await supabase
    .from("test")
    .select("*")
    .order("index", { ascending: true });

  console.log(test);

  if (error) return <p>데이터를 불러오는 중 오류가 발생했습니다.</p>;
  if (!test || test.length === 0) return <p>표시할 데이터가 없습니다.</p>;

  return (
    <div>
      <div>
        {test.map((item) => (
          <div
            key={item.id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              margin: "10px",
            }}
          >
            <p>
              <strong>ID:</strong> {item.id}
            </p>
            <p>
              <strong>제목:</strong> {item.title}
            </p>{" "}
            <p>
              <strong>생성일:</strong>{" "}
              {new Date(item.created_at).toLocaleString("ko-KR")}
            </p>{" "}
            {item.type === "image" ? (
              <div>
                <strong>내용:</strong>
                <img
                  src={(() => {
                    // getPublicUrl의 결과로 나온 객체에서 publicUrl 속성을 추출합니다.
                    const { data } = supabase.storage
                      .from("picture")
                      .getPublicUrl(item.content);

                    // 콘솔에 생성된 전체 URL을 출력합니다.
                    console.log("생성된 이미지 URL:", data.publicUrl);

                    return data.publicUrl;
                  })()}
                  alt={item.title || "이미지"}
                  className="mt-2 w-[30px] h-[30px] max-w-md"
                />
              </div>
            ) : (
              <p>
                <strong>내용:</strong> {item.content}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-col min-h-[100%-54px] w-full h-fit items-center bg-[#ffd90066] p-10 gap-5">
        <div className="w-[768px] h-auto min-h-[136px] bg-white flex flex-col rounded-sm p-3 justify-center border items-center">
          <h1>결과 보러왔구나?</h1>
          <div className="w-full h-20 border-2 rounded-lg">
            <p>항목1</p>
          </div>
        </div>
      </div>
    </div>
  );
}
