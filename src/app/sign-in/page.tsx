"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

function SingIn() {
  const router = useRouter();

  return (
    <div className="flex flex-1 flex-col w-full min-h-[calc(100vh-216px)] items-center justify-center bg-[#ffd90066] ">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>로그인</CardTitle>
          <CardDescription>로그인을 위한 정보를 입력해주세요.</CardDescription>
          <CardAction>
            <Button
              variant="link"
              className="cursor-pointer"
              onClick={() => router.push("/sign-up")}
            >
              회원가입
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="ID">ID</Label>
                <Input
                  id="ID"
                  type="ID"
                  placeholder="아이디를 입력해주세요"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    비밀번호를 잊어버리셨나요?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="비밀번호를 입력해주세요"
                  required
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button type="submit" className="w-full cursor-pointer">
            로그인
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default SingIn;
