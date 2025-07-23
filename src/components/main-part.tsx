import React from "react";

type MainPartComponentProps = {
  children: React.ReactNode;
  onAddItem: () => void;
};

export default function MainPartComponent({
  children,
  onAddItem,
}: MainPartComponentProps) {
  return (
    <div className="flex flex-col w-full h-fit items-center bg-[#ffd90066] p-10 gap-5">
      {children}
      <div className="w-[768px] flex justify-between">
        <button
          className="bg-amber-300 w-20 h-8 rounded-xl text-white"
          onClick={onAddItem}
        >
          항목추가
        </button>
        <button className="bg-amber-300 w-20 h-8 rounded-xl text-white">
          제출하기
        </button>
      </div>
    </div>
  );
}
