/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_KAKAO_APP_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface KakaoAuthObj {
  access_token: string
  token_type: string
  refresh_token: string
  expires_in: number
  scope: string
  refresh_token_expires_in: number
}

interface Window {
  Kakao: {
    init: (appKey: string) => void
    isInitialized: () => boolean
    Auth: {
      authorize: (settings: { redirectUri: string; scope?: string; prompt?: string }) => void
      getAccessToken: () => string | null
      setAccessToken: (token: string) => void
      getStatusInfo: (callback: (statusObj: { status: string; user?: unknown }) => void) => void
      logout: (callback?: () => void) => void
    }
  }
}
