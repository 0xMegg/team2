import React from "react";
import { Input } from "@/components/ui/input";
import { Trash2Icon } from "lucide-react";

const MultipleChoiceOptions = () => {
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

export default MultipleChoiceOptions;
