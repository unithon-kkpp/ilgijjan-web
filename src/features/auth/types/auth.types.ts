export interface LoginRequest {
  provider: 'kakao' | 'google' | 'apple'
  idToken: string
}

export interface LoginResponse {
  accessToken: string
  isNewUser: boolean
}
