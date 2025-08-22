# 🪑 후라이이잉 - 좌석 관리 시스템

Next.js와 Supabase를 활용한 실시간 좌석 관리 플랫폼입니다.

## 🚀 기술 스택

### Frontend

- **Next.js 15** - React 기반 풀스택 프레임워크
- **TypeScript** - 타입 안전성 보장
- **Tailwind CSS** - 유틸리티 퍼스트 CSS 프레임워크
- **Radix UI** - 접근성 고려한 UI 컴포넌트
- **Zustand** - 상태 관리 라이브러리

### Backend & Database

- **Supabase** - 백엔드리스 플랫폼
- **PostgreSQL** - 관계형 데이터베이스
- **Supabase Auth** - 인증 시스템
- **Supabase Storage** - 파일 저장소

### 개발 도구

- **ESLint** - 코드 품질 관리
- **PostCSS** - CSS 전처리
- **Turbopack** - 빠른 개발 서버

## ✨ 주요 기능

### 🪑 좌석 관리

- 실시간 좌석 현황 확인
- 좌석 선택 및 예약
- 사용자 프로필 연동

### 👤 사용자 인증

- 이메일/비밀번호 로그인
- 회원가입 및 프로필 설정
- 인증 상태 관리

## 🛠️ 설치 및 실행

### 1. 저장소 클론

```bash
git clone <repository-url>
cd team2
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 환경변수 설정

`.env.local` 파일을 생성하고 다음 변수들을 설정하세요:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 📁 프로젝트 구조

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # 루트 레이아웃
│   ├── page.tsx           # 메인 페이지
│   ├── sign-in/           # 로그인 페이지
│   └── sign-up/           # 회원가입 페이지
├── components/             # 재사용 가능한 컴포넌트
│   ├── ui/                # 기본 UI 컴포넌트
│   ├── auth-guard.tsx     # 인증 가드
│   └── seatsTable.tsx     # 좌석 테이블
├── lib/                   # 유틸리티 함수
│   ├── constants.ts       # 상수 정의
│   └── utils.ts           # 유틸리티 함수
├── stores/                # 상태 관리
│   └── auth.ts            # 인증 상태 관리
└── utils/                 # 클라이언트 설정
    └── client.ts          # Supabase 클라이언트
```

## 🔧 개발 가이드

### 코드 스타일

- TypeScript 엄격 모드 사용
- ESLint 규칙 준수
- 컴포넌트별 파일 분리

### 상태 관리

- Zustand를 통한 전역 상태 관리
- React Hook Form을 통한 폼 관리

### 에러 처리

- 중앙화된 에러 핸들링
- 사용자 친화적 에러 메시지
- 개발/프로덕션 환경별 로깅

## 🚀 배포

### Vercel 배포 (권장)

1. GitHub 저장소 연결
2. 환경변수 설정
3. 자동 배포 설정

### 수동 배포

```bash
npm run build
npm start
```

## 📝 라이센스

MIT License

## 👥 팀원

- [팀원 1] - Frontend 개발
- [팀원 2] - Backend 개발
- [팀원 3] - UI/UX 디자인

---

**개발 기간**: 2024년 7월  
**프로젝트 유형**: 팀 프로젝트 (포트폴리오용 개선)
