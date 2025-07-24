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
    <div className="flex flex-1 flex-col w-full min-h-[calc(100vh-216px)] items-center bg-[#ffd90066] p-10 gap-5 overflow-auto">
      {children}
      <div className="w-[768px] flex justify-between">
        <button
          className="bg-amber-300 w-20 h-8 rounded-xl text-white cursor-pointer"
          onClick={onAddItem}
        >
          항목추가
        </button>
        <button className="bg-amber-300 w-20 h-8 rounded-xl text-white cursor-pointer">
          제출하기
        </button>
      </div>
    </div>
  );
}
