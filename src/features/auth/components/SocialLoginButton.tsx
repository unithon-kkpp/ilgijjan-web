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
      className="flex items-center justify-center gap-3 w-[292px] h-[63px] bg-[#fee500] rounded-[20px] font-bold text-[20px] text-black"
      style={{ fontFamily: "'NanumSquareRound', sans-serif" }}
    >
      <KakaoIcon />
      kakao로 시작하기
    </button>
  )
}
