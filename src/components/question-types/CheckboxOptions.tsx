"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Trash2Icon } from "lucide-react";

type Option = {
  label: string;
  checked: boolean;
};

type Props = {
  value: Option[];
  onChange: (val: Option[]) => void;
};

export default function CheckboxOptions({ value, onChange }: Props) {
  const [options, setOptions] = useState<Option[]>(
    value.length > 0 ? value : [{ label: "", checked: false }]
  );

  useEffect(() => {
    onChange(options);
  }, [onChange]);

  const updateLabel = (index: number, newLabel: string) => {
    const updated = [...options];
    updated[index].label = newLabel;
    setOptions(updated);
  };

  const toggleCheck = (index: number) => {
    const updated = [...options];
    updated[index].checked = !updated[index].checked;
    setOptions(updated);
  };

  const addOption = () => {
    setOptions([...options, { label: "", checked: false }]);
  };

  const removeOption = (index: number) => {
    if (options.length <= 1) return alert("최소 하나는 필요합니다.");
    const updated = [...options];
    updated.splice(index, 1);
    setOptions(updated);
  };

  return (
    <div className="flex flex-col gap-2">
      {options.map((opt, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <input
            type="checkbox"
            className="w-4 h-4"
            checked={opt.checked}
            onChange={() => toggleCheck(idx)}
          />
          <Input
            placeholder={`옵션 ${idx + 1}`}
            value={opt.label}
            onChange={(e) => updateLabel(idx, e.target.value)}
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
        + 옵션 추가
      </button>
    </div>
  );
}
