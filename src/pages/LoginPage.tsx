import { useAuth } from '@/features/auth/hooks/useAuth'
import SocialLoginButton from '@/features/auth/components/SocialLoginButton'

export default function LoginPage() {
  const { loginWithKakao } = useAuth()

  return (
    <div className="min-h-screen bg-amber-50 flex flex-col items-center justify-center px-6">
      <div className="flex flex-col items-center mb-16">
        <div className="w-24 h-24 bg-yellow-400 rounded-3xl flex items-center justify-center mb-6 shadow-lg">
          <span className="text-4xl">📔</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">일기짠</h1>
        <p className="text-gray-400 text-sm">AI와 함께 쓰는 나만의 일기장</p>
      </div>

      <div className="w-full flex flex-col items-center gap-3">
        <SocialLoginButton provider="kakao" onClick={loginWithKakao} />
        <p className="text-xs text-gray-400 mt-4 text-center leading-relaxed">
          로그인하면 <span className="text-gray-500">서비스 이용약관</span>과{' '}
          <span className="text-gray-500">개인정보처리방침</span>에<br />
          동의하는 것으로 간주됩니다
        </p>
      </div>
    </div>
  )
}
