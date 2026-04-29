import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSetAtom } from 'jotai'
import { authApi } from '@/features/auth/api/authApi'
import { userApi } from '@/features/user/api/userApi'
import { tokenStorage } from '@/shared/lib/tokenStorage'
import { currentUserAtom } from '@/app/store'
import LoadingSpinner from '@/shared/components/ui/LoadingSpinner'

export default function KakaoCallbackPage() {
  const navigate = useNavigate()
  const setCurrentUser = useSetAtom(currentUserAtom)

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code')
    if (!code) {
      navigate('/login', { replace: true })
      return
    }

    authApi
      .login({ provider: 'KAKAO', accessToken: code })
      .then(async (res) => {
        tokenStorage.set(res.accessToken)
        tokenStorage.setRefresh(res.refreshToken)
        const user = await userApi.getMe()
        setCurrentUser(user)
        navigate(user.name ? '/' : '/onboarding/name', { replace: true })
      })
      .catch(() => navigate('/login', { replace: true }))
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-50">
      <LoadingSpinner size="lg" />
    </div>
  )
}
