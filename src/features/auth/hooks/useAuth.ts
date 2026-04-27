import { useSetAtom } from 'jotai'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../api/authApi'
import { tokenStorage } from '@/shared/lib/tokenStorage'
import { currentUserAtom } from '@/app/store'

export function useAuth() {
  const setCurrentUser = useSetAtom(currentUserAtom)
  const navigate = useNavigate()

  const loginWithKakao = () => {
    window.Kakao.Auth.authorize({
      redirectUri: `${window.location.origin}/oauth/kakao`,
      throughTalk: false,
    })
  }

  const logout = async () => {
    await authApi.logout()
    tokenStorage.remove()
    setCurrentUser(null)
    navigate('/login', { replace: true })
  }

  return { loginWithKakao, logout }
}
