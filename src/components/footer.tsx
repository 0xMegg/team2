import { Button } from "./ui/button";

export default function Footer() {
  return (
    // 전체
    <div className="h-20 w-full">
      <footer className="h-full w-full bg-amber-300 flex ">
        <div className="h-30 w-full justify-center flex items-center gap-2">
          <p className="text-center flex ">포트폴리오 보기</p>
          <div className="flex gap-2">
            <Button>김준엽</Button>
            <Button>손민준</Button>
            <Button>최준호</Button>
            <Button>김현영</Button>
          </div>
        </div>
        <p className="mt-6 text-xs flex justify-start text-neutral-400">
          &copy; {new Date().getFullYear()}. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
