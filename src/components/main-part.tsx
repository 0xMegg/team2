import { useAuthStore } from "@/stores/auth";

type MainPartComponentProps = {
  children: React.ReactNode;
  onAddItem: () => void;
  onSubmit: () => void; // ✅ 추가
};

export default function MainPartComponent({
  children,
  onAddItem,
  onSubmit,
}: MainPartComponentProps) {
  const user = useAuthStore((state) => state.user);
  return (
    <div className="flex flex-1 flex-col w-full min-h-[calc(100vh-216px)] items-center bg-[#ffd90066] p-10 gap-5 overflow-auto">
      {user && (
        <div className="w-[768px] text-right text-gray-700 text-sm mb-2">
          <span className="font-semibold">{user.name}</span>님의 자기소개 폼!💪🏿
        </div>
      )}
      {children}
      <div className="w-[768px] flex justify-between">
        <button
          className="bg-amber-300 w-20 h-8 rounded-xl text-white cursor-pointer"
          onClick={onAddItem}
        >
          항목추가
        </button>
        <button
          className="bg-amber-300 w-20 h-8 rounded-xl text-white cursor-pointer"
          onClick={onSubmit} // ✅ 연결
        >
          제출하기
        </button>
      </div>
    </div>
  );
}
