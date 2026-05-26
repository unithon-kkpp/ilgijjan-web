import { lazy } from 'react'
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import { tokenStorage } from '@/shared/lib/tokenStorage'

// 레이아웃과 첫 진입 화면(로그인)은 즉시 로드.
import MobileLayout from '@/shared/components/layout/MobileLayout'
import LoginPage from '@/pages/LoginPage'

// 나머지 페이지는 해당 경로에 들어갈 때 각자 별도 파일로 불러옴(코드 스플리팅).
// 로딩되는 짧은 순간은 MobileLayout 의 Suspense 스피너가 가린다.
const KakaoCallbackPage = lazy(() => import('@/pages/KakaoCallbackPage'))
const OnboardingNamePage = lazy(() => import('@/pages/OnboardingNamePage'))
const OnboardingFriendsPage = lazy(() => import('@/pages/OnboardingFriendsPage'))
const DiaryListPage = lazy(() => import('@/pages/DiaryListPage'))
const PublicFeedPage = lazy(() => import('@/pages/PublicFeedPage'))
const DiaryDetailPage = lazy(() => import('@/pages/DiaryDetailPage'))
const DiaryNewEntryPage = lazy(() => import('@/pages/DiaryNewEntryPage'))
const DiaryNewPhotoPage = lazy(() => import('@/pages/DiaryNewPhotoPage'))
const DiaryNewWeatherPage = lazy(() => import('@/pages/DiaryNewWeatherPage'))
const DiaryNewMoodPage = lazy(() => import('@/pages/DiaryNewMoodPage'))
const DiaryNewWritePage = lazy(() => import('@/pages/DiaryNewWritePage'))
const DiaryNewLoadingPage = lazy(() => import('@/pages/DiaryNewLoadingPage'))
const ProfilePage = lazy(() => import('@/pages/ProfilePage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

function PrivateRoute() {
  if (!tokenStorage.get()) return <Navigate to="/login" replace />
  return <Outlet />
}

export const router = createBrowserRouter([
  {
    element: <MobileLayout />,
    children: [
      // 인증 불필요
      { path: '/login', element: <LoginPage /> },
      { path: '/oauth/kakao', element: <KakaoCallbackPage /> },
      { path: '/onboarding/name', element: <OnboardingNamePage /> },
      { path: '/onboarding/friends', element: <OnboardingFriendsPage /> },

      // 로그인 필요
      {
        element: <PrivateRoute />,
        children: [
          { path: '/', element: <DiaryListPage /> },
          { path: '/feed', element: <PublicFeedPage /> },
          { path: '/diary/:id', element: <DiaryDetailPage /> },
          { path: '/diary/new', element: <DiaryNewEntryPage /> },
          { path: '/diary/new/photo', element: <DiaryNewPhotoPage /> },
          { path: '/diary/new/weather', element: <DiaryNewWeatherPage /> },
          { path: '/diary/new/mood', element: <DiaryNewMoodPage /> },
          { path: '/diary/new/write', element: <DiaryNewWritePage /> },
          { path: '/diary/new/loading/:id', element: <DiaryNewLoadingPage /> },
          { path: '/profile', element: <ProfilePage /> },
        ],
      },

      // 위 어떤 경로에도 안 맞는 모든 URL → 404. PrivateRoute 밖에 두어야
      // 로그인 안 한 유저가 오타 URL 로 와도 로그인으로 튕기지 않고 404 를 본다.
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
