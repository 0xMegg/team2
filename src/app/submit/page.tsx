"use client";
import { useState } from "react";
import { supabase } from "@/utils/client";

export default function SubmitPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [seatNumber, setSeatNumber] = useState(1);
  const [agreedTerms, setAgreedTerms] = useState(false);

  const handleSubmit = async () => {
    console.log("입력값 확인", {
      email,
      password,
      profileImage,
      seatNumber,
      agreedTerms,
    });

    const { data, error } = await supabase.from("test").insert([
      {
        email,
        password,
        profile_image: profileImage,
        seat_number: seatNumber,
        agreed_terms: agreedTerms,
      },
    ]);

    if (error) {
      console.error("업로드 실패:", error.message);
    } else {
      console.log("업로드 성공:", data);
    }
  };

  return (
    <div className="flex flex-1 flex-col w-full min-h-[calc(100vh-216px)] items-center justify-center bg-[#ffd90066] ">
      <input placeholder="이메일" onChange={(e) => setEmail(e.target.value)} />
      <input
        placeholder="비밀번호"
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        placeholder="프로필 이미지 URL"
        onChange={(e) => setProfileImage(e.target.value)}
      />
      <input
        type="number"
        placeholder="좌석번호"
        onChange={(e) => setSeatNumber(Number(e.target.value))}
      />
      <label>
        약관동의
        <input
          type="checkbox"
          onChange={(e) => setAgreedTerms(e.target.checked)}
        />
      </label>

      <button onClick={handleSubmit}>제출하기</button>
    </div>
  );
}
