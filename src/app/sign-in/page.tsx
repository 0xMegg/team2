"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

import { supabase } from "@/utils/client";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { toast } from "sonner";
import Link from "next/link";
import EggBackground from "@/components/eggBackGround";
import { useAuthStore } from "@/stores/auth";
import { GuestGuard } from "@/components/auth-guard";

const formSchema = z.object({
  email: z.email({
    message: "올바른 형식의 이메일 주소를 입력해주세요.",
  }),
  password: z.string().min(8, {
    message: "비밀번호는 최소 8자 이상이어야 합니다.",
  }),
});

function SignInContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { login } = useAuthStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        // Supabase 에러 코드에 따른 구체적인 메시지 표시
        let errorMessage = "로그인에 실패했습니다.";

        switch (error.message) {
          case "Invalid login credentials":
            errorMessage = "이메일 또는 비밀번호가 올바르지 않습니다.";
            break;
          case "Email not confirmed":
            errorMessage =
              "이메일 인증이 완료되지 않았습니다. 이메일을 확인해주세요.";
            break;
          case "Too many requests":
            errorMessage =
              "너무 많은 로그인 시도가 있었습니다. 잠시 후 다시 시도해주세요.";
            break;
          default:
            errorMessage = `로그인 오류: ${error.message}`;
        }

        toast.error(errorMessage);
        console.error("로그인 에러:", error);
      } else if (!error && data.user && data.session) {
        // Zustand 스토어에 사용자 정보와 토큰 저장
        const user = {
          id: data.user.id,
          email: data.user.email!,
          name:
            data.user.user_metadata?.username ||
            data.user.email?.split("@")[0] ||
            "사용자",
        };

        const accessToken = data.session.access_token;

        // 인증 스토어에 로그인 정보 저장
        login(user, accessToken);

        toast.success("로그인에 성공했습니다! 🎉");
        router.push("/"); // 메인 페이지로 리다이렉션
        console.log("로그인 성공:", { user, accessToken });
      }
    } catch (error) {
      console.error("로그인 중 오류 발생:", error);
      toast.error("로그인 중 예상치 못한 오류가 발생했습니다.");
    }
  };

  return (
    <div className="flex flex-1 flex-col w-full min-h-[calc(100vh-216px)] items-center justify-center bg-[#ffd90066]">
      <EggBackground />
      <Card className="relative w-full max-w-sm rounded-3xl shadow-xl overflow-hidden">
        <div className="relative z-10">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-yellow-600">
              로그인
            </CardTitle>
            <CardDescription className="text-sm pb-2 text-gray-500">
              로그인을 위한 정보를 입력해주세요.
            </CardDescription>
            <CardAction>
              <Button
                variant="link"
                className="!no-underline transition-all duration-500 ease-in-out bg-yellow-200 text-white hover:scale-105 hover:bg-yellow-300"
                onClick={() => router.push("/sign-up")}
              >
                회원가입
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-3"
              >
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="이메일을 입력해주세요"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="relative">
                        <div className="w-full flex items-center justify-between">
                          <FormLabel>Password</FormLabel>
                          <Link
                            href={"/sign-in/credentials"}
                            className="text-sm no-underline"
                          >
                            비밀번호를 잊어버리셨나요?
                          </Link>
                        </div>
                        <FormControl>
                          <Input
                            placeholder="비밀번호를 입력해주세요."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="transition-all duration-500 ease-in-out bg-yellow-200 text-white hover:scale-105 hover:bg-yellow-300"
                  >
                    로그인
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </div>
      </Card>
    </div>
  );
}

export default function SignIn() {
  return (
    <GuestGuard>
      <SignInContent />
    </GuestGuard>
  );
}
