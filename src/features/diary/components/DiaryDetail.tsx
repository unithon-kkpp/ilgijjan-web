import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Diary } from '../types/diary.types'
import { useTogglePublish } from '../hooks/useTogglePublish'
import { useDeleteDiary } from '../hooks/useDeleteDiary'
import { useLike } from '@/features/like/hooks/useLike'
import WeatherIcon from './WeatherIcon'
import MoodIcon from './MoodIcon'

interface DiaryDetailProps {
  diary: Diary
  // 생성 직후 진입한 경우 true. 뒤로가기 시 작성 단계로 돌아가지 않고 일기 목록으로 이동.
  fromCreate?: boolean
}

const GRASS_GREEN = '#CDE89B'
const MUSIC_GREEN = '#4CB14C'
const SHARE_CARD_GREEN = '#B5D984'
const LYRICS_BLUE = '#DBEBFB'
const TEXT_BLACK = '#424242'
const HEART_RED = '#FF6969'
// 비공개 상태일 때 하트/카운트 색 — 잔디 배경 위에서 자연스럽게 죽도록 살짝 올리브 톤
const HEART_GRAY = '#9DA890'

function parseDate(dateStr: string) {
  const [y, m, d] = dateStr.split(/[-.]/).map(Number)
  return `${y}년 ${m}월 ${d}일`
}

