import { useAuth } from '@/features/auth/hooks/useAuth'
import SocialLoginButton from '@/features/auth/components/SocialLoginButton'

export default function LoginPage() {
  const { loginWithKakao } = useAuth()

  return (
    <div className="relative w-full h-[844px] overflow-hidden bg-[#eef9ff]">
      {/* 구름 - 좌상단 */}
      <div className="absolute left-[-55px] top-[129px] rotate-[5.34deg]">
        <img src="/images/cloud.svg" alt="" width={182} height={92} className="drop-shadow-[0_0_4px_rgba(145,204,255,0.2)]" />
      </div>

      {/* 구름 - 우중단 */}
      <div className="absolute left-[249px] top-[496px] rotate-[5.34deg] opacity-50">
        <img src="/images/cloud-dim.svg" alt="" width={182} height={92} className="drop-shadow-[0_0_4px_rgba(145,204,255,0.2)]" />
      </div>

      {/* 구름 - 좌하단 */}
      <div className="absolute left-[-22px] top-[669px]">
        <img src="/images/cloud.svg" alt="" width={105} height={53} className="drop-shadow-[0_0_4px_rgba(145,204,255,0.2)]" />
      </div>

      {/* 타이틀 */}
      <p
        className="absolute text-[50px] text-[rgba(0,0,0,0.9)] leading-normal"
        style={{
          fontFamily: "'AndongKaturi', sans-serif",
          top: 'calc(50% - 96px)',
          left: 'calc(50% - 66.5px)',
          width: '134px',
          height: '69px',
        }}
      >
        일기짠
      </p>

      {/* 안내 문구 */}
      <p
        className="absolute text-[14px] text-[rgba(0,0,0,0.9)] font-bold leading-normal whitespace-nowrap"
        style={{
          fontFamily: "'NanumSquareRound', sans-serif",
          top: '400px',
          left: 'calc(50% - 128.5px)',
        }}
      >
        일기짠을 시작하기 위해 로그인이 필요해요 :)
      </p>

      {/* 카카오 로그인 버튼 */}
      <div className="absolute" style={{ top: '460px', left: 'calc(50% - 146px)' }}>
        <SocialLoginButton onClick={loginWithKakao} />
      </div>
    </div>
  )
}
