import { useAuth } from '@/features/auth/hooks/useAuth'
import SocialLoginButton from '@/features/auth/components/SocialLoginButton'

export default function LoginPage() {
  const { loginWithKakao } = useAuth()

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#eef9ff] flex flex-col items-center justify-center">
      {/* 구름 - 좌상단 */}
      <div className="absolute left-[-55px] top-[15%] rotate-[5.34deg]">
        <img src="/images/cloud.svg" alt="" width={182} height={92} className="drop-shadow-[0_0_4px_rgba(145,204,255,0.2)]" />
      </div>

      {/* 구름 - 우중단 */}
      <div className="absolute left-[249px] top-[59%] rotate-[5.34deg] opacity-50">
        <img src="/images/cloud-dim.svg" alt="" width={182} height={92} className="drop-shadow-[0_0_4px_rgba(145,204,255,0.2)]" />
      </div>

      {/* 구름 - 좌하단 */}
      <div className="absolute left-[-22px] top-[79%]">
        <img src="/images/cloud.svg" alt="" width={105} height={53} className="drop-shadow-[0_0_4px_rgba(145,204,255,0.2)]" />
      </div>

      {/* 메인 컨텐츠 */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* 타이틀 */}
        <p
          className="text-[50px] text-[rgba(0,0,0,0.9)] leading-normal"
          style={{ fontFamily: "'AndongKaturi', sans-serif" }}
        >
          일기짠
        </p>

        {/* 안내 문구 */}
        <p
          className="text-[14px] text-[rgba(0,0,0,0.9)] font-bold leading-normal whitespace-nowrap"
          style={{ fontFamily: "'NanumSquareRound', sans-serif" }}
        >
          일기짠을 시작하기 위해 로그인이 필요해요 :)
        </p>

        {/* 카카오 로그인 버튼 */}
        <SocialLoginButton onClick={loginWithKakao} />
      </div>
    </div>
  )
}
