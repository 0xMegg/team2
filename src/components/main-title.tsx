"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Trash2Icon, Copy, Image } from "lucide-react";
import { useSurveyStore } from "@/store/surveyStore"; // Zustand import 추가

export default function MainTitleComponent() {
  return (
    <>
      {/* 설문 제목 */}
      <div className="w-[768px]  bg-white flex flex-col rounded-sm">
        {/* 설문제목 첫째줄 */}
        <div className="flex w-full p-3">
          <Input
            placeholder="설문제목을 입력하세요"
            className="p-6 w-full h-14"
          />
        </div>
        {/* 설문제목 둘째줄 */}
        <div className="flex w-full p-3">
          <Textarea
            placeholder="설문 세부 설명을 입력하세요"
            className="p-6 w-full h-14"
          />
        </div>
      </div>
    </>
  );
}
