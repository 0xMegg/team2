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
import { useEffect } from "react";

import { supabase } from "@/utils/client";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { toast } from "sonner";
import Link from "next/link";
import { useAuthStore } from "@/stores/auth";
import EggBackground from "@/components/eggBackground";
import { useState } from "react";

const formSchema = z.object({
  email: z.email({
    message: "올바른 형식의 이메일 주소를 입력해주세요.",
  }),
  password: z.string().min(6, {
    message: "비밀번호는 최소 6자 이상이어야 합니다.",
  }),
});

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = useAuthStore((state) => state.login);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [isResendingEmail, setIsResendingEmail] = useState(false);

  // URL에서 redirect 파라미터 가져오기
  const redirectPath = searchParams.get("redirect") || "/";

  // 이미 로그인된 상태이고 redirect 파라미터가 있으면 해당 경로로 이동
  useEffect(() => {
    if (isAuthenticated && redirectPath !== "/") {
      router.push(redirectPath);
    }
  }, [isAuthenticated, redirectPath, router]);

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
        // 이메일 인증 상태 확인
        if (!data.user.email_confirmed_at) {
          toast.error(
            "이메일 인증이 완료되지 않았습니다. 이메일을 확인해주세요."
          );
          return;
        }

        // Supabase 세션은 클라이언트가 관리하고 화면에는 최소 사용자 정보만 보관한다.
        const user = {
          id: data.user.id,
          email: data.user.email!,
          name: data.user.user_metadata?.username || data.user.email!,
        };

        login(user);

        toast.success("로그인되었습니다! 🎉");
        router.push(redirectPath);
      }
    } catch (error) {
      console.error("로그인 중 예상치 못한 오류:", error);
      toast.error("로그인 중 예상치 못한 오류가 발생했습니다.");
    }
  };

  // 이메일 인증 재전송 함수
  const resendVerificationEmail = async (email: string) => {
    setIsResendingEmail(true);
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email,
      });

      if (error) {
        toast.error(`이메일 재전송 실패: ${error.message}`);
      } else {
        toast.success(
          "인증 이메일을 다시 전송했습니다. 이메일을 확인해주세요. 📧"
        );
      }
    } catch (error) {
      console.error("이메일 재전송 중 오류:", error);
      toast.error("이메일 재전송 중 오류가 발생했습니다.");
    } finally {
      setIsResendingEmail(false);
    }
  };

  return (
    <div className="h-[calc(100vh-120px)] bg-[#ffd90066] flex flex-col relative">
      <EggBackground />
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative z-10">
        <Card className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg rounded-3xl shadow-xl overflow-hidden">
          <div className="relative">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl sm:text-3xl font-bold text-yellow-600">
                로그인
              </CardTitle>
              <CardDescription className="text-sm sm:text-base pb-2 text-gray-500">
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
                              type="password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* 이메일 인증 재전송 버튼 */}
                    <div className="text-center">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={isResendingEmail}
                        onClick={() =>
                          resendVerificationEmail(form.getValues("email"))
                        }
                        className="text-xs text-gray-600 hover:text-yellow-600 transition-colors"
                      >
                        {isResendingEmail ? "전송 중..." : "인증 이메일 재전송"}
                      </Button>
                    </div>
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
    </div>
  );
}

export default function SignIn() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInContent />
    </Suspense>
  );
}
