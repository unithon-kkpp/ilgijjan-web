export interface LoginRequest {
  provider: 'KAKAO'
  accessToken: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
}
