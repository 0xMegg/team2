"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

interface TermsDialogProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export default function TermsDialog({
  checked,
  onCheckedChange,
}: TermsDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="text-sm text-yellow-700 hover:text-yellow-800 underline p-0 h-auto font-normal"
        >
          이용약관 및 개인정보 처리방침 보기
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">
            이용약관 및 개인정보 처리방침
          </DialogTitle>
          <DialogDescription className="text-center">
            아래 내용을 자세히 읽고 동의해주세요
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 text-sm leading-relaxed">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-yellow-700 mb-2">
              안녕하세요! 👋
            </h2>
            <p className="text-lg text-gray-700">
              이곳은 우리 스나이퍼팩토리 한컴 AI아카데미 2기 여러분의 자랑
              공간입니다.
            </p>
            <p className="text-sm text-gray-600 mt-2">
              아래 약관에 동의해 주시면 여러분의 자리에 알 수 없는 Error가 뜨지
              않아요!
            </p>
          </div>

          <section>
            <h3 className="font-semibold text-lg mb-3 text-yellow-700">
              1. 회원가입 📝
            </h3>
            <div className="space-y-2">
              <p>
                • 실명, 깃허브 이메일, 원하는 칭호, 프로필 사진, 그리고 자랑하고
                싶은 URL을 부탁해요.
              </p>
              <p>
                • 비밀번호는 supabase auth로 안전하게 관리되고 있으니
                안심하세요.
              </p>
            </div>
          </section>

          <section>
            <h3 className="font-semibold text-lg mb-3 text-yellow-700">
              2. 개인정보 🔒
            </h3>
            <div className="space-y-2">
              <p>• 회원가입시 수집된 정보는 단순 공유용으로만 사용됩니다.</p>
              <p>• 삭제된 정보는 즉시 사라지며, 우리의 뇌 속에만 남습니다.</p>
            </div>
          </section>

          <section>
            <h3 className="font-semibold text-lg mb-3 text-yellow-700">
              3. 공유된 URL 🌐
            </h3>
            <div className="space-y-2">
              <p>
                • 공유해주신 URL로 발생하는 모든 문제는 여러분에게 있습니다.
              </p>
              <p>• 서로에게 개발자로서 공유하고 싶은 내용만 담아주세요.</p>
            </div>
          </section>

          <section>
            <h3 className="font-semibold text-lg mb-3 text-yellow-700">
              4. 서비스 지속성 ⚡
            </h3>
            <div className="space-y-2">
              <p>
                • 사용 기술 변경 (supabase → mysql) 등의 이유로 간혹 서비스가
                멈출 수 있습니다.
              </p>
            </div>
          </section>

          <section>
            <h3 className="font-semibold text-lg mb-3 text-yellow-700">
              5. 약관 변경은 미리 알릴게요 📢
            </h3>
            <div className="space-y-2">
              <p>
                • 이 약관도 가끔 업데이트돼요. 바뀌면 공지할게요. 놓치지 마세요!
              </p>
              <p>
                • 공지는 디스코드를 생각 중이나, 여러분의 메일로 갈 수도
                있답니다.
              </p>
            </div>
          </section>

          <section>
            <h3 className="font-semibold text-lg mb-3 text-yellow-700">
              6. 모든 분 함께 잘 사용했으면 좋겠어요 🤝
            </h3>
            <div className="space-y-2">
              <p>• 다툼이 생기면 머리카락 싸움으로 조정합니다.</p>
            </div>
          </section>

          <div className="text-center mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-lg font-semibold text-yellow-800">
              위 내용에 동의하신다면 동의 후 가입 부탁드려요 ◠‿◠
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 pt-4 border-t">
          <Checkbox
            id="terms-agreement"
            checked={checked}
            onCheckedChange={onCheckedChange}
          />
          <label
            htmlFor="terms-agreement"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            위 이용약관 및 개인정보 처리방침에 동의합니다
          </label>
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            닫기
          </Button>
          <Button
            onClick={() => setIsOpen(false)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            확인
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