function ChevronLeft({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M15 18l-6-6 6-6"
        stroke={TEXT_BLACK}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function TrashIcon({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m2 0v14a2 2 0 01-2 2H8a2 2 0 01-2-2V6h12zM10 11v6M14 11v6"
        stroke={TEXT_BLACK}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function HeartIcon({
  size = 37,
  color,
  filled,
}: {
  size?: number
  color: string
  filled: boolean
}) {
  return (
    <svg
      width={size}
      height={size * (32 / 37)}
      viewBox="-2 -2 41 36"
      fill={filled ? color : 'none'}
    >
      <path
        d="M0 10.8782C0 19.9177 7.437 24.7339 12.8797 29.0463C14.8 30.5668 16.65 32 18.5 32C20.35 32 22.2 30.5687 24.1203 29.0445C29.5649 24.7357 37 19.9177 37 10.8801C37 1.84251 26.825 -4.57228 18.5 4.11956C10.175 -4.57228 0 1.83879 0 10.8782Z"
        stroke={color}
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function BookIcon({ size = 41 }: { size?: number }) {
  // Figma solar:book-bold-duotone 벡터 3개. 단일 SVG 로 합쳐서 viewBox(0 0 41 41) 안에
  // g transform 으로 배치 → iOS Safari/카톡 인앱 등 어떤 브라우저에서도 동일 렌더.
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 41 41"
      fill="none"
      className="shrink-0"
    >
      {/* 책 본체 (밝은 파랑) */}
      <g transform="translate(6.83, 3.42)">
        <path
          d="M1.24196 1.25221C1.76471 0.726042 2.49587 0.384375 3.87962 0.196458C5.30437 0.00341669 7.19038 0 9.89638 0H17.437C20.143 0 22.029 0.00341669 23.4537 0.196458C24.8375 0.384375 25.5686 0.726042 26.0914 1.25221C26.6124 1.77837 26.9524 2.51637 27.1386 3.91208C27.3299 5.34708 27.3333 7.25187 27.3333 9.98008V27.3333H5.85275C4.00092 27.3333 3.35517 27.3436 2.85804 27.4495C1.98167 27.6374 1.21804 28.0423 0.662833 28.589C0.474917 28.7735 0.382667 28.864 0.165709 29.4517C0.0631747 29.7014 0.00702035 29.9677 0 30.2375V9.98008C0 7.25187 0.00341639 5.34879 0.19475 3.91208C0.380958 2.51808 0.720917 1.77837 1.24196 1.25221Z"
          fill="#91CCFF"
        />
      </g>
      {/* 뒤표지 (어두운 파랑) */}
      <g transform="translate(6.83, 30.75)">
        <path
          d="M5.85188 0H27.3325C27.3273 1.58875 27.2949 2.77263 27.1394 3.70708C26.9515 4.82263 26.6098 5.412 26.0871 5.83225C25.5626 6.2525 24.828 6.52754 23.4392 6.67617C22.0093 6.82992 20.1148 6.83333 17.3985 6.83333H9.83059C7.11434 6.83333 5.21809 6.83163 3.78992 6.67617C2.40105 6.52754 1.66646 6.2525 1.142 5.83225C0.617547 5.412 0.277588 4.82262 0.0896712 3.70879L0.0520882 3.45083C-0.0162452 2.95371 -0.0504119 2.70429 0.164838 2.11833C0.381796 1.53067 0.474046 1.44013 0.661963 1.25563C1.27106 0.675627 2.03231 0.280486 2.85717 0.116168C3.35259 0.0102514 4.00175 0 5.85188 0Z"
          fill="#4480C9"
        />
      </g>
      {/* 책 안 두 줄 */}
      <g transform="translate(12.39, 10.68)">
        <path
          d="M0 1.28125C0 0.941441 0.134988 0.61555 0.375269 0.375269C0.61555 0.134988 0.941441 0 1.28125 0H14.9479C15.2877 0 15.6136 0.134988 15.8539 0.375269C16.0942 0.61555 16.2292 0.941441 16.2292 1.28125C16.2292 1.62106 16.0942 1.94695 15.8539 2.18723C15.6136 2.42751 15.2877 2.5625 14.9479 2.5625H1.28125C0.941441 2.5625 0.61555 2.42751 0.375269 2.18723C0.134988 1.94695 0 1.62106 0 1.28125ZM1.28125 5.97917C0.941441 5.97917 0.61555 6.11416 0.375269 6.35444C0.134988 6.59472 0 6.92061 0 7.26042C0 7.60023 0.134988 7.92612 0.375269 8.1664C0.61555 8.40668 0.941441 8.54167 1.28125 8.54167H9.82292C10.1627 8.54167 10.4886 8.40668 10.7289 8.1664C10.9692 7.92612 11.1042 7.60023 11.1042 7.26042C11.1042 6.92061 10.9692 6.59472 10.7289 6.35444C10.4886 6.11416 10.1627 5.97917 9.82292 5.97917H1.28125Z"
          fill="#4480C9"
        />
      </g>
    </svg>
  )
}

function LineToggleIcon({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size * (22 / 26)} viewBox="0 0 26 22" fill="none">
      <path d="M3 5h12M3 11h20M3 17h16" stroke={TEXT_BLACK} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

function ImageToggleIcon({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size * (22 / 26)} viewBox="0 0 26 22" fill="none">
      <rect x="3" y="3" width="20" height="16" rx="2" stroke={TEXT_BLACK} strokeWidth="2" />
      <circle cx="9" cy="9" r="1.5" fill={TEXT_BLACK} />
      <path d="M5 17l5-5 4 4 3-3 4 4" stroke={TEXT_BLACK} strokeWidth="2" strokeLinejoin="round" />
    </svg>
  )
}

function PlayTriangle({ size = 95 }: { size?: number }) {
  // Figma Polygon 1 vector — 모서리가 둥근 정삼각형. 원본은 위 가리킴이라 90deg 회전해서 ▶
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 71.0752 61.9951"
      fill="none"
      style={{ transform: 'rotate(90deg)' }}
    >
      <path
        d="M26.992 4.80651C30.8868 -1.60216 40.1884 -1.60218 44.0832 4.8065L69.6052 46.8016C73.6553 53.4657 68.8579 61.9951 61.0596 61.9951H10.0156C2.21733 61.9951 -2.58004 53.4658 1.47 46.8016L26.992 4.80651Z"
        fill={MUSIC_GREEN}
      />
    </svg>
  )
}

function PauseIcon({ size = 95 }: { size?: number }) {
  return (
    <svg width={size} height={size * (100 / 95)} viewBox="0 0 95 100" fill="none">
      <rect x="24" y="16" width="16" height="68" rx="4" fill={MUSIC_GREEN} />
      <rect x="55" y="16" width="16" height="68" rx="4" fill={MUSIC_GREEN} />
    </svg>
  )
}

function GrassSprig({
  className,
  style,
  size = 16,
}: {
  className?: string
  style?: React.CSSProperties
  size?: number
}) {
  return (
    <svg
      width={size}
      height={size * (10 / 18)}
      viewBox="0 0 18 10"
      fill="none"
      className={`absolute pointer-events-none ${className ?? ''}`}
      style={{ opacity: 0.85, ...style }}
    >
      <path
        d="M2 9 Q5 0 9 9"
        stroke="#FFFFFF"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M9 9 Q13 0 16 9"
        stroke="#FFFFFF"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  )
}

function ToggleSwitch({ on }: { on: boolean }) {
  return (
    <div
      className="relative rounded-full shrink-0"
      style={{
        width: 54,
        height: 30,
        backgroundColor: on ? TEXT_BLACK : '#cfcfcf',
        transition: 'background-color 0.15s',
      }}
    >
      <div
        className="absolute rounded-full bg-white"
        style={{
          width: 26,
          height: 26,
          top: 2,
          left: on ? 26 : 2,
          transition: 'left 0.15s',
        }}
      />
    </div>
  )
}

// 진행바 + 큰 재생/일시정지 버튼
function CustomMusicPlayer({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const barRef = useRef<HTMLDivElement | null>(null)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0) // 0..1
  const [dragging, setDragging] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onTime = () => {
      // 드래그 중에는 thumb 위치를 사용자가 직접 잡고 있으므로 timeupdate 무시
      if (dragging) return
      if (audio.duration > 0) setProgress(audio.currentTime / audio.duration)
    }
    const onEnd = () => {
      setPlaying(false)
      setProgress(0)
    }
    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('ended', onEnd)
    return () => {
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('ended', onEnd)
    }
  }, [src, dragging])

  // 전역 mousemove/mouseup/touchmove/touchend로 드래그 추적
  useEffect(() => {
    if (!dragging) return
    const onMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0]?.clientX : e.clientX
      if (clientX == null) return
      seekFromClientX(clientX, /* commit */ false)
    }
    const onUp = (e: MouseEvent | TouchEvent) => {
      const clientX =
        'changedTouches' in e ? e.changedTouches[0]?.clientX : e.clientX
      if (clientX != null) seekFromClientX(clientX, /* commit */ true)
      setDragging(false)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    window.addEventListener('touchmove', onMove, { passive: true })
    window.addEventListener('touchend', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('touchend', onUp)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragging])

  function toggle() {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
      setPlaying(false)
    } else {
      audio.play().catch(() => {})
      setPlaying(true)
    }
  }

  // commit=true이면 audio.currentTime도 갱신 (드래그 종료 시점). 드래그 중에는 시각 progress만 업데이트.
  function seekFromClientX(clientX: number, commit: boolean) {
    const audio = audioRef.current
    const bar = barRef.current
    if (!audio || !bar || !audio.duration) return
    const rect = bar.getBoundingClientRect()
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
    setProgress(ratio)
    if (commit) audio.currentTime = audio.duration * ratio
  }

  function handlePointerDown(clientX: number) {
    setDragging(true)
    seekFromClientX(clientX, /* commit */ true)
  }

  const pct = progress * 100

  return (
    <div className="w-full flex flex-col items-center">
      <audio ref={audioRef} src={src} preload="metadata" />

      {/* 진행바 — 클릭 + 드래그로 시크 */}
      <div className="relative w-full h-5">
        <div
          ref={barRef}
          className="absolute cursor-pointer left-0 right-0"
          style={{ top: 6, height: 8 }}
          onMouseDown={(e) => handlePointerDown(e.clientX)}
          onTouchStart={(e) => handlePointerDown(e.touches[0].clientX)}
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{ backgroundColor: 'rgba(255,255,255,0.7)' }}
          />
          <div
            className="absolute top-0 left-0 h-full rounded-full"
            style={{ width: `${pct}%`, backgroundColor: MUSIC_GREEN }}
          />
        </div>
        {/* thumb — 클릭/터치 가능, 드래그 시작점이 thumb이어도 OK */}
        <div
          className="absolute rounded-full cursor-grab active:cursor-grabbing"
          style={{
            width: 20,
            height: 20,
            top: 0,
            left: `calc(${pct}% - 10px)`,
            backgroundColor: MUSIC_GREEN,
          }}
          onMouseDown={(e) => {
            e.stopPropagation()
            handlePointerDown(e.clientX)
          }}
          onTouchStart={(e) => {
            e.stopPropagation()
            handlePointerDown(e.touches[0].clientX)
          }}
        />
      </div>

      {/* 큰 재생/일시정지 버튼 */}
      <button
        className="mt-10"
        style={{ width: 68, height: 68 }}
        onClick={toggle}
        aria-label={playing ? '일시정지' : '재생'}
      >
        {playing ? <PauseIcon size={68} /> : <PlayTriangle size={68} />}
      </button>
    </div>
  )
}

