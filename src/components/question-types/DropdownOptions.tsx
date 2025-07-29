"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Trash2Icon } from "lucide-react";

type Props = {
  value: string[];
  onChange: (newOptions: string[]) => void;
};

export default function DropdownOptions({ value, onChange }: Props) {
  const [options, setOptions] = useState<string[]>(
    value.length ? value : ["", ""]
  );

  // options 상태 변경될 때마다 부모에 전달
  useEffect(() => {
    onChange(options);
  }, [options]);

  const handleChange = (index: number, val: string) => {
    const updated = [...options];
    updated[index] = val;
    setOptions(updated);
  };

  const addOption = () => {
    setOptions([...options, ""]);
  };

  const removeOption = (index: number) => {
    if (options.length <= 1) return alert("최소 1개 항목은 필요합니다.");
    const updated = [...options];
    updated.splice(index, 1);
    setOptions(updated);
  };

  return (
    <div className="flex flex-col gap-2">
      {options.map((opt, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <Input
            placeholder={`드롭다운 항목 ${idx + 1}`}
            value={opt}
            onChange={(e) => handleChange(idx, e.target.value)}
          />
          <Trash2Icon
            className="w-4 h-4 text-gray-400 cursor-pointer hover:text-red-500"
            onClick={() => removeOption(idx)}
          />
        </div>
      ))}
      <button
        className="text-blue-600 text-sm w-fit mt-1"
        onClick={addOption}
        type="button"
      >
        + 항목 추가
      </button>
    </div>
  );
}
