"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2Icon } from "lucide-react";

import ShortAnswerInput from "./question-types/ShortAnswerInput";
import EssayAnswerTextarea from "./question-types/EssayAnswerTextarea";
import MultipleChoiceOptions from "./question-types/MultipleChoiceOptions";
import CheckboxOptions from "./question-types/CheckboxOptions";
import DropdownOptions from "./question-types/DropdownOptions";
import FileUploadArea from "./question-types/FileUploadArea";
import BlogAdress from "./question-types/BlogAdress";

const ImageInputArea = ({
  value,
  onChange,
}: {
  value: string[];
  onChange: (newUrls: string[]) => void;
}) => {
  const [images, setImages] = useState(
    value.length > 0
      ? value.map((url) => ({ id: Date.now() + Math.random(), url }))
      : [{ id: Date.now(), url: "" }]
  );

  const addImage = () => {
    const newImages = [...images, { id: Date.now(), url: "" }];
    setImages(newImages);
    onChange(newImages.map((img) => img.url));
  };

  const removeImage = (id: number) => {
    const newImages = images.filter((img) => img.id !== id);
    setImages(newImages);
    onChange(newImages.map((img) => img.url));
  };

  const handleChange = (id: number, value: string) => {
    const newImages = images.map((img) =>
      img.id === id ? { ...img, url: value } : img
    );
    setImages(newImages);
    onChange(newImages.map((img) => img.url));
  };

  return (
    <div className="flex flex-col gap-3">
      {images.map((img, index) => (
        <div key={img.id} className="flex items-center gap-3">
          <Input
            placeholder={`이미지 URL ${index + 1}`}
            value={img.url}
            onChange={(e) => handleChange(img.id, e.target.value)}
            type="url"
          />
          {img.url && (
            <img
              src={img.url}
              alt={`img-${index}`}
              className="w-16 h-16 object-cover rounded border"
              onError={(e) => (e.currentTarget.src = "/fallback.png")}
            />
          )}
          <Trash2Icon
            className="w-4 h-4 text-gray-400 cursor-pointer hover:text-red-500"
            onClick={() => removeImage(img.id)}
          />
        </div>
      ))}
      <button className="text-blue-600 text-sm w-fit mt-1" onClick={addImage}>
        + 이미지 추가
      </button>
    </div>
  );
};

export default function QuestionBoxComponent({
  index,
  question,
  onChange,
}: {
  index: number;
  question: {
    title: string;
    type: string;
    content: any;
  };
  onChange: (index: number, updated: Partial<typeof question>) => void;
}) {
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(index, { title: e.target.value });
  };

  const handleTypeChange = (val: string) => {
    onChange(index, { type: val, content: null });
  };

  const handleContentChange = (val: any) => {
    onChange(index, { content: val });
  };

  const renderQuestionSpecificContent = () => {
    switch (question.type) {
      case "one":
        return (
          <ShortAnswerInput
            value={question.content ?? ""}
            onChange={handleContentChange}
          />
        );
      case "two":
        return (
          <EssayAnswerTextarea
            value={question.content ?? ""}
            onChange={handleContentChange}
          />
        );
      case "three":
        return (
          <MultipleChoiceOptions
            value={question.content ?? ["", ""]}
            onChange={handleContentChange}
          />
        );
      case "four":
        return (
          <CheckboxOptions
            value={
              question.content ?? [
                { label: "", checked: false },
                { label: "", checked: false },
              ]
            }
            onChange={handleContentChange}
          />
        );
      case "five":
        return (
          <DropdownOptions
            value={question.content ?? [{ label: "", checked: false }]}
            onChange={handleContentChange}
          />
        );
      case "six":
        return <FileUploadArea />; // 업로드 기능은 추후 구현 시 상태 연동
      case "seven":
        return <BlogAdress />; // 주소 입력 컴포넌트도 필요시 상태 연동
      case "eight":
        return (
          <ImageInputArea
            value={question.content ?? []}
            onChange={handleContentChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-[768px] bg-white flex flex-col gap-4 rounded-sm p-4 border">
      <div className="flex gap-3 items-center">
        <Input
          placeholder="질문 제목"
          value={question.title}
          onChange={handleTitleChange}
          className="flex-1"
        />
        <Select value={question.type} onValueChange={handleTypeChange}>
          <SelectTrigger className="w-[200px]">
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
            <SelectItem value="eight">이미지</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="my-2">{renderQuestionSpecificContent()}</div>
      <div className="flex justify-end items-center gap-5">
        <button>
          <Trash2Icon className="w-4 h-4 text-gray-400 hover:text-red-500" />
        </button>
      </div>
    </div>
  );
}