// Figma picon:on (881:3473) — 사이렌/경광등 아이콘. fill 색은 caller가 결정
function SirenIcon({ size = 35, color = '#FF7474' }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size * (23.625 / 22.75)}
      viewBox="0 0 22.75 23.625"
      fill="none"
    >
      <path
        d="M10.5 1.75V0.875C10.5 0.642936 10.5922 0.420376 10.7563 0.256282C10.9204 0.0921873 11.1429 0 11.375 0C11.6071 0 11.8296 0.0921873 11.9937 0.256282C12.1578 0.420376 12.25 0.642936 12.25 0.875V1.75C12.25 1.98206 12.1578 2.20462 11.9937 2.36872C11.8296 2.53281 11.6071 2.625 11.375 2.625C11.1429 2.625 10.9204 2.53281 10.7563 2.36872C10.5922 2.20462 10.5 1.98206 10.5 1.75ZM19.25 5.25C19.3649 5.25009 19.4788 5.22753 19.585 5.18362C19.6912 5.1397 19.7877 5.07529 19.8691 4.99406L20.7441 4.11906C20.9082 3.95488 21.0005 3.73219 21.0005 3.5C21.0005 3.26781 20.9082 3.04512 20.7441 2.88094C20.5799 2.71675 20.3572 2.62451 20.125 2.62451C19.8928 2.62451 19.6701 2.71675 19.5059 2.88094L18.6309 3.75594C18.5084 3.87831 18.425 4.03428 18.3912 4.20411C18.3573 4.37393 18.3747 4.54997 18.441 4.70994C18.5072 4.86991 18.6195 5.00662 18.7635 5.10276C18.9075 5.19889 19.0768 5.25014 19.25 5.25ZM2.88094 4.99406C3.04512 5.15825 3.26781 5.25049 3.5 5.25049C3.73219 5.25049 3.95488 5.15825 4.11906 4.99406C4.28325 4.82988 4.37549 4.60719 4.37549 4.375C4.37549 4.14281 4.28325 3.92012 4.11906 3.75594L3.24406 2.88094C3.07988 2.71675 2.85719 2.62451 2.625 2.62451C2.39281 2.62451 2.17012 2.71675 2.00594 2.88094C1.84175 3.04512 1.74951 3.26781 1.74951 3.5C1.74951 3.73219 1.84175 3.95488 2.00594 4.11906L2.88094 4.99406ZM22.75 19.25V21.875C22.75 22.3391 22.5656 22.7842 22.2374 23.1124C21.9092 23.4406 21.4641 23.625 21 23.625H1.75C1.28587 23.625 0.840752 23.4406 0.512563 23.1124C0.184374 22.7842 0 22.3391 0 21.875V19.25C0 18.7859 0.184374 18.3408 0.512563 18.0126C0.840752 17.6844 1.28587 17.5 1.75 17.5V14C1.74996 12.7298 2.00133 11.4722 2.48961 10.2997C2.97788 9.12711 3.69342 8.06279 4.59496 7.16806C5.4965 6.27333 6.56621 5.56589 7.74245 5.08652C8.91868 4.60715 10.1782 4.36533 11.4483 4.375C16.7147 4.41438 21 8.78172 21 14.1094V17.5C21.4641 17.5 21.9092 17.6844 22.2374 18.0126C22.5656 18.3408 22.75 18.7859 22.75 19.25ZM12.1056 9.61297C14.1827 9.96187 15.75 11.8475 15.75 14C15.75 14.2321 15.8422 14.4546 16.0063 14.6187C16.1704 14.7828 16.3929 14.875 16.625 14.875C16.8571 14.875 17.0796 14.7828 17.2437 14.6187C17.4078 14.4546 17.5 14.2321 17.5 14C17.5 11.0031 15.3048 8.37484 12.3944 7.88703C12.2806 7.8669 12.1639 7.86952 12.0511 7.89475C11.9383 7.91997 11.8316 7.96729 11.7372 8.03398C11.6428 8.10067 11.5625 8.18541 11.501 8.28329C11.4395 8.38118 11.3981 8.49028 11.379 8.60428C11.3599 8.71829 11.3636 8.83494 11.3899 8.9475C11.4162 9.06007 11.4645 9.16631 11.532 9.2601C11.5996 9.35389 11.6851 9.43336 11.7835 9.49393C11.882 9.55449 11.9914 9.59495 12.1056 9.61297ZM21 21.875V19.25H1.75V21.875H21Z"
        fill={color}
      />
    </svg>
  )
}

