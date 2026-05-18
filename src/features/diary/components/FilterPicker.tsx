import { useEffect } from 'react'
import { useExitAnimation } from '@/shared/hooks/useExitAnimation'

const APP_START_YEAR = 2026

export type PickerType = 'year' | 'month'

function ChevronDown({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M6 9l6 6 6-6" stroke="#424242" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

interface FilterPillProps {
  label: string
  onClick: () => void
}

/**
 * "2026" / "5월" 같은 작은 알약 모양 필터 버튼.
 * 클릭하면 FilterPicker 가 뜸.
 */
export function FilterPill({ label, onClick }: FilterPillProps) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1 rounded-full border-2 bg-white px-3"
      style={{ borderColor: 'rgba(145,204,255,0.8)', height: 28 }}
    >
      <span className="font-nanum text-[16px] text-jjan-text" style={{ fontWeight: 700 }}>
        {label}
      </span>
      <ChevronDown size={16} />
    </button>
  )
}

interface FilterPickerProps {
  type: PickerType
  value: number
  selectedYear: number
  onChange: (v: number) => void
  onClose: () => void
}

/**
 * 연도/월 선택 바텀시트.
 * - 연도: 앱 시작 연도(2026)부터 현재 연도까지
 * - 월: 선택된 연도가 올해면 현재 월까지, 이전 연도면 12월까지
 *
 * absolute → MobileLayout 의 relative 컨테이너(390px) 기준으로 떠 있음.
 * useExitAnimation 으로 닫기 애니메이션 완료 시 unmount.
 */
export function FilterPicker({
  type,
  value,
  selectedYear,
  onChange,
  onClose,
}: FilterPickerProps) {
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() + 1

  const years = Array.from(
    { length: currentYear - APP_START_YEAR + 1 },
    (_, i) => APP_START_YEAR + i,
  )
  const maxMonth = selectedYear >= currentYear ? currentMonth : 12
  const months = Array.from({ length: maxMonth }, (_, i) => i + 1)

  const items = type === 'year' ? years : months

  // closing 동안 exit 애니메이션 재생 → 패널 slide 끝나면 onClose 호출해 unmount
  const { closing, requestClose, handleAnimationEnd } = useExitAnimation(onClose)

  // ESC = 닫기
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        requestClose()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [requestClose])

  return (
    <div
      className={`absolute inset-0 z-50 flex items-end ${closing ? 'animate-fade-out' : 'animate-fade-in'}`}
      style={{ backgroundColor: 'rgba(0,0,0,0.35)' }}
      onClick={requestClose}
    >
      <div
        className={`w-full bg-white rounded-t-[24px] overflow-hidden ${closing ? 'animate-slide-down-modal' : 'animate-slide-up-modal'}`}
        onClick={(e) => e.stopPropagation()}
        onAnimationEnd={handleAnimationEnd}
      >
        {/* 핸들 바 */}
        <div className="flex justify-center pt-3 pb-1">
          <div style={{ width: 48, height: 4, borderRadius: 100, backgroundColor: '#d0d0d0' }} />
        </div>
        <p className="font-nanum text-center py-3 text-[16px] text-jjan-text" style={{ fontWeight: 700 }}>
          {type === 'year' ? '연도 선택' : '월 선택'}
        </p>
        <div className="overflow-y-auto" style={{ maxHeight: '40vh', paddingBottom: 32 }}>
          {items.map((item) => (
            <button
              key={item}
              onClick={() => {
                onChange(item)
                requestClose()
              }}
              className="font-nanum w-full py-[14px] text-center transition-colors duration-150 ease-out hover:bg-black/5 active:bg-black/10"
              style={{
                fontSize: 18,
                fontWeight: value === item ? 800 : 400,
                color: value === item ? '#91ccff' : '#424242',
              }}
            >
              {type === 'month' ? `${item}월` : String(item)}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
