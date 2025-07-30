"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
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

import SeatsTable from "@/components/seatsTable";
import { supabase } from "@/utils/client";
import EggBackground from "@/components/EggBackGround";

const formSchema = z.object({
  email: z.email({
    message: "Invalid email address.",
  }),
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(2, {
    message: "Password must be at least 2 characters.",
  }),
  confirmPassword: z.string().min(2, {
    message: "Password must be at least 2 characters.",
  }),
  terms: z.boolean().refine((val) => val, {
    message: "You must accept the terms and conditions.",
  }),
  profileImage: z.any().refine((val) => val, {
    message: "You must select a profile image.",
  }),
  seat: z.number().refine((val) => val, {
    message: "You must select a seat.",
  }),
});

export default function SignUp() {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
      terms: true,
      profileImage: "",
      seat: 0,
    },
  });

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            username: values.username,
            terms: values.terms,
            profileImage: values.profileImage,
            seat: values.seat,
          },
        },
      });

      if (data) {
        console.log(data);
        toast.success("Sign up successful");
      }

      if (error) {
        toast.error("Sign up failed");
        throw error;
      }
    } catch (error) {
      console.error("catch error", error);
    }
  };

  const [previewUrl, setPreviewUrl] = useState<string | null>(null); //이미지

  return (
    <Form {...form}>
      <div className="min-h-screen flex items-center justify-center bg-[#ffd90066] px-4">
        <EggBackground />
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow flex flex-col md:flex-row gap-6"
        >
          {/* 아이디 입력 */}
          <div className="w-80 md:w-1/2 space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>사용자</FormLabel>
                  <FormControl>
                    <Input placeholder="아이디를 입력해주세요" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* 비밀번호 입력 */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>비밀번호</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="비밀번호를 입력해주세요"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* 비밀번호 확인 */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>비밀번호 확인</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="비밀번호를 다시 입력해주세요"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* 약관 동의 */}
            <FormField
              control={form.control}
              name="terms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>이용약관 동의</FormLabel>
                  <FormControl>
                    <Checkbox
                      id="terms"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormDescription>
                    이용약관 및 개인정보 처리방침에 동의합니다.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* 프로필 이미지 */}
            <FormField
              control={form.control}
              name="profileImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>프로필 이미지</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          field.onChange(file.name);
                          const url = URL.createObjectURL(file); // 미리보기용 URL 생성
                          setPreviewUrl(url); // 상태 저장
                        }
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    (선택)이미지를 업로드해주세요
                  </FormDescription>
                  <FormMessage />
                  {/* ✅ 미리보기 박스 추가 */}
                  {previewUrl && (
                    <div className="mt-4 w-32 h-32 border rounded-md overflow-hidden">
                      <img
                        src={previewUrl}
                        alt="프로필 미리보기"
                        className="object-cover w-full h-full"
                      />
                    </div>
                  )}
                </FormItem>
              )}
            />
          </div>
          {/* 좌석 선택 */}
          <div className="w-full md:w-2/3 flex flex-col justify-between space-y-6 ">
            <FormField
              control={form.control}
              name="seat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className=" font-bold text-yellow-500">
                    좌석 선택
                  </FormLabel>
                  <FormControl>
                    <SeatsTable
                      seat={field.value}
                      onSeatChange={field.onChange}
                    />
                  </FormControl>
                  <FormDescription>앉은 자리를 선택해주세요</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button
                className="self-end transition-all duration-500 ease-in-out bg-yellow-200 text-white hover:scale-105 hover:bg-yellow-300"
                type="submit"
              >
                완료
              </Button>
            </div>
          </div>
        </form>
      </div>
    </Form>
  );
}
