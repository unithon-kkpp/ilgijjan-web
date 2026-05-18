import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { tokenStorage } from './tokenStorage'

export const httpClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// 요청 인터셉터: 모든 요청에 accessToken 자동 첨부
httpClient.interceptors.request.use((config) => {
  const token = tokenStorage.get()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

interface ReissueResponse {
  accessToken: string
  refreshToken: string
}

/**
 * /auth/reissue 직접 호출 — httpClient 인터셉터를 우회하기 위해 fetch 사용.
 * (interceptor 안에서 같은 httpClient 를 다시 부르면 재진입/무한루프 위험)
 */
async function reissueTokens(): Promise<string> {
  const refreshToken = tokenStorage.getRefresh()
  if (!refreshToken) throw new Error('refresh token 없음')

  const res = await fetch('/api/auth/reissue', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Refresh-Token': refreshToken,
    },
  })
  if (!res.ok) throw new Error(`reissue 실패: ${res.status}`)
  const data: ReissueResponse = await res.json()

  tokenStorage.set(data.accessToken)
  tokenStorage.setRefresh(data.refreshToken)
  return data.accessToken
}

// 동시에 여러 401 이 터질 때 reissue 가 중복 호출되지 않도록 단일 in-flight promise 공유
let refreshPromise: Promise<string> | null = null
function getRefreshedAccessToken(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = reissueTokens().finally(() => {
      refreshPromise = null
    })
  }
  return refreshPromise
}

function forceLogin() {
  tokenStorage.remove()
  window.location.href = '/login'
}

// 응답 인터셉터
// - 자체 JWT 만료(EXPIRED_TOKEN 등) → refresh token 으로 재발급 후 원 요청 1회 재시도
// - 카카오 토큰 만료(INVALID_KAKAO_TOKEN) → 호출자가 직접 처리 (재발급 로직 다름)
// - 재발급 실패 / refresh token 도 만료 → 토큰 정리 + /login
httpClient.interceptors.response.use(
  (response) => {
    // dev 빌드에서만 응답 로그 — production 콘솔에 토큰/유저 데이터가 새지 않도록
    if (import.meta.env.DEV) {
      console.log(`[API] ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data)
    }
    return response
  },
  async (error: AxiosError<{ code?: string }>) => {
    if (import.meta.env.DEV) {
      console.error(`[API Error] ${error.config?.method?.toUpperCase()} ${error.config?.url}`, error.response?.data ?? error.message)
    }

    if (error.response?.status !== 401) {
      return Promise.reject(error)
    }

    const code = error.response.data?.code
    // 카카오 토큰 만료는 호출자(authApi)가 카카오 재발급으로 처리
    if (code === 'INVALID_KAKAO_TOKEN') {
      return Promise.reject(error)
    }

    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }
    // reissue 자체가 401 이거나 이미 한 번 재시도한 요청이면 진짜 세션 만료
    if (!originalRequest || originalRequest._retry || originalRequest.url?.includes('/auth/reissue')) {
      forceLogin()
      return Promise.reject(error)
    }

    originalRequest._retry = true
    try {
      const newToken = await getRefreshedAccessToken()
      originalRequest.headers.Authorization = `Bearer ${newToken}`
      return httpClient(originalRequest)
    } catch (refreshErr) {
      forceLogin()
      return Promise.reject(refreshErr)
    }
  }
)
