import { Input } from "@/app/components/ui/input";

export default function TestComponent() {
  return (
    <div className="flex flex-col w-full h-full items-center bg-purple-300 p-10">
      {/* 설문 제목 */}
      <div className="w-[768px] h-34 min-h-34 bg-white flex flex-col rounded-sm">
        {/* 설문제목 첫째줄 */}
        <div className="flex w-full p-3">
          <Input className="p-6 w-full h-14" />
        </div>
      </div>
      asdf
    </div>
  );
}
