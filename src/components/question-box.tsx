"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Trash2Icon, Copy, Image } from "lucide-react";

import ShortAnswerInput from "./question-types/ShortAnswerInput";
import EssayAnswerTextarea from "./question-types/EssayAnswerTextarea";
import MultipleChoiceOptions from "./question-types/MultipleChoiceOptions";
import CheckboxOptions from "./question-types/CheckboxOptions";
import DropdownOptions from "./question-types/DropdownOptions";
import FileUploadArea from "./question-types/FileUploadArea";
import BlogAdress from "./question-types/BlogAdress";

export default function QuestionBoxComponent() {
  const [selectedQuestionType, setSelectedQuestionType] = useState("one");

  // selectedQuestionType 값에 따라 다른 컴포넌트를 렌더링하는 함수
  const renderQuestionSpecificContent = () => {
    switch (selectedQuestionType) {
      case "one": // 주관식
        return <ShortAnswerInput />;
      case "two": // 서술형
        return <EssayAnswerTextarea />;
      case "three": // 객관식
        return <MultipleChoiceOptions />;
      case "four": // 체크박스
        return <CheckboxOptions />;
      case "five": // 드롭박스
        return <DropdownOptions />;
      case "six": // 파일 업로드
        return <FileUploadArea />;
      case "seven": // 주소
        return <BlogAdress />;
      default:
        return null; // 기본적으로는 아무것도 렌더링하지 않습니다.
    }
  };

  return (
    <div className="w-[768px] h-auto min-h-[136px] bg-white flex flex-col rounded-sm p-3 justify-center border">
      {/* 질문 헤더 */}
      <div className="w-full flex justify-center gap-3">
        <Input placeholder="질문 제목" />
        <Select
          value={selectedQuestionType} // 현재 선택된 값 (상태)을 여기에 넣어줍니다.
          onValueChange={setSelectedQuestionType} // 선택이 바뀔 때 이 함수를 호출하여 상태를 업데이트합니다.
        >
          <SelectTrigger className="w-[280px]">
            <SelectValue placeholder="질문 유형" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="one">주관식</SelectItem>
            <SelectItem value="two">서술형</SelectItem>
            <SelectItem value="three">객관식</SelectItem>
            <SelectItem value="four">체크박스</SelectItem>
            <SelectItem value="five">드롭박스</SelectItem>
            <SelectItem value="six">파일 업로드</SelectItem>
            <SelectItem value="seven">주소</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {/* 질문 내용 */}
      <div className="w-full my-3">{renderQuestionSpecificContent()}</div>
      {/* 질문 푸터 */}
      <div className="w-full flex justify-end gap-3 px-5 my-1">
        <button>
          <Trash2Icon className="w-4 h-4" />
        </button>
        <div className="px-3 flex items-center space-x-2 border-l border-gray-300">
          <Label htmlFor="required-switch">필수</Label>
          <Switch id="required-switch" />
        </div>
      </div>
    </div>
  );
}
