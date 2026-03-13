interface SocialLoginButtonProps {
  provider: 'kakao' | 'google' | 'apple'
  onClick: () => void
}

export default function SocialLoginButton({ provider, onClick }: SocialLoginButtonProps) {
  return <button onClick={onClick}>{provider} 로그인</button>
}
