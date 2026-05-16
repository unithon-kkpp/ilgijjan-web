import { httpClient } from '@/shared/lib/httpClient'
import { tokenStorage } from '@/shared/lib/tokenStorage'
import type { LoginRequest, LoginResponse } from '../types/auth.types'

interface SocialAuthBody {
  provider: 'KAKAO'
  accessToken: string
}

const KAKAO_TOKEN_URL = 'https://kauth.kakao.com/oauth/token'

/**
 * 저장된 카카오 refresh token 으로 카카오 서버에서 새 access token 을 발급받고 storage 갱신.
 * 새 refresh token 이 같이 오면(만료 1개월 미만일 때만 옴) 그것도 함께 갱신.
 */
async function refreshKakaoAccessToken(): Promise<string> {
  const refreshToken = tokenStorage.getKakaoRefresh()
  if (!refreshToken) throw new Error('카카오 refresh token 없음 — 재로그인 필요')

  const res = await fetch(KAKAO_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: import.meta.env.VITE_KAKAO_JS_KEY,
      refresh_token: refreshToken,
    }),
  })
  const data = await res.json()
  if (!data.access_token) {
    throw new Error(data.error_description ?? '카카오 토큰 재발급 실패')
  }

  tokenStorage.setKakao(data.access_token)
  if (data.refresh_token) tokenStorage.setKakaoRefresh(data.refresh_token)
  return data.access_token
}

function isKakaoTokenExpired(err: unknown): boolean {
  const e = err as { response?: { status?: number; data?: { code?: string } } }
  return e?.response?.status === 401 && e?.response?.data?.code === 'INVALID_KAKAO_TOKEN'
}

/**
 * 카카오 액세스 토큰을 동봉해 백엔드 호출. 만료 응답을 받으면 카카오에서 재발급 후 1회 재시도.
 * 백엔드 spec: { provider, accessToken } 바디 + Refresh-Token 헤더 필수.
 */
async function callWithKakaoToken(path: '/auth/logout' | '/auth/withdraw') {
  const send = (kakaoAccessToken: string) => {
    const body: SocialAuthBody = { provider: 'KAKAO', accessToken: kakaoAccessToken }
    return httpClient.post(path, body, {
      headers: { 'Refresh-Token': tokenStorage.getRefresh() ?? '' },
    })
  }

  const currentKakaoToken = tokenStorage.getKakao() ?? ''
  try {
    return await send(currentKakaoToken)
  } catch (err) {
    if (!isKakaoTokenExpired(err)) throw err
    // 카카오 토큰 만료 → refresh token 으로 재발급 → 새 토큰으로 다시 시도
    const newKakaoToken = await refreshKakaoAccessToken()
    return await send(newKakaoToken)
  }
}

export const authApi = {
  login: (body: LoginRequest) =>
    httpClient.post<LoginResponse>('/auth/login', body).then((res) => res.data),

  logout: () => callWithKakaoToken('/auth/logout').then((res) => res.data),

  withdraw: () => callWithKakaoToken('/auth/withdraw').then((res) => res.data),

  reissue: () =>
    httpClient.post<{ accessToken: string }>('/auth/reissue').then((res) => res.data),
}
