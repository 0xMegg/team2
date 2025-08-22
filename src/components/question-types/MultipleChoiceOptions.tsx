import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Trash2Icon } from "lucide-react";

type Props = {
  value: string[]; // 보기 목록 (예: ["옵션 1", "옵션 2"])
  onChange: (newOptions: string[]) => void; // 변경 시 부모 컴포넌트로 전달
};

const MultipleChoiceOptions = ({ value, onChange }: Props) => {
  const [options, setOptions] = useState<string[]>(
    value.length ? value : ["", ""]
  );

  // 내부 상태가 바뀔 때마다 부모 컴포넌트에 전달
  useEffect(() => {
    onChange(options);
  }, [onChange, options]);

  const handleOptionChange = (index: number, newValue: string) => {
    const newOptions = [...options];
    newOptions[index] = newValue;
    setOptions(newOptions);
  };

  const handleAddOption = () => {
    setOptions([...options, ""]);
  };

  const handleRemoveOption = (index: number) => {
    if (options.length <= 1) return;
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  return (
    <div className="flex flex-col gap-2">
      {options.map((opt, index) => (
        <div key={index} className="flex items-center gap-2">
          <Input
            placeholder={`보기 ${index + 1}`}
            value={opt}
            onChange={(e) => handleOptionChange(index, e.target.value)}
          />
          <Trash2Icon
            className="w-4 h-4 text-gray-400 cursor-pointer hover:text-red-500"
            onClick={() => handleRemoveOption(index)}
          />
        </div>
      ))}
      <button
        className="text-blue-600 text-sm w-fit mt-1"
        onClick={handleAddOption}
      >
        + 보기 추가
      </button>
    </div>
  );
};

export default MultipleChoiceOptions;