// Figma 디자인 색
const SIREN_RED = '#FF7474'
const BUTTON_GRAY = '#D9D9D9'

function DeleteConfirmModal({
  onConfirm,
  onCancel,
  isLoading,
  isError,
}: {
  onConfirm: () => void
  onCancel: () => void
  isLoading: boolean
  isError: boolean
}) {
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
          className="text-center"
          style={{
            marginTop: 16,
            fontFamily: "'NanumSquareRound', sans-serif",
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
            className="text-center"
            style={{
              marginTop: 8,
              fontFamily: "'NanumSquareRound', sans-serif",
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
            className="disabled:opacity-60"
            style={{
              width: 90,
              height: 54,
              borderRadius: 20,
              backgroundColor: BUTTON_GRAY,
              color: TEXT_BLACK,
              fontFamily: "'NanumSquareRound', sans-serif",
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
            className="disabled:opacity-60"
            style={{
              width: 90,
              height: 54,
              borderRadius: 20,
              backgroundColor: SIREN_RED,
              color: TEXT_BLACK,
              fontFamily: "'NanumSquareRound', sans-serif",
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

function OriginalContentModal({ diary, onClose }: { diary: Diary; onClose: () => void }) {
  // closing 동안 exit 애니메이션 → 끝나면 onAnimationEnd 로 부모에 unmount 요청(onClose)
  const [closing, setClosing] = useState(false)

  function requestClose() {
    if (!closing) setClosing(true)
  }

  // panel 의 slide 애니메이션 완료 시점을 unmount 트리거로 사용
  // 입장 애니메이션이 끝났을 때도 한 번 fire 되지만 closing=false 라 무시됨
  function handlePanelAnimationEnd() {
    if (closing) onClose()
  }

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
        onAnimationEnd={handlePanelAnimationEnd}
      >
        <div className="flex flex-col items-center pt-8 px-6 h-full overflow-y-auto pb-10">
          <p
            className="text-[16px] mb-8"
            style={{
              fontFamily: "'NanumSquareRound', sans-serif",
              fontWeight: 700,
              color: TEXT_BLACK,
            }}
          >
            {parseDate(diary.date)}
          </p>

          {diary.type === 'TEXT' && diary.text && (
            <p
              className="text-center text-[16px] whitespace-pre-wrap"
              style={{
                fontFamily: "'NanumSquareRound', sans-serif",
                fontWeight: 500,
                lineHeight: 1.7,
                color: TEXT_BLACK,
              }}
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

export default function DiaryDetail({ diary, fromCreate = false }: DiaryDetailProps) {
  const navigate = useNavigate()

  // 생성 직후엔 history 가 [..., photo, weather, detail] 라 navigate(-1) 가 weather 로 빠짐.
  // 이 경우만 일기 목록으로 직행. 평소엔 일반 뒤로가기.
  const handleBack = () => {
    if (fromCreate) navigate('/', { replace: true })
    else navigate(-1)
  }

  const hasLyrics = !!diary.lyrics
  const hasImage = !!diary.imageUrl
  // 기본: 그림(AI 생성 이미지) 모드. 그림이 없을 때만 가사 모드로 시작.
  const [showLyrics, setShowLyrics] = useState<boolean>(!hasImage)
  const [originalOpen, setOriginalOpen] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)

  const likeMutation = useLike(diary.diaryId)
  const publishMutation = useTogglePublish(diary.diaryId)
  const deleteMutation = useDeleteDiary(diary.diaryId)

  function handleConfirmDelete() {
    deleteMutation.mutate(undefined, {
      onSuccess: () => {
        // 삭제 후 일기 목록으로 — replace 로 두면 뒤로가기로 다시 못 들어옴
        navigate('/', { replace: true })
      },
    })
  }

  const canToggleCard = hasLyrics && hasImage
  const hasOriginal = diary.isOwner && (diary.text || diary.photoUrl)

  // 좋아요 색/상태
  //  - 비공개: 회색 완전 채움 (비활성)
  //  - 공개+안누름: 빨간 테두리만
  //  - 공개+눌렀음: 빨강 완전 채움
  const likeEnabled = diary.isPublic
  const heartColor = likeEnabled ? HEART_RED : HEART_GRAY
  const heartFilled = !likeEnabled || diary.isLiked
  const likeTextColor = likeEnabled ? TEXT_BLACK : HEART_GRAY

  return (
    <div
      className="relative w-full h-full overflow-hidden flex flex-col"
      style={{ backgroundColor: '#FAF9F5' }}
    >
      {/* 헤더 — 뒤로가기 + 휴지통 */}
      <div className="shrink-0 flex items-center justify-between px-5 pt-5 pb-2">
        <button
          className="rounded-full p-2 -m-2 transition-all duration-150 ease-out hover:bg-black/5 active:bg-black/10"
          onClick={handleBack}
          aria-label="뒤로가기"
        >
          <ChevronLeft size={32} />
        </button>
        {diary.isOwner ? (
          <button
            className="rounded-full p-2 -m-2 transition-all duration-150 ease-out hover:bg-black/5 active:bg-black/10"
            onClick={() => setDeleteConfirmOpen(true)}
            aria-label="삭제"
          >
            <TrashIcon size={26} />
          </button>
        ) : (
          <div style={{ width: 26, height: 26 }} />
        )}
      </div>

      {/* 날짜 + 날씨 + 무드 */}
      <div className="shrink-0 flex items-center justify-between px-8 pt-5 pb-4">
        <p
          style={{
            fontFamily: "'NanumSquareRound', sans-serif",
            fontWeight: 700,
            fontSize: 20,
            color: TEXT_BLACK,
          }}
        >
          {parseDate(diary.date)}
        </p>
        <div className="flex items-center gap-4">
          <WeatherIcon weather={diary.weather} size={40} />
          <MoodIcon mood={diary.mood} size={42} />
        </div>
      </div>

      {/* 카드 영역 — z-10으로 잔디 위에 떠 있음. 가사 ↔ 이미지 flip 애니메이션 */}
      <div className="relative shrink-0 px-5 z-10">
        <div
          className="w-full relative"
          style={{ aspectRatio: '1 / 1', perspective: '1200px' }}
        >
          {/* 회전 컨테이너 — showLyrics 에 따라 Y축 0deg ↔ 180deg */}
          <div
            className="absolute inset-0"
            style={{
              transformStyle: 'preserve-3d',
              transition: 'transform 850ms cubic-bezier(0.4, 0, 0.2, 1)',
              transform: showLyrics ? 'rotateY(180deg)' : 'rotateY(0deg)',
            }}
          >
            {/* 앞면: 이미지 */}
            <div
              className="absolute inset-0 rounded-[20px] overflow-hidden"
              style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
              }}
            >
              {hasImage ? (
                <img
                  src={diary.imageUrl!}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ backgroundColor: '#E8E8E8' }}
                >
                  <span
                    className="text-[14px] text-[#7a7a7a]"
                    style={{ fontFamily: "'NanumSquareRound', sans-serif", fontWeight: 700 }}
                  >
                    그림을 만들고 있어요...
                  </span>
                </div>
              )}
            </div>
            {/* 뒷면: 가사 — rotateY(180) 으로 미리 뒤집어둠 */}
            <div
              className="absolute inset-0 rounded-[20px] overflow-hidden"
              style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
                backgroundColor: LYRICS_BLUE,
              }}
            >
              <div
                className="w-full h-full overflow-y-auto"
                style={{ padding: '32px 40px' }}
              >
                <p
                  className="text-center whitespace-pre-wrap break-keep"
                  style={{
                    fontFamily: "'AndongKaturi', sans-serif",
                    fontWeight: 400,
                    fontSize: 22,
                    lineHeight: 1.55,
                    color: TEXT_BLACK,
                  }}
                >
                  {diary.lyrics ?? '가사를 만들고 있어요...'}
                </p>
              </div>
            </div>
          </div>

          {/* 토글 버튼 — flip 컨테이너 밖이라 회전 영향 안 받음 */}
          {canToggleCard && (
            <button
              className="absolute z-10 flex items-center justify-center rounded-full transition-all duration-150 ease-out hover:bg-white/60 active:bg-white/80"
              style={{ left: 10, bottom: 8, width: 38, height: 34 }}
              onClick={() => setShowLyrics(!showLyrics)}
              aria-label={showLyrics ? '그림 보기' : '가사 보기'}
            >
              {showLyrics ? <ImageToggleIcon /> : <LineToggleIcon />}
            </button>
          )}
        </div>
      </div>

      {/* 잔디 영역 — flex-1로 나머지 채움. 카드 위로 끌어올려서 곡선이 카드 하단 1/3에 걸침 */}
      <div
        className="relative flex-1 flex flex-col px-9"
        style={{
          backgroundColor: GRASS_GREEN,
          marginTop: -230,
          paddingTop: 260,
          paddingBottom: 24,
          borderRadius: '50% 50% 0 0 / 60px 60px 0 0',
        }}
      >
        {/* 발자국 장식 — 잔디 영역 전역에 분산 */}
        <GrassSprig style={{ left: '6%', top: 180 }} size={14} />
        <GrassSprig style={{ right: '8%', top: 220 }} size={14} />
        <GrassSprig style={{ left: '12%', bottom: 135 }} />
        <GrassSprig style={{ right: '14%', bottom: 155 }} />
        <GrassSprig style={{ left: '50%', bottom: 120 }} size={14} />

        {/* 좋아요 + 책 아이콘 */}
        <div className="flex items-center justify-between">
          <button
            className="flex items-center gap-2"
            disabled={!likeEnabled || likeMutation.isPending}
            onClick={() => likeMutation.mutate({ wasLiked: diary.isLiked })}
            aria-label="좋아요"
            aria-pressed={diary.isLiked}
          >
            <HeartIcon size={36} color={heartColor} filled={heartFilled} />
            <span
              className="text-[18px]"
              style={{
                fontFamily: "'NanumSquareRound', sans-serif",
                fontWeight: 800,
                color: likeTextColor,
              }}
            >
              {diary.likeCount}
            </span>
          </button>
          {hasOriginal && (
            <button
              onClick={() => setOriginalOpen(true)}
              aria-label="원본 보기"
            >
              <BookIcon size={41} />
            </button>
          )}
        </div>

        {/* 음악 컨트롤 — 좋아요 바로 아래 붙임 */}
        <div className="mt-4">
          {diary.musicUrl ? (
            <CustomMusicPlayer src={diary.musicUrl} />
          ) : (
            <p
              className="text-center text-[14px]"
              style={{
                color: '#5a5a5a',
                fontFamily: "'NanumSquareRound', sans-serif",
                fontWeight: 700,
              }}
            >
              노래를 만들고 있어요...
            </p>
          )}
        </div>

        {/* 공유 토글 — 자연 흐름 하단 (잔디 안 가운데, 좌우 여백) */}
        {diary.isOwner && (
          <div
            className="mt-auto flex items-center px-5 mx-auto w-full"
            style={{
              maxWidth: 320,
              height: 72,
              backgroundColor: SHARE_CARD_GREEN,
              borderRadius: 16,
            }}
          >
            <div className="flex-1">
              <p
                className="text-[17px]"
                style={{
                  fontFamily: "'NanumSquareRound', sans-serif",
                  fontWeight: 800,
                  color: TEXT_BLACK,
                }}
              >
                노래 공유
              </p>
              <p
                className="text-[12px] mt-[3px]"
                style={{
                  fontFamily: "'NanumSquareRound', sans-serif",
                  fontWeight: 500,
                  color: TEXT_BLACK,
                }}
              >
                다른 친구들도 이 노래를 들을 수 있어요!
              </p>
            </div>
            <button
              disabled={publishMutation.isPending}
              onClick={() => publishMutation.mutate({ wasPublic: diary.isPublic })}
              aria-label="공개 토글"
              aria-pressed={diary.isPublic}
            >
              <ToggleSwitch on={diary.isPublic} />
            </button>
          </div>
        )}
      </div>

      {originalOpen && (
        <OriginalContentModal diary={diary} onClose={() => setOriginalOpen(false)} />
      )}

      {deleteConfirmOpen && (
        <DeleteConfirmModal
          onCancel={() => {
            setDeleteConfirmOpen(false)
            deleteMutation.reset()
          }}
          onConfirm={handleConfirmDelete}
          isLoading={deleteMutation.isPending}
          isError={deleteMutation.isError}
        />
      )}
    </div>
  )
}
