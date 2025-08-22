"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { supabase } from "@/utils/client";
import { useRouter } from "next/navigation";
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
import EggBackground from "@/components/eggBackground";

const formSchema = z.object({
  email: z.string().email({
    message: "올바른 형식의 이메일 주소를 입력해주세요.",
  }),
});

function CredentialsContent() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        values.email,
        {
          redirectTo: `${window.location.origin}/sign-in`,
        }
      );

      if (error) {
        toast.error(`비밀번호 재설정 이메일 전송 실패: ${error.message}`);
        console.error("비밀번호 재설정 에러:", error);
      } else {
        toast.success(
          "비밀번호 재설정 이메일을 전송했습니다. 이메일을 확인해주세요. 📧"
        );
        router.push("/sign-in");
      }
    } catch (error) {
      console.error("비밀번호 재설정 중 예상치 못한 오류:", error);
      toast.error("비밀번호 재설정 중 예상치 못한 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
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
                비밀번호 재설정
              </CardTitle>
              <CardDescription className="text-sm sm:text-base pb-2 text-gray-500">
                가입한 이메일 주소를 입력하시면 비밀번호 재설정 링크를
                보내드립니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex flex-col gap-6"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>이메일</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="가입한 이메일을 입력해주세요"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="transition-all duration-500 ease-in-out bg-yellow-200 text-white hover:scale-105 hover:bg-yellow-300"
                  >
                    {isLoading ? "전송 중..." : "비밀번호 재설정 이메일 전송"}
                  </Button>
                  <div className="text-center">
                    <Link
                      href="/sign-in"
                      className="text-sm text-gray-600 hover:text-yellow-600 transition-colors"
                    >
                      로그인으로 돌아가기
                    </Link>
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

export default function Credentials() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CredentialsContent />
    </Suspense>
  );
}
