import { useSetAtom } from 'jotai'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { authApi } from '../api/authApi'
import { tokenStorage } from '@/shared/lib/tokenStorage'
import { currentUserAtom } from '@/app/store'

export function useAuth() {
  const setCurrentUser = useSetAtom(currentUserAtom)
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const cleanupLocal = () => {
    tokenStorage.remove()
    queryClient.clear()
    setCurrentUser(null)
    navigate('/login', { replace: true })
  }

  const loginWithKakao = () => {
    window.Kakao.Auth.authorize({
      redirectUri: `${window.location.origin}/oauth/kakao`,
      throughTalk: false,
    })
  }

  // 백엔드 호출이 실패해도 로컬은 무조건 정리.
  // 카카오 토큰이 만료된 상태라도 사용자는 로그아웃 의도를 분명히 했으니 클라 상태는 비움.
  const logout = async () => {
    try {
      await authApi.logout()
    } catch (err) {
      console.warn('logout API 실패 — 로컬 정리는 그대로 진행', err)
    }
    cleanupLocal()
  }

  // 탈퇴는 실패하면 정말 탈퇴가 안 된 것이므로 throw — 호출자가 사용자에게 안내.
  const withdraw = async () => {
    await authApi.withdraw()
    cleanupLocal()
  }

  return { loginWithKakao, logout, withdraw }
}
