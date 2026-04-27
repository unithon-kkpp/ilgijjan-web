import { httpClient } from '@/shared/lib/httpClient'
import { tokenStorage } from '@/shared/lib/tokenStorage'
import type { LoginRequest, LoginResponse } from '../types/auth.types'

interface SocialAuthBody {
  provider: 'KAKAO'
  accessToken: string
}

export const authApi = {
  login: (body: LoginRequest) =>
    httpClient.post<LoginResponse>('/auth/login', body).then((res) => res.data),

  logout: () => {
    const body: SocialAuthBody = { provider: 'KAKAO', accessToken: tokenStorage.getKakao() ?? '' }
    return httpClient
      .post('/auth/logout', body, {
        headers: { 'Refresh-Token': tokenStorage.getRefresh() ?? '' },
      })
      .then((res) => res.data)
  },

  withdraw: () => {
    const body: SocialAuthBody = { provider: 'KAKAO', accessToken: tokenStorage.getKakao() ?? '' }
    return httpClient
      .post('/auth/withdraw', body, {
        headers: { 'Refresh-Token': tokenStorage.getRefresh() ?? '' },
      })
      .then((res) => res.data)
  },

  reissue: () =>
    httpClient.post<{ accessToken: string }>('/auth/reissue').then((res) => res.data),
}
