import React from "react";
import { Input } from "@/components/ui/input";
import { Trash2Icon } from "lucide-react";

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

export default CheckboxOptions;
