"use client";

import { useAuthStore } from "@/stores/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/sign-in");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">인증이 필요합니다</h2>
            <p className="text-gray-600">로그인 페이지로 이동합니다...</p>
          </div>
        </div>
      )
    );
  }

  return <>{children}</>;
}

// 로그인된 사용자는 접근할 수 없는 페이지를 위한 컴포넌트
export function GuestGuard({ children, fallback }: AuthGuardProps) {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">
              이미 로그인되어 있습니다
            </h2>
            <p className="text-gray-600">메인 페이지로 이동합니다...</p>
          </div>
        </div>
      )
    );
  }

  return <>{children}</>;
}
