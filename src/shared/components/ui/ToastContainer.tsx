import { useEffect, useState } from 'react'
import { useAtom } from 'jotai'
import { toastsAtom, type ToastItem as ToastItemType } from '@/app/store'

const DURATION_MS = 2800
const FADE_MS = 250

function ToastItem({ toast, onRemove }: { toast: ToastItemType; onRemove: (id: number) => void }) {
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setClosing(true), DURATION_MS - FADE_MS)
    return () => clearTimeout(timer)
  }, [])

  const handleAnimationEnd = () => {
    if (closing) onRemove(toast.id)
  }

  // type 별 좌측 색 점 — 검정 배경 위에 상태 구분만 살짝
  const dotColor =
    toast.type === 'success' ? '#7ED957' : toast.type === 'error' ? '#F4806C' : '#91CCFF'

  return (
    <div
      className={`pointer-events-auto flex items-center gap-2 px-4 py-3 rounded-[14px] shadow-lg max-w-[320px] ${closing ? 'animate-toast-out' : 'animate-toast-in'}`}
      style={{ backgroundColor: 'rgba(45,45,45,0.95)' }}
      onAnimationEnd={handleAnimationEnd}
      role="status"
    >
      <span
        className="shrink-0 rounded-full"
        style={{ width: 8, height: 8, backgroundColor: dotColor }}
      />
      <span
        className="text-white text-[14px] leading-[1.4]"
        style={{ fontFamily: "'NanumSquareRound', sans-serif", fontWeight: 700 }}
      >
        {toast.message}
      </span>
    </div>
  )
}

export default function ToastContainer() {
  const [toasts, setToasts] = useAtom(toastsAtom)

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  if (toasts.length === 0) return null

  return (
    <div className="pointer-events-none absolute left-0 right-0 bottom-10 z-[60] flex flex-col items-center gap-2 px-4">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onRemove={removeToast} />
      ))}
    </div>
  )
}
