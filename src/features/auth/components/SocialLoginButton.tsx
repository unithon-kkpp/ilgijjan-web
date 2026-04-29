interface SocialLoginButtonProps {
  provider: 'kakao' | 'google' | 'apple'
  onClick: () => void
}

export default function SocialLoginButton({ provider, onClick }: SocialLoginButtonProps) {
  if (provider === 'kakao') {
    return (
      <button
        onClick={onClick}
        className="flex items-center justify-center gap-3 w-full max-w-xs bg-[#FEE500] rounded-xl py-3.5 px-6 font-medium text-[#191919] text-sm hover:bg-[#F5DC00] active:scale-95 transition-all"
      >
        <KakaoIcon />
        카카오로 시작하기
      </button>
    )
  }

  return (
    <button onClick={onClick} className="w-full max-w-xs py-3.5 px-6 rounded-xl border text-sm font-medium">
      {provider} 로그인
    </button>
  )
}

function KakaoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9 1.5C4.858 1.5 1.5 4.134 1.5 7.375c0 2.07 1.37 3.886 3.44 4.913-.152.55-.55 1.993-.63 2.303-.1.386.14.38.295.277.122-.082 1.936-1.31 2.72-1.843.545.078 1.106.12 1.675.12 4.142 0 7.5-2.634 7.5-5.875S13.142 1.5 9 1.5z"
        fill="#191919"
      />
    </svg>
  )
}
