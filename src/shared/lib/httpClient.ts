import axios from 'axios'
import { tokenStorage } from './tokenStorage'

export const httpClient = axios.create({
  baseURL: 'https://ilgijjan.store/api',
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

// 응답 인터셉터: 401 → 로그인 페이지로 이동
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      tokenStorage.remove()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
