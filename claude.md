# 일기짠 웹 프론트엔드

## 프로젝트 개요
아동 AI 일기장 앱의 웹 버전. 백엔드는 Spring Boot로 완성되어 있음.
Base URL: https://ilgijjan.store/api
인증: accessToken을 Authorization 헤더에 Bearer로 첨부. 열린 자물쇠 API 제외.

## 기술 스택
- Vite + React 18 + TypeScript
- Tailwind CSS
- React Router v6
- TanStack Query (React Query)
- Jotai
- Axios
- React Hook Form

## 아키텍처 원칙
1. Page는 얇게 - 조립만, 로직 금지
2. 로직은 Hook - 비즈니스 로직은 Custom Hook으로
3. API는 분리 - 컴포넌트에서 직접 axios 호출 금지, xxxApi.ts 통해서만
4. 타입 먼저 - API 연동 전에 types.ts 먼저 작성
5. Dumb 컴포넌트 우선 - props만 받도록 설계 후 Container 연결
6. 공통 컴포넌트 먼저 - shared/ui 먼저 만들고 시작

## 상태 관리 전략
- 서버 데이터 → React Query (일기 목록, 유저 정보 등)
- 전역 클라이언트 상태 → Jotai (로그인 유저, 일기 작성 draft)
- 로컬 UI 상태 → useState (모달, 탭 등)
- 폼 → React Hook Form

## 네이밍 규칙
- 컴포넌트: PascalCase.tsx (DiaryCard.tsx)
- Hook: use + camelCase.ts (useDiaries.ts)
- API: camelCase + Api.ts (diaryApi.ts)
- 타입: camelCase.types.ts (diary.types.ts)
- Page: PascalCase + Page.tsx (DiaryListPage.tsx)

## 패키지 구조
src/
├── app/
│   ├── router.tsx
│   ├── queryClient.ts
│   └── store.ts
├── features/
│   ├── auth/
│   │   ├── api/authApi.ts
│   │   ├── components/SocialLoginButton.tsx
│   │   ├── hooks/useAuth.ts
│   │   └── types/auth.types.ts
│   ├── diary/
│   │   ├── api/diaryApi.ts
│   │   ├── components/
│   │   │   ├── DiaryCard.tsx
│   │   │   ├── DiaryDetail.tsx
│   │   │   ├── DiaryEditor.tsx
│   │   │   ├── WeatherSelector.tsx
│   │   │   └── MoodSelector.tsx
│   │   ├── hooks/
│   │   │   ├── useDiaries.ts
│   │   │   ├── useDiary.ts
│   │   │   └── useCreateDiary.ts
│   │   └── types/diary.types.ts
│   ├── user/
│   │   ├── api/userApi.ts
│   │   ├── components/
│   │   │   ├── ProfileCard.tsx
│   │   │   └── SettingItem.tsx
│   │   ├── hooks/useUser.ts
│   │   └── types/user.types.ts
│   ├── like/
│   │   ├── api/likeApi.ts
│   │   ├── components/LikeButton.tsx
│   │   └── hooks/useLike.ts
│   ├── billing/
│   │   ├── api/billingApi.ts
│   │   ├── components/ProductCard.tsx
│   │   └── hooks/useBilling.ts
│   └── storage/
│       ├── api/storageApi.ts
│       └── hooks/useImageUpload.ts
├── pages/
│   ├── LoginPage.tsx
│   ├── OnboardingNamePage.tsx
│   ├── OnboardingFriendsPage.tsx
│   ├── DiaryListPage.tsx
│   ├── PublicFeedPage.tsx
│   ├── DiaryDetailPage.tsx
│   ├── DiaryNewPhotoPage.tsx
│   ├── DiaryNewWeatherPage.tsx
│   ├── DiaryNewMoodPage.tsx
│   ├── DiaryNewWritePage.tsx
│   ├── ProfilePage.tsx
│   └── BillingPage.tsx
└── shared/
    ├── components/
    │   ├── ui/
    │   │   ├── Button.tsx
    │   │   ├── Input.tsx
    │   │   ├── Modal.tsx
    │   │   ├── LoadingSpinner.tsx
    │   │   └── AudioPlayer.tsx
    │   └── layout/
    │       ├── Header.tsx
    │       └── BottomNav.tsx
    ├── hooks/useToast.ts
    ├── lib/
    │   ├── httpClient.ts
    │   └── tokenStorage.ts
    └── types/common.types.ts

## 라우팅
/login                 → LoginPage            (인증 불필요)
/onboarding/name       → OnboardingNamePage   (인증 불필요)
/onboarding/friends    → OnboardingFriendsPage
--- PrivateRoute 아래 ---
/                      → DiaryListPage
/feed                  → PublicFeedPage
/diary/:id             → DiaryDetailPage
/diary/new/photo       → DiaryNewPhotoPage
/diary/new/weather     → DiaryNewWeatherPage
/diary/new/mood        → DiaryNewMoodPage
/diary/new/write       → DiaryNewWritePage
/profile               → ProfilePage
/billing               → BillingPage

## API 도메인
- AUTH: /auth/login, /auth/logout, /auth/withdraw, /auth/reissue
- DIARY: /diaries, /diaries/{diaryId}, /diaries/public, /diaries/{diaryId}/publish, /diaries/{diaryId}/unpublish
- LIKE: /diaries/{diaryId}/likes
- USER: /users/me, /users/me/name, /users/me/character, /users/me/notification
- STORAGE: /storage/upload
- BILLING: /billing/products, /billing/verify
- FCM: /fcm/tokens

## 일기 작성 멀티스텝
Jotai diaryDraftAtom에 단계별 저장 후 마지막에 한번에 POST /diaries
1단계 /diary/new/photo   → imageUrl
2단계 /diary/new/weather → weather
3단계 /diary/new/mood    → mood
4단계 /diary/new/write   → content → API 호출

## 작업 규칙
- 새 파일/폴더 생성 시 이 문서의 패키지 구조를 업데이트할 것
- 아키텍처 결정사항이 바뀌면 해당 섹션을 업데이트할 것
- 라우팅 추가 시 라우팅 섹션을 업데이트할 것