import { useEffect } from 'react'
import { useExitAnimation } from '@/shared/hooks/useExitAnimation'
import { formatDiaryDate } from '../lib/date'
import type { Diary } from '../types/diary.types'

const TEXT_BLACK = '#424242'

interface OriginalContentModalProps {
  diary: Diary
  onClose: () => void
}

/**
 * 일기 단건 조회에서 책 아이콘 누르면 뜨는 바텀시트.
 * 내가 작성한 원본 글 또는 사진을 보여줌.
 * - 배경 클릭 / ESC / slide-down 애니메이션 끝나면 unmount.
 */
export default function OriginalContentModal({
  diary,
  onClose,
}: OriginalContentModalProps) {
  // closing 동안 exit 애니메이션 → 끝나면 onAnimationEnd 로 부모에 unmount 요청(onClose)
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
      className={`absolute inset-0 z-40 flex items-end justify-center ${closing ? 'animate-fade-out' : 'animate-fade-in'}`}
      style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
      onClick={requestClose}
    >
      <div
        className={`w-full bg-white rounded-t-[28px] overflow-hidden ${closing ? 'animate-slide-down-modal' : 'animate-slide-up-modal'}`}
        style={{ height: '70%' }}
        onClick={(e) => e.stopPropagation()}
        onAnimationEnd={handleAnimationEnd}
      >
        <div className="flex flex-col items-center pt-8 px-6 h-full overflow-y-auto pb-10">
          <p
            className="font-nanum text-[16px] mb-8"
            style={{ fontWeight: 700, color: TEXT_BLACK }}
          >
            {formatDiaryDate(diary.date)}
          </p>

          {diary.type === 'TEXT' && diary.text && (
            <p
              className="font-nanum text-center text-[16px] whitespace-pre-wrap"
              style={{ fontWeight: 500, lineHeight: 1.7, color: TEXT_BLACK }}
            >
              {diary.text}
            </p>
          )}

          {diary.type === 'PHOTO' && diary.photoUrl && (
            <img
              src={diary.photoUrl}
              alt=""
              className="w-full h-auto object-contain rounded-[6px]"
            />
          )}
        </div>
      </div>
    </div>
  )
}
