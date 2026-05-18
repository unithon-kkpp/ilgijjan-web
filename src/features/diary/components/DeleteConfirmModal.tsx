import { useEffect } from 'react'
import { SirenIcon } from './icons'

const TEXT_BLACK = '#424242'
const SIREN_RED = '#FF7474'
const BUTTON_GRAY = '#D9D9D9'

interface DeleteConfirmModalProps {
  onConfirm: () => void
  onCancel: () => void
  isLoading: boolean
  isError: boolean
}

/**
 * 일기 삭제 확인 모달 (사이렌 아이콘 + 2-CTA).
 * 디자인 상 좌측(회색)=삭제, 우측(빨강)=취소. 색상이 일반 디자인 가이드와 반대라 ConfirmDialog 와 분리해서 별도 컴포넌트.
 */
export default function DeleteConfirmModal({
  onConfirm,
  onCancel,
  isLoading,
  isError,
}: DeleteConfirmModalProps) {
  // ESC = "아니요"(취소). 진행 중일 땐 무시 (이미 호출된 DELETE는 못 되돌리니까)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) {
        e.preventDefault()
        onCancel()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isLoading, onCancel])

  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
      onClick={isLoading ? undefined : onCancel}
    >
      <div
        className="flex flex-col items-center bg-white"
        style={{
          width: 326,
          borderRadius: 20,
          paddingTop: 26,
          paddingBottom: 32,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 사이렌 아이콘 */}
        <SirenIcon size={35} color={SIREN_RED} />

        {/* 본문 — 2줄 */}
        <p
          className="font-nanum text-center"
          style={{
            marginTop: 16,
            fontWeight: 700,
            fontSize: 16.5,
            lineHeight: '23px',
            color: TEXT_BLACK,
          }}
        >
          삭제된 일기와 노래는 복구가 불가능합니다.
          <br />
          일기와 노래를 삭제하시겠습니까?
        </p>

        {isError && (
          <p
            className="font-nanum text-center"
            style={{
              marginTop: 8,
              fontWeight: 700,
              fontSize: 12,
              color: SIREN_RED,
            }}
          >
            삭제에 실패했어요. 다시 시도해주세요.
          </p>
        )}

        {/* 버튼 row — 예(회색)=삭제, 아니요(빨강)=취소 */}
        <div className="flex" style={{ marginTop: 24, gap: 32 }}>
          <button
            className="font-nanum disabled:opacity-60"
            style={{
              width: 90,
              height: 54,
              borderRadius: 20,
              backgroundColor: BUTTON_GRAY,
              color: TEXT_BLACK,
              fontWeight: 800,
              fontSize: 18,
            }}
            onClick={onConfirm}
            disabled={isLoading}
            aria-label="삭제"
          >
            {isLoading ? '삭제중' : '예'}
          </button>
          <button
            className="font-nanum disabled:opacity-60"
            style={{
              width: 90,
              height: 54,
              borderRadius: 20,
              backgroundColor: SIREN_RED,
              color: TEXT_BLACK,
              fontWeight: 800,
              fontSize: 18,
            }}
            onClick={onCancel}
            disabled={isLoading}
            aria-label="취소"
          >
            아니요
          </button>
        </div>
      </div>
    </div>
  )
}
