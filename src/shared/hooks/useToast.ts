import { useCallback } from 'react'
import { useSetAtom } from 'jotai'
import { toastsAtom, type ToastType } from '@/app/store'

// 전역 atom 기반 토스트 — 페이지 이동 후에도 토스트가 살아 있어야 하는 케이스 대응.
// 컴포넌트는 showToast 만 호출, 화면 렌더는 <ToastContainer /> 가 전담.
export function useToast() {
  const setToasts = useSetAtom(toastsAtom)

  const showToast = useCallback(
    (message: string, type: ToastType = 'info') => {
      const id = Date.now() + Math.random()
      setToasts((prev) => [...prev, { id, message, type }])
    },
    [setToasts],
  )

  return { showToast }
}
