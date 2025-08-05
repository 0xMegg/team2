"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import Image from "next/image";

interface SeatData {
  id: number;
  seat: number;
  profileImage?: string;
  userName: string;
  title?: string;
}

const formSchema = z
  .object({
    email: z.string().email({
      message: "유효한 이메일 주소를 입력해주세요.",
    }),
    username: z.string().min(2, {
      message: "본명은 최소 2자 이상이어야 합니다.",
    }),
    title: z.string().max(5, {
      message: "칭호는 최대 5자 이하이어야 합니다.",
    }),
    password: z.string().min(6, {
      message: "비밀번호는 최소 6자 이상이어야 합니다.",
    }),
    confirmPassword: z.string().min(6, {
      message: "비밀번호는 최소 6자 이상이어야 합니다.",
    }),
    terms: z.boolean().refine((val) => val, {
      message: "이용약관에 동의해야 합니다.",
    }),
    profileImage: z.any().optional(),
    seat: z.number().refine((val) => val > 0, {
      message: "좌석을 선택해주세요.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["confirmPassword"],
  });

function SignUpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [seatsData, setSeatsData] = useState<SeatData[]>([]);

  // URL에서 좌석 정보 가져오기
  const seatFromUrl = searchParams.get("seat");
  const initialSeat = seatFromUrl ? parseInt(seatFromUrl) : 0;

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      username: "",
      title: "",
      password: "",
      confirmPassword: "",
      terms: false,
      profileImage: "",
      seat: initialSeat,
    },
  });

  // 기존 좌석 데이터 가져오기
  async function readSeatsData() {
    const { data: seats, error } = await supabase.from("userInfo").select("*");
    if (error) {
      console.error("Error reading seats:", error);
    } else {
      console.log("seats:", seats);
      setSeatsData(seats || []);
    }
  }

  // URL에서 좌석 정보가 변경되면 폼 업데이트
  useEffect(() => {
    if (seatFromUrl) {
      form.setValue("seat", parseInt(seatFromUrl));
    }
  }, [seatFromUrl, form]);

  // 컴포넌트 마운트 시 좌석 데이터 가져오기
  useEffect(() => {
    readSeatsData();
  }, []);

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // 회원가입 처리 (이미지 없이 먼저)
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            username: values.username,
            title: values.title,
            terms: values.terms,
            seat: values.seat,
          },
        },
      });

      if (error) {
        // Supabase 에러 코드에 따른 구체적인 메시지 표시
        let errorMessage = "회원가입에 실패했습니다.";

        switch (error.message) {
          case "User already registered":
            errorMessage = "이미 가입된 이메일입니다.";
            break;
          case "Invalid email":
            errorMessage = "유효하지 않은 이메일 형식입니다.";
            break;
          case "Unable to validate email address: invalid format":
            errorMessage = "이메일 형식이 올바르지 않습니다.";
            break;
          default:
            errorMessage = `회원가입 오류: ${error.message}`;
        }

        toast.error(errorMessage);
        console.error("회원가입 에러:", error);
        return;
      }

      // 회원가입 성공 후 이미지 업로드
      if (data.user && values.profileImage instanceof File) {
        const user = data.user;
        let profileImageUrl = "";

        try {
          const fileExt = values.profileImage.name.split(".").pop();
          const filePath = `profile-images/${user.id}/${Date.now()}.${fileExt}`;

          const { error: imageError } = await supabase.storage
            .from("files")
            .upload(filePath, values.profileImage, {
              cacheControl: "3600",
              upsert: false,
            });

          if (imageError) {
            console.error("이미지 업로드 실패:", imageError);
            // 이미지 업로드 실패해도 회원가입은 성공으로 처리
            toast.warning(
              "회원가입은 완료되었지만 이미지 업로드에 실패했습니다."
            );
          } else {
            const {
              data: { publicUrl },
            } = supabase.storage.from("files").getPublicUrl(filePath);
            profileImageUrl = publicUrl;
          }
        } catch (imageError) {
          console.error("이미지 업로드 중 오류:", imageError);
          toast.warning(
            "회원가입은 완료되었지만 이미지 업로드에 실패했습니다."
          );
        }

        // userInfo 테이블에 좌석 정보 저장 (이미지 URL 포함)
        const { error: seatError } = await supabase.from("userInfo").insert([
          {
            id: user.id,
            seat: values.seat,
            userName: values.username,
            title: values.title,
            profileImage: profileImageUrl,
          },
        ]);

        if (seatError) {
          console.error(
            "userInfo 테이블에 좌석 정보 저장에 실패했습니다:",
            seatError
          );
          toast.error("좌석 정보 저장에 실패했습니다.");
          return;
        }
      } else if (data.user) {
        // 이미지가 없는 경우
        const { error: seatError } = await supabase.from("userInfo").insert([
          {
            id: data.user.id,
            seat: values.seat,
            userName: values.username,
            title: values.title,
            profileImage: "",
          },
        ]);

        if (seatError) {
          console.error(
            "userInfo 테이블에 좌석 정보 저장에 실패했습니다:",
            seatError
          );
          toast.error("좌석 정보 저장에 실패했습니다.");
          return;
        }
      }

      toast.success("회원가입이 완료되었습니다! 이메일을 확인해주세요. 📧");
      router.push("/sign-in");
    } catch (error) {
      console.error("회원가입 중 예상치 못한 오류:", error);
      toast.error("회원가입 중 예상치 못한 오류가 발생했습니다.");
    }
  };

  const [previewUrl, setPreviewUrl] = useState<string | null>(null); //이미지

  return (
    <Form {...form}>
      <div className="h-[calc(100vh-120px)] flex items-center justify-center bg-[#ffd90066] px-4">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-4xl mx-auto p-6 bg-white flex flex-col md:flex-row gap-6"
        >
          {/* 이메일 입력 */}
          <div className="w-80 md:w-1/2 flex flex-col gap-1">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>이메일</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="깃허브에 사용 중인 이메일을 입력해주세요"
                      {...field}
                    />
                  </FormControl>
                  <div className="min-h-[12px]">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            {/* 사용자명 입력 */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>본명</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <div className="min-h-[12px]">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            {/* 칭호 입력 */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>칭호</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="칭호는 미입력시 자동으로 부여됩니다"
                      {...field}
                    />
                  </FormControl>
                  <div className="min-h-[12px]">
                    <FormMessage />
                  </div>
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
                    <Input type="password" {...field} />
                  </FormControl>
                  <div className="min-h-[12px]">
                    <FormMessage />
                  </div>
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
                    <Input type="password" {...field} />
                  </FormControl>
                  <div className="min-h-[12px]">
                    <FormMessage />
                  </div>
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
                  <div className="min-h-[12px]">
                    <FormMessage />
                  </div>
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
                          field.onChange(file); // 파일 객체 자체를 저장
                          const url = URL.createObjectURL(file); // 미리보기용 URL 생성
                          setPreviewUrl(url); // 상태 저장
                        }
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    프로필 이미지를 업로드해주세요
                  </FormDescription>
                  <div className="min-h-[12px]">
                    <FormMessage />
                  </div>
                  {/* ✅ 미리보기 박스 추가 */}
                  {previewUrl && (
                    <div className="mt-4 w-32 h-32 border rounded-md overflow-hidden">
                      <Image
                        src={previewUrl}
                        alt="프로필 미리보기"
                        className="object-cover w-full h-full"
                        width={128}
                        height={128}
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
                      seatsData={seatsData}
                    />
                  </FormControl>
                  <FormDescription>앉은 자리를 선택해주세요</FormDescription>
                  <div className="min-h-[12px]">
                    <FormMessage />
                  </div>
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

export default function SignUp() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignUpContent />
    </Suspense>
  );
}
