import MainPartComponent from "@/components/main-part";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { supabase } from "@/utils/client";

export default async function result() {
  // 1. 기존처럼 데이터베이스에서 데이터를 가져옵니다.
  let { data: test, error } = await supabase
    .from("test")
    .select("*")
    .order("index", { ascending: true });

  if (error) return <p>데이터를 불러오는 중 오류가 발생했습니다.</p>;
  if (!test || test.length === 0) return <p>표시할 데이터가 없습니다.</p>;

  // 2. '서명된 URL' 생성 로직 추가
  // 데이터를 렌더링하기 전에, 이미지 타입인 항목에 대해 임시 접근 URL을 미리 생성합니다.
  if (test) {
    for (const item of test) {
      if (item.type === "image" && item.content) {
        // 60초 동안만 유효한 임시 URL을 비동기적으로 생성합니다.
        const { data: signedUrlData } = await supabase.storage
          .from("picture")
          .createSignedUrl(item.content, 60); // 60 = 60초

        // 생성된 URL을 item 객체의 새로운 속성(signedUrl)에 저장합니다.
        if (signedUrlData) {
          item.signedUrl = signedUrlData.signedUrl;
        }
      }
    }
  }

  return (
    <div>
      <div className="flex flex-col min-h-[100%-54px] w-full h-fit items-center bg-[#ffd90066] p-10 gap-5">
        <div className="w-[768px] h-auto min-h-[136px] bg-white flex flex-col rounded-sm p-3 justify-center border items-center">
          <h1>결과 보러왔구나?</h1>

          <div className="w-full mt-4">
            {test.map((item) => (
              <div
                key={item.id}
                style={{
                  border: "1px solid #ccc",
                  padding: "10px",
                  margin: "10px 0",
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
                      // 3. 위에서 생성한 '서명된 URL(signedUrl)'을 src에 사용합니다.
                      src={item.signedUrl || item.content} // 만약 signedUrl이 없다면 원래 content를 사용합니다.
                      // 이미지를 제대로 확인하기 위해 크기를 조절했습니다.
                      className="mt-2 w-auto h-auto max-w-full"
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
        </div>
      </div>
    </div>
  );
}
