import { useCallback, useState } from 'react'

/**
 * exit 애니메이션이 끝난 뒤 unmount/onClose 를 트리거하는 패턴을 캡슐화.
 *
 * 부모가 모달의 mount 여부를 제어한다고 가정:
 *   1. 부모가 mount=true 로 컴포넌트를 띄움 → entry 애니메이션 자동 재생.
 *   2. 사용자가 닫기 트리거(배경 클릭/ESC/버튼) → `requestClose()` → closing=true
 *      → 컴포넌트가 exit 애니메이션 클래스를 적용.
 *   3. 애니메이션 끝나는 순간 `onAnimationEnd={handleAnimationEnd}` 가 발화 →
 *      `closing` 일 때만 부모의 `onClose` 호출 → 부모가 mount=false.
 *
 * `handleAnimationEnd` 는 entry/exit 양쪽에서 발화되므로 `closing` 가드가 필수.
 *
 * @param onClose exit 애니메이션 완료 후 호출할 부모 콜백 (보통 setState(false))
 */
export function useExitAnimation(onClose: () => void) {
  const [closing, setClosing] = useState(false)

  const requestClose = useCallback(() => {
    setClosing(true)
  }, [])

  const handleAnimationEnd = useCallback(() => {
    if (closing) onClose()
  }, [closing, onClose])

  return { closing, requestClose, handleAnimationEnd }
}
