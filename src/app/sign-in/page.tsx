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

const formSchema = z.object({
  email: z.email({
    message: "올바른 형식의 이메일 주소를 입력해주세요.",
  }),
  password: z.string().min(8, {
    message: "비밀번호는 최소 8자 이상이어야 합니다.",
  }),
});

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });

    if (error) {
      toast.error("회원정보가 일치하지 않습니다.");
    } else if (!error && data.user && data.session) {
      toast.success("로그인을 성공하였습니다.");
      router.push("/"); // 메인 페이지로 리다이렉션
      console.log(data);

      // supabase에서 사용자 정보를 받는 function 만들기.
      // Zustand 측으로 Supabase 쪽에서 전달받은 User 정보를 Store에 저장한다.
    }
  };
  // const signIn = async () => {
  //   const { data, error } = await supabase.auth.signInWithPassword({
  //     email,
  //     password,
  //   });

  //   if (data) {
  //     console.log(data);
  //   }

  //   if (error) {
  //   }

  //   if (error) {
  //     console.error("catch error", error);
  //   }

  return (
    <div className="flex flex-1 flex-col w-full min-h-[calc(100vh-216px)] items-center justify-center bg-[#ffd90066]">
      <Card className="relative w-full max-w-sm rounded-3xl shadow-xl overflow-hidden">
        <div className="absolute inset-0 pointer-events-none z-0">
          <img
            src="/favicon.png"
            alt="계란1"
            className="absolute top-4 left-4 w-8 opacity-20"
          />
          <img
            src="/favicon.png"
            alt="계란2"
            className="absolute top-16 right-8 w-10 opacity-30"
          />
          <img
            src="/favicon.png"
            alt="계란3"
            className="absolute bottom-12 left-10 w-12 opacity-25"
          />
          <img
            src="/favicon.png"
            alt="계란4"
            className="absolute bottom-4 right-6 w-9 opacity-20"
          />

          <img
            src="/favicon.png"
            alt="계란5"
            className="absolute top-1/2 left-1 w-9 opacity-25"
          />
          <img
            src="/favicon.png"
            alt="계란6"
            className="absolute top-1/3 right-1/4 w-11 opacity-15"
          />
          <img
            src="/favicon.png"
            alt="계란7"
            className="absolute bottom-1/2 left-1/3 w-7 opacity-30"
          />
          <img
            src="/favicon.png"
            alt="계란8"
            className="absolute bottom-20 right-1/5 w-10 opacity-20"
          />
          <img
            src="/favicon.png"
            alt="계란9"
            className="absolute top-[70%] left-[45%] w-8 opacity-25"
          />
          <img
            src="/favicon.png"
            alt="계란10"
            className="absolute bottom-[30%] right-[35%] w-12 opacity-30"
          />
        </div>

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
