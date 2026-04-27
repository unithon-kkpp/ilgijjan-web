interface SocialLoginButtonProps {
  onClick: () => void
}

const KakaoIcon = () => (
  <svg width="22" height="21" viewBox="0 0 22 21" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11 0C4.925 0 0 3.948 0 8.816c0 3.13 1.995 5.876 5.014 7.48L3.77 20.553a.37.37 0 0 0 .538.41l5.262-3.472c.467.047.942.072 1.43.072 6.075 0 11-3.948 11-8.816C22 3.948 17.075 0 11 0Z"
      fill="#3C1E1E"
    />
  </svg>
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
