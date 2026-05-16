const ACCESS_TOKEN_KEY = 'accessToken'
const REFRESH_TOKEN_KEY = 'refreshToken'
const KAKAO_ACCESS_TOKEN_KEY = 'kakaoAccessToken'
const KAKAO_REFRESH_TOKEN_KEY = 'kakaoRefreshToken'

export const tokenStorage = {
  get: () => localStorage.getItem(ACCESS_TOKEN_KEY),
  set: (token: string) => localStorage.setItem(ACCESS_TOKEN_KEY, token),

  getRefresh: () => localStorage.getItem(REFRESH_TOKEN_KEY),
  setRefresh: (token: string) => localStorage.setItem(REFRESH_TOKEN_KEY, token),

  getKakao: () => localStorage.getItem(KAKAO_ACCESS_TOKEN_KEY),
  setKakao: (token: string) => localStorage.setItem(KAKAO_ACCESS_TOKEN_KEY, token),

  getKakaoRefresh: () => localStorage.getItem(KAKAO_REFRESH_TOKEN_KEY),
  setKakaoRefresh: (token: string) => localStorage.setItem(KAKAO_REFRESH_TOKEN_KEY, token),

  remove: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    localStorage.removeItem(KAKAO_ACCESS_TOKEN_KEY)
    localStorage.removeItem(KAKAO_REFRESH_TOKEN_KEY)
  },
}
