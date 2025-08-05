import { toast } from "sonner";

export interface AppError {
  code: string;
  message: string;
  details?: unknown;
}

export class ErrorHandler {
  static handle(error: unknown, context: string = "알 수 없는 오류"): AppError {
    const appError: AppError = {
      code: "UNKNOWN_ERROR",
      message: "예상치 못한 오류가 발생했습니다.",
      details: error,
    };

    // Supabase 에러 처리
    if (error?.message) {
      switch (error.message) {
        case "Invalid login credentials":
          appError.code = "AUTH_INVALID_CREDENTIALS";
          appError.message = "이메일 또는 비밀번호가 올바르지 않습니다.";
          break;
        case "Email not confirmed":
          appError.code = "AUTH_EMAIL_NOT_CONFIRMED";
          appError.message =
            "이메일 인증이 완료되지 않았습니다. 이메일을 확인해주세요.";
          break;
        case "User already registered":
          appError.code = "AUTH_USER_EXISTS";
          appError.message = "이미 가입된 이메일입니다.";
          break;
        case "Invalid email":
          appError.code = "AUTH_INVALID_EMAIL";
          appError.message = "유효하지 않은 이메일 형식입니다.";
          break;
        case "Too many requests":
          appError.code = "AUTH_RATE_LIMIT";
          appError.message =
            "너무 많은 요청이 있었습니다. 잠시 후 다시 시도해주세요.";
          break;
        default:
          appError.message = `${context}: ${error.message}`;
      }
    }

    // 네트워크 에러 처리
    if (error?.name === "NetworkError") {
      appError.code = "NETWORK_ERROR";
      appError.message = "네트워크 연결을 확인해주세요.";
    }

    // 개발 환경에서만 콘솔에 상세 에러 출력
    if (process.env.NODE_ENV === "development") {
      console.error(`[${context}]`, error);
    }

    return appError;
  }

  static showToast(error: AppError): void {
    toast.error(error.message);
  }

  static logError(error: AppError, context: string = "앱 오류"): void {
    // 프로덕션에서는 에러 로깅 서비스로 전송
    if (process.env.NODE_ENV === "production") {
      // TODO: 에러 로깅 서비스 연동 (Sentry, LogRocket 등)
      console.error(`[${context}]`, error);
    } else {
      console.error(`[${context}]`, error);
    }
  }
}

// 유틸리티 함수들
export const handleAsyncError = async <T>(
  asyncFn: () => Promise<T>,
  context: string = "비동기 작업"
): Promise<T | null> => {
  try {
    return await asyncFn();
  } catch (error) {
    const appError = ErrorHandler.handle(error, context);
    ErrorHandler.showToast(appError);
    ErrorHandler.logError(appError, context);
    return null;
  }
};
