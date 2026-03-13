import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import { useAtomValue } from 'jotai'
import { currentUserAtom } from './store'

import LoginPage from '@/pages/LoginPage'
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
import BillingPage from '@/pages/BillingPage'

// 로그인이 필요한 라우트를 감싸는 가드
function PrivateRoute() {
  const user = useAtomValue(currentUserAtom)
  if (!user) return <Navigate to="/login" replace />
  return <Outlet />
}

export const router = createBrowserRouter([
  // 인증 불필요
  { path: '/login', element: <LoginPage /> },
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
      { path: '/billing', element: <BillingPage /> },
    ],
  },
])
