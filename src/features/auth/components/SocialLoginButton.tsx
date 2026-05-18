interface SocialLoginButtonProps {
  onClick: () => void
}

const KakaoIcon = () => (
  <img src="/images/kakao-icon.svg" alt="" width={22} height={21} />
)

export default function SocialLoginButton({ onClick }: SocialLoginButtonProps) {
  return (
    <button
      onClick={onClick}
      className="font-nanum flex items-center justify-center gap-3 w-[292px] h-[63px] bg-jjan-kakao-yellow rounded-[20px] font-bold text-[20px] text-black"
    >
      <KakaoIcon />
      kakao로 시작하기
    </button>
  )
}
