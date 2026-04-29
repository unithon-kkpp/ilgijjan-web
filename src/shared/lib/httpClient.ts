import axios from 'axios'
import { tokenStorage } from './tokenStorage'

export const httpClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

httpClient.interceptors.request.use((config) => {
  const token = tokenStorage.get()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const res = await httpClient.post<{ accessToken: string }>('/auth/reissue')
        tokenStorage.set(res.data.accessToken)
        originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`
        return httpClient(originalRequest)
      } catch {
        tokenStorage.clear()
        if (window.location.pathname !== '/login') {
          window.location.href = '/login'
        }
      }
    }

    return Promise.reject(error)
  }
)
