import React from "react";

type MainPartComponentProps = {
  children: React.ReactNode;
};

export default function MainPartComponent({
  children,
}: MainPartComponentProps) {
  return (
    <div className="flex flex-col w-full h-full items-center bg-purple-300 p-10 gap-5">
      {children}
    </div>
  );
}
