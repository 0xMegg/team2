"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// ✅ props 타입 정의
type Props = {
  title: string;
  onTitleChange: (val: string) => void;
  titleContents: string;
  onTitleContentsChange: (val: string) => void;
};

export default function MainTitleComponent({
  title,
  onTitleChange,
  titleContents,
  onTitleContentsChange,
}: Props) {
  return (
    <div className="w-[768px] bg-white flex flex-col rounded-sm p-4 gap-4">
      {/* 설문 제목 */}
      <Input
        placeholder="설문 제목을 입력하세요"
        className="w-full h-14 px-4"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
      />

      {/* 설문 설명 */}
      <Textarea
        placeholder="설문 설명을 입력하세요"
        className="w-full h-20 px-4"
        value={titleContents}
        onChange={(e) => onTitleContentsChange(e.target.value)}
      />
    </div>
  );
}
