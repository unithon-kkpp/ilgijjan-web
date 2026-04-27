import { useAuth } from '@/features/auth/hooks/useAuth'
import SocialLoginButton from '@/features/auth/components/SocialLoginButton'

const WaveLeft = () => (
  <svg width="182" height="92" viewBox="0 0 182 92" fill="none" xmlns="http://www.w3.org/2000/svg"
    className="drop-shadow-[0_0_4px_rgba(145,204,255,0.2)]">
    <path d="M0 46C0 20.595 20.595 0 46 0h90c25.405 0 46 20.595 46 46s-20.595 46-46 46H46C20.595 92 0 71.405 0 46Z"
      fill="#B8E4FF" fillOpacity=".5" />
  </svg>
)

const WaveRight = () => (
  <svg width="182" height="92" viewBox="0 0 182 92" fill="none" xmlns="http://www.w3.org/2000/svg"
    className="drop-shadow-[0_0_4px_rgba(145,204,255,0.2)] opacity-50">
    <path d="M0 46C0 20.595 20.595 0 46 0h90c25.405 0 46 20.595 46 46s-20.595 46-46 46H46C20.595 92 0 71.405 0 46Z"
      fill="#B8E4FF" fillOpacity=".5" />
  </svg>
)

const WaveSmall = () => (
  <svg width="105" height="53" viewBox="0 0 105 53" fill="none" xmlns="http://www.w3.org/2000/svg"
    className="drop-shadow-[0_0_4px_rgba(145,204,255,0.2)]">
    <path d="M0 26.5C0 11.864 11.864 0 26.5 0h52C93.136 0 105 11.864 105 26.5S93.136 53 78.5 53h-52C11.864 53 0 41.136 0 26.5Z"
      fill="#B8E4FF" fillOpacity=".5" />
  </svg>
)

export default function LoginPage() {
  const { loginWithKakao } = useAuth()

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#eef9ff] flex flex-col items-center">
      <div className="absolute left-[-55px] top-[129px] rotate-[5.34deg]">
        <WaveLeft />
      </div>
      <div className="absolute left-[249px] top-[496px] rotate-[5.34deg]">
        <WaveRight />
      </div>
      <div className="absolute left-[-22px] top-[669px]">
        <WaveSmall />
      </div>

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

      <div className="absolute" style={{ top: '460px', left: 'calc(50% - 146px)' }}>
        <SocialLoginButton onClick={loginWithKakao} />
      </div>
    </div>
  )
}
