import { useSetAtom } from 'jotai'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../api/authApi'
import { tokenStorage } from '@/shared/lib/tokenStorage'
import { currentUserAtom } from '@/app/store'

export function useAuth() {
  const setCurrentUser = useSetAtom(currentUserAtom)
  const navigate = useNavigate()

  const loginWithKakao = () => {
    if (!window.Kakao?.isInitialized()) {
      const key = import.meta.env.VITE_KAKAO_APP_KEY
      if (key) window.Kakao.init(key)
    }

    window.Kakao.Auth.authorize({
      redirectUri: `${window.location.origin}/oauth/kakao`,
    })
  }

  const logout = async () => {
    try {
      await authApi.logout()
    } finally {
      tokenStorage.clear()
      setCurrentUser(null)
      navigate('/login', { replace: true })
    }
  }

  return { loginWithKakao, logout }
}
