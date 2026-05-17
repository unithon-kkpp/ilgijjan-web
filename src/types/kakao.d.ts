interface KakaoAuth {
  authorize(options: { redirectUri: string; throughTalk?: boolean }): void
}

interface Kakao {
  init(jsKey: string): void
  isInitialized(): boolean
  Auth: KakaoAuth
}

interface Window {
  Kakao: Kakao
}
