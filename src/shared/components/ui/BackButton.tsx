import { useNavigate } from 'react-router-dom'

interface BackButtonProps {
  /** chevron 크기(px). 기본 32. */
  size?: number
  /** stroke 두께. 기본 2.5. ProfilePage 처럼 얇게 쓰고 싶으면 1.8 등으로. */
  strokeWidth?: number
  /** 클릭 핸들러. 안 넘기면 navigate(-1). */
  onClick?: () => void
  /** wrapper 버튼 className override. 안 넘기면 기본 (hover/active 배경) 적용. */
  className?: string
}

const DEFAULT_CLASS =
  'rounded-full p-2 -m-2 transition-all duration-150 ease-out hover:bg-black/5 active:bg-black/10'

/**
 * 공통 뒤로가기 버튼. 헤더 좌측 chevron.
 *
 * 사용 예:
 *   <BackButton />                          // navigate(-1)
 *   <BackButton onClick={customHandler} />  // 커스텀 핸들러
 *   <BackButton size={28} strokeWidth={1.8} /> // 사이즈/굵기 조절
 */
export default function BackButton({
  size = 32,
  strokeWidth = 2.5,
  onClick,
  className,
}: BackButtonProps) {
  const navigate = useNavigate()
  return (
    <button
      onClick={onClick ?? (() => navigate(-1))}
      aria-label="뒤로가기"
      className={className ?? DEFAULT_CLASS}
    >
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path
          d="M15 18l-6-6 6-6"
          stroke="#424242"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}
