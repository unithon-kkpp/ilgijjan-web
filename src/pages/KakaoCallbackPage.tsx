import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '@/features/auth/api/authApi'
import { tokenStorage } from '@/shared/lib/tokenStorage'

interface KakaoTokens {
  accessToken: string
  refreshToken: string
}

async function exchangeCodeForToken(code: string): Promise<KakaoTokens> {
  const res = await fetch('https://kauth.kakao.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: import.meta.env.VITE_KAKAO_JS_KEY,
      redirect_uri: `${window.location.origin}/oauth/kakao`,
      code,
    }),
  })
  const data = await res.json()
  if (!data.access_token) throw new Error(data.error_description ?? '토큰 교환 실패')
  return { accessToken: data.access_token, refreshToken: data.refresh_token }
}

export default function KakaoCallbackPage() {
  const navigate = useNavigate()

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code')
    if (!code) {
      navigate('/login', { replace: true })
      return
    }

    exchangeCodeForToken(code)
      .then(({ accessToken, refreshToken }) => {
        tokenStorage.setKakao(accessToken)
        // 카카오 refresh token 저장 — 이후 로그아웃/탈퇴 시 access token 만료되면 이걸로 재발급
        if (refreshToken) tokenStorage.setKakaoRefresh(refreshToken)
        return authApi.login({ provider: 'KAKAO', accessToken })
      })
      .then((res) => {
        tokenStorage.set(res.accessToken)
        tokenStorage.setRefresh(res.refreshToken)
        navigate('/', { replace: true })
      })
      .catch((err) => {
        console.error('로그인 실패:', err)
        navigate('/login', { replace: true })
      })
  }, [])

  return (
    <div className="h-full flex items-center justify-center bg-[#eef9ff]">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-yellow-400" />
    </div>
  )
}
