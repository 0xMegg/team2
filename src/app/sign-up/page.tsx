"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useEffect } from "react";
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
import EggBackground from "@/components/eggBackGround";

interface SeatData {
  id: number;
  seat: number;
  profileImage?: string;
  userName: string;
}

const formSchema = z
  .object({
    email: z.string().email({
      message: "유효한 이메일 주소를 입력해주세요.",
    }),
    username: z.string().min(2, {
      message: "사용자명은 최소 2자 이상이어야 합니다.",
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

export default function SignUp() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [thumbnail, setThumbnail] = useState<string | File | null>(null); // 썸네일은 파일 업로드를 통해 설정할 수 있습니다. 임시 저장 같은 경우에는 null일 수 있습니다.
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
      password: "",
      confirmPassword: "",
      terms: false,
      profileImage: "",
      seat: initialSeat,
    },
  });

  // 기존 좌석 데이터 가져오기
  async function readSeatsData() {
    const { data: seats, error } = await supabase.from("seats").select("*");
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
      // 임시 유저 ID 생성 (실제 회원가입 후 얻을 수 있음)
      const tempUserId = `temp_${Date.now()}`;
      let profileImageUrl = "";

      // 이미지가 있다면 먼저 업로드
      if (values.profileImage instanceof File) {
        const fileExt = values.profileImage.name.split(".").pop();
        const filePath = `profile-images/${tempUserId}/${Date.now()}.${fileExt}`;

        const { data: imageData, error: imageError } = await supabase.storage
          .from("files")
          .upload(filePath, values.profileImage, {
            cacheControl: "3600",
            upsert: false,
          });

        if (imageError) {
          toast.error("파일 업로드에 실패했습니다.");
          return;
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from("files").getPublicUrl(filePath);
        profileImageUrl = publicUrl;
      }

      // 회원가입 처리 (이미지 URL 포함)
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            username: values.username,
            terms: values.terms,
            seat: values.seat,
            profileImage: profileImageUrl,
          },
        },
      });

      // 회원가입 후...
      if (data.user) {
        const userId = data.user.id; // 자동 생성된 uuid

        // seats 테이블에 같은 uuid(fk)로 insert
        const { error: seatError } = await supabase.from("seats").insert([
          {
            id: userId, // auth.users.id와 동일한 값을 fk로 사용!
            seat: values.seat,
            profileImage: profileImageUrl,
            userName: values.username,
          },
        ]);
        if (seatError) {
          toast.error("seats 테이블에 좌석 정보 저장에 실패했습니다.");
          console.log(seatError);
          return;
        }
      }

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

      if (data.user) {
        toast.success("회원가입이 완료되었습니다! 이메일을 확인해주세요. 📧");
        router.push("/sign-in");
      }
    } catch (error) {
      console.error("회원가입 중 예상치 못한 오류:", error);
      toast.error("회원가입 중 예상치 못한 오류가 발생했습니다.");
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
          {/* 이메일 입력 */}
          <div className="w-80 md:w-1/2 space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>이메일</FormLabel>
                  <FormControl>
                    <Input placeholder="이메일을 입력해주세요" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* 사용자명 입력 */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>사용자명</FormLabel>
                  <FormControl>
                    <Input placeholder="사용자명을 입력해주세요" {...field} />
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
                          field.onChange(file); // 파일 객체 자체를 저장
                          const url = URL.createObjectURL(file); // 미리보기용 URL 생성
                          setPreviewUrl(url); // 상태 저장
                          setThumbnail(file);
                        }
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    프로필 이미지를 업로드해주세요
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
                      seatsData={seatsData}
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
