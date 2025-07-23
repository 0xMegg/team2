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

const ShortAnswerInput = () => (
  <Input placeholder="짧은 주관식 답변" className="w-full h-30" />
);

const EssayAnswerTextarea = () => (
  <Textarea placeholder="긴 서술형 답변" className="min-h-[100px]" />
);

const MultipleChoiceOptions = () => {
  // 나중에 보기를 추가/삭제하는 기능도 여기에 들어갈 수 있습니다.
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Input placeholder="보기 1" />
        <Trash2Icon className="w-4 h-4 text-gray-400 cursor-pointer hover:text-red-500" />
      </div>
      <div className="flex items-center gap-2">
        <Input placeholder="보기 2" />
        <Trash2Icon className="w-4 h-4 text-gray-400 cursor-pointer hover:text-red-500" />
      </div>
      <button className="text-blue-600 text-sm w-fit mt-1">+ 보기 추가</button>
    </div>
  );
};

// 4. 체크박스 질문 컴포넌트 (객관식과 유사)
const CheckboxOptions = () => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <input type="checkbox" className="w-4 h-4" />
        <Input placeholder="옵션 1" />
        <Trash2Icon className="w-4 h-4 text-gray-400 cursor-pointer hover:text-red-500" />
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" className="w-4 h-4" />
        <Input placeholder="옵션 2" />
        <Trash2Icon className="w-4 h-4 text-gray-400 cursor-pointer hover:text-red-500" />
      </div>
      <button className="text-blue-600 text-sm w-fit mt-1">+ 옵션 추가</button>
    </div>
  );
};

// 5. 드롭박스 질문 컴포넌트 (객관식과 유사)
const DropdownOptions = () => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Input placeholder="드롭다운 항목 1" />
        <Trash2Icon className="w-4 h-4 text-gray-400 cursor-pointer hover:text-red-500" />
      </div>
      <div className="flex items-center gap-2">
        <Input placeholder="드롭다운 항목 2" />
        <Trash2Icon className="w-4 h-4 text-gray-400 cursor-pointer hover:text-red-500" />
      </div>
      <button className="text-blue-600 text-sm w-fit mt-1">+ 항목 추가</button>
    </div>
  );
};

// 6. 파일 업로드 컴포넌트
const FileUploadArea = () => (
  <div className="w-full p-5 border-dashed border-2 border-gray-300 rounded-md flex flex-col justify-center items-center text-gray-500 text-center">
    <span>파일을 여기에 드롭하거나</span>
    <input type="file" className="hidden" id="file-upload-input" />
    <label
      htmlFor="file-upload-input"
      className="text-blue-600 cursor-pointer mt-1"
    >
      클릭하여 업로드하세요.
    </label>
  </div>
);

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
      default:
        return null; // 기본적으로는 아무것도 렌더링하지 않습니다.
    }
  };

  return (
    <div className="w-[768px] h-auto min-h-[136px] bg-white flex flex-col rounded-sm p-3 justify-center border">
      {/* 질문 헤더 */}
      <div className="w-full flex justify-center gap-3">
        <Input placeholder="질문 제목" />
        <button className="flex flex-col justify-center">
          <Image className="w-4 h-4" />
        </button>
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
          </SelectContent>
        </Select>
      </div>
      {/* 질문 내용 */}
      <div className="w-full my-3">{renderQuestionSpecificContent()}</div>
      {/* 질문 푸터 */}
      <div className="w-full flex justify-end gap-3 px-5 my-1">
        <button>
          <Copy className="w-4 h-4" />
        </button>
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
