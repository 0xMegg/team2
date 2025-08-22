"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import EggBackground from "@/components/eggBackground";
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
import { useAuthStore } from "@/stores/auth";
import AuthGuard from "@/components/auth-guard";

interface SeatData {
  id: number;
  seat: number;
  profileImage?: string;
  userName: string;
  title?: string;
}

const formSchema = z.object({
  email: z.string().email({
    message: "유효한 이메일 주소를 입력해주세요.",
  }),
  username: z.string().min(2, {
    message: "본명은 최소 2자 이상이어야 합니다.",
  }),
  title: z.string().max(5, {
    message: "칭호는 최대 5자 이하이어야 합니다.",
  }),
  sharedUrl: z
    .string()
    .url({
      message: "유효한 URL을 입력해주세요.",
    })
    .optional()
    .or(z.literal("")),
  profileImage: z.any().optional(),
  seat: z.number().refine((val) => val > 0, {
    message: "좌석을 선택해주세요.",
  }),
});

function ProfileEditContent() {
  const router = useRouter();
  const { user, updateUser } = useAuthStore();
  const [seatsData, setSeatsData] = useState<SeatData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // 폼 정의
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      username: "",
      title: "",
      sharedUrl: "",
      profileImage: "",
      seat: 0,
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

  // 사용자 정보 가져오기
  async function loadUserData() {
    if (!user) {
      return;
    }

    try {
      // userInfo 테이블에서 사용자 정보 가져오기
      const { data: userInfo, error } = await supabase
        .from("userInfo")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("사용자 정보 로드 실패:", error);
        toast.error("사용자 정보를 불러오는데 실패했습니다.");
        return;
      }

      // 폼에 기존 데이터 설정
      form.setValue("email", user.email || "");
      form.setValue("username", userInfo.userName || "");
      form.setValue("title", userInfo.title || "");
      form.setValue("sharedUrl", userInfo.url || userInfo.sharedUrl || "");
      form.setValue("seat", userInfo.seat || 0);

      // 프로필 이미지 미리보기 설정
      if (userInfo.profileImage) {
        setPreviewUrl(userInfo.profileImage);
      }
    } catch (error) {
      console.error("사용자 정보 로드 중 오류:", error);
      toast.error("사용자 정보를 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  }

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    readSeatsData();
    loadUserData();
  }, []);

  // 제출 핸들러
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      return;
    }

    try {
      let profileImageUrl = "";

      // 새 이미지가 업로드된 경우
      if (values.profileImage instanceof File) {
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
          toast.error("이미지 업로드에 실패했습니다.");
          return;
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from("files").getPublicUrl(filePath);
        profileImageUrl = publicUrl;
      }

      // 현재 사용자의 기존 좌석 정보 가져오기
      const { data: currentUserInfo } = await supabase
        .from("userInfo")
        .select("seat")
        .eq("id", user.id)
        .single();

      const oldSeat = currentUserInfo?.seat;
      const newSeat = values.seat;

      // 좌석이 변경된 경우, 기존 좌석을 비우고 새 좌석이 이미 사용 중인지 확인
      if (oldSeat !== newSeat) {
        // 새 좌석이 이미 사용 중인지 확인
        const { data: existingSeatUser } = await supabase
          .from("userInfo")
          .select("id")
          .eq("seat", newSeat)
          .single();

        if (existingSeatUser && existingSeatUser.id !== user.id) {
          toast.error("이미 사용 중인 좌석입니다.");
          return;
        }
      }

      // userInfo 테이블 업데이트
      const updateData: {
        userName: string;
        title: string;
        seat: number;
        url?: string;
        profileImage?: string;
      } = {
        userName: values.username,
        title: values.title,
        seat: values.seat,
      };

      if (values.sharedUrl) {
        updateData.url = values.sharedUrl;
      }

      if (profileImageUrl) {
        updateData.profileImage = profileImageUrl;
      }

      const { error: updateError } = await supabase
        .from("userInfo")
        .update(updateData)
        .eq("id", user.id);

      if (updateError) {
        console.error("사용자 정보 업데이트 실패:", updateError);
        toast.error("정보 업데이트에 실패했습니다.");
        return;
      }

      // 로컬 상태 업데이트
      updateUser({
        name: values.username,
      });

      toast.success("회원 정보가 성공적으로 수정되었습니다! 🎉");
      router.push("/");
    } catch (error) {
      console.error("정보 수정 중 예상치 못한 오류:", error);
      toast.error("정보 수정 중 예상치 못한 오류가 발생했습니다.");
    }
  };

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-120px)] flex items-center justify-center bg-[#ffd90066] px-4 relative">
        <EggBackground />
        <div className="w-full max-w-4xl mx-auto p-6 bg-white flex items-center justify-center relative z-10">
          <div className="text-lg">로딩 중...</div>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <div className="h-[calc(100vh-120px)] flex items-center justify-center bg-[#ffd90066] px-4 relative">
        <EggBackground />
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-4xl mx-auto p-6 bg-white flex flex-col md:flex-row gap-6 relative z-10"
        >
          {/* 이메일 입력 (읽기 전용) */}
          <div className="w-80 md:w-1/2 flex flex-col gap-1">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>이메일</FormLabel>
                  <FormControl>
                    <Input {...field} disabled className="bg-gray-100" />
                  </FormControl>
                  <FormDescription>
                    이메일은 변경할 수 없습니다.
                  </FormDescription>
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
            {/* 공유하고 싶은 URL 입력 */}
            <FormField
              control={form.control}
              name="sharedUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>공유하고 싶은 URL</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
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
                          field.onChange(file);
                          const url = URL.createObjectURL(file);
                          setPreviewUrl(url);
                        }
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    새로운 프로필 이미지를 업로드해주세요
                  </FormDescription>
                  <div className="min-h-[12px]">
                    <FormMessage />
                  </div>
                  {/* 미리보기 박스 */}
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
                      isEditMode={true}
                    />
                  </FormControl>
                  <FormDescription>앉은 자리를 선택해주세요</FormDescription>
                  <div className="min-h-[12px]">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/")}
                className="transition-all duration-500 ease-in-out hover:scale-105"
              >
                취소
              </Button>
              <Button
                className="transition-all duration-500 ease-in-out bg-yellow-200 text-white hover:scale-105 hover:bg-yellow-300"
                type="submit"
              >
                수정 완료
              </Button>
            </div>
          </div>
        </form>
      </div>
    </Form>
  );
}

export default function ProfileEdit() {
  return (
    <AuthGuard>
      <Suspense fallback={<div>Loading...</div>}>
        <ProfileEditContent />
      </Suspense>
    </AuthGuard>
  );
}
