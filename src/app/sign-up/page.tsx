"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
      email: "finero91@gmail.com",
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

  return (
    <Form {...form}>
      <div className="flex flex-col min-h-[100%-54px] w-full h-fit items-center bg-[#ffd90066] p-10 gap-5">
        <div className="w-[768px] h-auto min-h-[136px] bg-white flex flex-col rounded-sm p-3 justify-center border items-center">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* 아이디 입력 */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="ID를 입력해주세요" {...field} />
                  </FormControl>
                  <FormDescription>
                    당신의 ID입니다. 앞으로의 활동은 ID로 진행될 거예요.
                  </FormDescription>
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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="비밀번호를 입력해주세요"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    당신의 비밀번호입니다. 안전하게 관리해주세요.
                  </FormDescription>
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
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="비밀번호를 다시 입력해주세요"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    비밀번호를 다시 입력해서 확인할게요.
                  </FormDescription>
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
                  <FormLabel>Terms and Conditions</FormLabel>
                  <FormControl>
                    <Checkbox
                      id="terms"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormDescription>
                    약관 및 개인정보 보호정책에 동의하고 열심히 활동할게요.
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
                  <FormLabel>Profile Image</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          field.onChange(file.name);
                        }
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    프사입니다. 예쁘게 나온걸로 올려주세요.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* 좌석 선택 */}
            <FormField
              control={form.control}
              name="seat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Seat</FormLabel>
                  <FormControl>
                    <SeatsTable
                      seat={field.value}
                      onSeatChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </div>
      </div>
    </Form>
  );
}
