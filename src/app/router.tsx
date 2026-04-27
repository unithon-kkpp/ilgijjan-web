import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import { useAtomValue } from 'jotai'
import { currentUserAtom } from './store'

import MobileLayout from '@/shared/components/layout/MobileLayout'
import LoginPage from '@/pages/LoginPage'
import KakaoCallbackPage from '@/pages/KakaoCallbackPage'
import OnboardingNamePage from '@/pages/OnboardingNamePage'
import OnboardingFriendsPage from '@/pages/OnboardingFriendsPage'
import DiaryListPage from '@/pages/DiaryListPage'
import PublicFeedPage from '@/pages/PublicFeedPage'
import DiaryDetailPage from '@/pages/DiaryDetailPage'
import DiaryNewPhotoPage from '@/pages/DiaryNewPhotoPage'
import DiaryNewWeatherPage from '@/pages/DiaryNewWeatherPage'
import DiaryNewMoodPage from '@/pages/DiaryNewMoodPage'
import DiaryNewWritePage from '@/pages/DiaryNewWritePage'
import ProfilePage from '@/pages/ProfilePage'

function PrivateRoute() {
  const user = useAtomValue(currentUserAtom)
  if (!user) return <Navigate to="/login" replace />
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
          { path: '/diary/new/photo', element: <DiaryNewPhotoPage /> },
          { path: '/diary/new/weather', element: <DiaryNewWeatherPage /> },
          { path: '/diary/new/mood', element: <DiaryNewMoodPage /> },
          { path: '/diary/new/write', element: <DiaryNewWritePage /> },
          { path: '/profile', element: <ProfilePage /> },
        ],
      },
    ],
  },
])
