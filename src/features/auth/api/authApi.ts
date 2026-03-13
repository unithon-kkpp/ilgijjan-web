import { httpClient } from '@/shared/lib/httpClient'
import type { LoginRequest, LoginResponse } from '../types/auth.types'

export const authApi = {
  login: (body: LoginRequest) =>
    httpClient.post<LoginResponse>('/auth/login', body).then((res) => res.data),

  logout: () =>
    httpClient.post('/auth/logout').then((res) => res.data),

  withdraw: () =>
    httpClient.delete('/auth/withdraw').then((res) => res.data),

  reissue: () =>
    httpClient.post<{ accessToken: string }>('/auth/reissue').then((res) => res.data),
}
