// 환경변수 검증 및 타입 안전성 보장
const requiredEnvVars = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
} as const;

// 필수 환경변수 검증
Object.entries(requiredEnvVars).forEach(([key, value]) => {
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});

// 타입 안전한 환경변수 객체
export const env = {
  SUPABASE_URL: requiredEnvVars.NEXT_PUBLIC_SUPABASE_URL!,
  SUPABASE_ANON_KEY: requiredEnvVars.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
} as const;

// 환경변수 타입 정의
export type Env = typeof env;
