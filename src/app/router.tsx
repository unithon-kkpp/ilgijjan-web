import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import { tokenStorage } from '@/shared/lib/tokenStorage'

import MobileLayout from '@/shared/components/layout/MobileLayout'
import LoginPage from '@/pages/LoginPage'
import KakaoCallbackPage from '@/pages/KakaoCallbackPage'
import OnboardingNamePage from '@/pages/OnboardingNamePage'
import OnboardingFriendsPage from '@/pages/OnboardingFriendsPage'
import DiaryListPage from '@/pages/DiaryListPage'
import PublicFeedPage from '@/pages/PublicFeedPage'
import DiaryDetailPage from '@/pages/DiaryDetailPage'
import DiaryNewEntryPage from '@/pages/DiaryNewEntryPage'
import DiaryNewPhotoPage from '@/pages/DiaryNewPhotoPage'
import DiaryNewWeatherPage from '@/pages/DiaryNewWeatherPage'
import DiaryNewMoodPage from '@/pages/DiaryNewMoodPage'
import DiaryNewWritePage from '@/pages/DiaryNewWritePage'
import DiaryNewLoadingPage from '@/pages/DiaryNewLoadingPage'
import ProfilePage from '@/pages/ProfilePage'
import NotFoundPage from '@/pages/NotFoundPage'

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
