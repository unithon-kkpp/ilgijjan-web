import { useEffect, useState } from 'react'

interface ConfirmDialogProps {
  open: boolean
  message: React.ReactNode
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onClose: () => void
}

function AlarmBellIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden>
      <path
        d="M9 24 L27 24 Q27 17 24.5 13.5 Q22 10 18 10 Q14 10 11.5 13.5 Q9 17 9 24 Z"
        fill="#EF6B6B"
      />
      <rect x="14" y="6.5" width="8" height="4" rx="1.6" fill="#EF6B6B" />
      <rect x="6" y="24" width="24" height="3" rx="1.5" fill="#EF6B6B" />
      <path d="M3 18 L6 19.5" stroke="#EF6B6B" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M2.5 14 L5.5 14" stroke="#EF6B6B" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M33 18 L30 19.5" stroke="#EF6B6B" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M33.5 14 L30.5 14" stroke="#EF6B6B" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

export default function ConfirmDialog({
  open,
  message,
  confirmLabel = '예',
  cancelLabel = '아니요',
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  const [closing, setClosing] = useState(false)
  const [mounted, setMounted] = useState(open)

  useEffect(() => {
    if (open) {
      setMounted(true)
      setClosing(false)
    }
  }, [open])

  function requestClose() {
    if (!closing) setClosing(true)
  }

  function handlePanelAnimationEnd() {
    if (closing) {
      setMounted(false)
      onClose()
    }
  }

  useEffect(() => {
    if (!mounted) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        requestClose()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [mounted])

  if (!mounted) return null

  return (
    <div
      className={`absolute inset-0 z-50 flex items-center justify-center px-8 ${closing ? 'animate-fade-out' : 'animate-fade-in'}`}
      style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
      onClick={requestClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`w-full max-w-[300px] rounded-[20px] bg-white px-6 pt-7 pb-6 flex flex-col items-center ${closing ? 'animate-pop-out' : 'animate-pop-in'}`}
        onClick={(e) => e.stopPropagation()}
        onAnimationEnd={handlePanelAnimationEnd}
      >
        <AlarmBellIcon />
        <div
          className="mt-4 mb-6 text-center text-[14px] leading-[1.5]"
          style={{ fontFamily: "'NanumSquareRound', sans-serif", fontWeight: 700, color: '#424242' }}
        >
          {message}
        </div>
        <div className="flex w-full gap-3">
          <button
            onClick={() => {
              onConfirm()
              requestClose()
            }}
            className="flex-1 h-[44px] rounded-[14px] text-[15px]"
            style={{
              fontFamily: "'NanumSquareRound', sans-serif",
              fontWeight: 700,
              backgroundColor: '#E0E0E0',
              color: '#424242',
            }}
          >
            {confirmLabel}
          </button>
          <button
            onClick={requestClose}
            className="flex-1 h-[44px] rounded-[14px] text-[15px] text-white"
            style={{
              fontFamily: "'NanumSquareRound', sans-serif",
              fontWeight: 700,
              backgroundColor: '#F4806C',
            }}
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
