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
      username: "un",
      password: "ps",
      confirmPassword: "ps",
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* 아이디 입력 */}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
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
                <Input type="password" placeholder="Password" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
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
                  placeholder="Confirm Password"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This is your public display name.
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
                You agree to our Terms of Service and Privacy Policy.
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
                You must select a profile image.
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
                <SeatsTable seat={field.value} onSeatChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
