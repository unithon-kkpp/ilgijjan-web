import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Diary } from '../types/diary.types'
import { useTogglePublish } from '../hooks/useTogglePublish'
import { useLike } from '@/features/like/hooks/useLike'
import WeatherIcon from './WeatherIcon'
import MoodIcon from './MoodIcon'

interface DiaryDetailProps {
  diary: Diary
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
  // Figma solar:book-bold-duotone 벡터 3개 합성
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      {/* 뒤표지 (어두운 파랑) */}
      <svg
        preserveAspectRatio="none"
        viewBox="0 0 27.3325 6.83333"
        fill="none"
        className="absolute"
        style={{ top: '75%', right: '16.67%', bottom: '8.33%', left: '16.67%' }}
      >
        <path
          d="M5.85188 0H27.3325C27.3273 1.58875 27.2949 2.77263 27.1394 3.70708C26.9515 4.82263 26.6098 5.412 26.0871 5.83225C25.5626 6.2525 24.828 6.52754 23.4392 6.67617C22.0093 6.82992 20.1148 6.83333 17.3985 6.83333H9.83059C7.11434 6.83333 5.21809 6.83163 3.78992 6.67617C2.40105 6.52754 1.66646 6.2525 1.142 5.83225C0.617547 5.412 0.277588 4.82262 0.0896712 3.70879L0.0520882 3.45083C-0.0162452 2.95371 -0.0504119 2.70429 0.164838 2.11833C0.381796 1.53067 0.474046 1.44013 0.661963 1.25563C1.27106 0.675627 2.03231 0.280486 2.85717 0.116168C3.35259 0.0102514 4.00175 0 5.85188 0Z"
          fill="#4480C9"
        />
      </svg>
      {/* 책 본체 (밝은 파랑) */}
      <svg
        preserveAspectRatio="none"
        viewBox="0 0 27.3333 30.2375"
        fill="none"
        className="absolute"
        style={{ top: '8.33%', right: '16.67%', bottom: '17.92%', left: '16.67%' }}
      >
        <path
          d="M1.24196 1.25221C1.76471 0.726042 2.49587 0.384375 3.87962 0.196458C5.30437 0.00341669 7.19038 0 9.89638 0H17.437C20.143 0 22.029 0.00341669 23.4537 0.196458C24.8375 0.384375 25.5686 0.726042 26.0914 1.25221C26.6124 1.77837 26.9524 2.51637 27.1386 3.91208C27.3299 5.34708 27.3333 7.25187 27.3333 9.98008V27.3333H5.85275C4.00092 27.3333 3.35517 27.3436 2.85804 27.4495C1.98167 27.6374 1.21804 28.0423 0.662833 28.589C0.474917 28.7735 0.382667 28.864 0.165709 29.4517C0.0631747 29.7014 0.00702035 29.9677 0 30.2375V9.98008C0 7.25187 0.00341639 5.34879 0.19475 3.91208C0.380958 2.51808 0.720917 1.77837 1.24196 1.25221Z"
          fill="#91CCFF"
        />
      </svg>
      {/* 책 안 두 줄 */}
      <svg
        preserveAspectRatio="none"
        viewBox="0 0 16.2292 8.54167"
        fill="none"
        className="absolute"
        style={{ top: '26.04%', right: '30.21%', bottom: '53.13%', left: '30.21%' }}
      >
        <path
          d="M0 1.28125C0 0.941441 0.134988 0.61555 0.375269 0.375269C0.61555 0.134988 0.941441 0 1.28125 0H14.9479C15.2877 0 15.6136 0.134988 15.8539 0.375269C16.0942 0.61555 16.2292 0.941441 16.2292 1.28125C16.2292 1.62106 16.0942 1.94695 15.8539 2.18723C15.6136 2.42751 15.2877 2.5625 14.9479 2.5625H1.28125C0.941441 2.5625 0.61555 2.42751 0.375269 2.18723C0.134988 1.94695 0 1.62106 0 1.28125ZM1.28125 5.97917C0.941441 5.97917 0.61555 6.11416 0.375269 6.35444C0.134988 6.59472 0 6.92061 0 7.26042C0 7.60023 0.134988 7.92612 0.375269 8.1664C0.61555 8.40668 0.941441 8.54167 1.28125 8.54167H9.82292C10.1627 8.54167 10.4886 8.40668 10.7289 8.1664C10.9692 7.92612 11.1042 7.60023 11.1042 7.26042C11.1042 6.92061 10.9692 6.59472 10.7289 6.35444C10.4886 6.11416 10.1627 5.97917 9.82292 5.97917H1.28125Z"
          fill="#4480C9"
        />
      </svg>
    </div>
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
        className="mt-10 transition-transform duration-150 ease-out active:scale-90"
        style={{ width: 68, height: 68, WebkitTapHighlightColor: 'transparent' }}
        onClick={toggle}
        aria-label={playing ? '일시정지' : '재생'}
      >
        {playing ? <PauseIcon size={68} /> : <PlayTriangle size={68} />}
      </button>
    </div>
  )
}

function OriginalContentModal({ diary, onClose }: { diary: Diary; onClose: () => void }) {
  return (
    <div
      className="absolute inset-0 z-40 flex items-end justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
      onClick={onClose}
    >
      <div
        className="w-full bg-white rounded-t-[28px] overflow-hidden"
        style={{ height: '70%' }}
        onClick={(e) => e.stopPropagation()}
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

export default function DiaryDetail({ diary }: DiaryDetailProps) {
  const navigate = useNavigate()

  const hasLyrics = !!diary.lyrics
  const hasImage = !!diary.imageUrl
  // 기본: 그림(AI 생성 이미지) 모드. 그림이 없을 때만 가사 모드로 시작.
  const [showLyrics, setShowLyrics] = useState<boolean>(!hasImage)
  const [originalOpen, setOriginalOpen] = useState(false)

  const likeMutation = useLike(diary.diaryId)
  const publishMutation = useTogglePublish(diary.diaryId)

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
          className="transition-transform duration-150 ease-out active:scale-90"
          style={{ WebkitTapHighlightColor: 'transparent' }}
          onClick={() => navigate(-1)}
          aria-label="뒤로가기"
        >
          <ChevronLeft size={32} />
        </button>
        {diary.isOwner ? (
          <button
            className="transition-transform duration-150 ease-out active:scale-90"
            style={{ WebkitTapHighlightColor: 'transparent' }}
            aria-label="삭제"
          >
            <TrashIcon size={26} />
          </button>
        ) : (
          <div style={{ width: 26, height: 26 }} />
        )}
      </div>

      {/* 날짜 + 날씨 + 무드 */}
      <div className="shrink-0 flex items-center justify-between px-8 pt-3 pb-4">
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

      {/* 카드 영역 — z-10으로 잔디 위에 떠 있음 */}
      <div className="relative shrink-0 px-5 z-10">
        <div
          className="w-full rounded-[20px] relative overflow-hidden"
          style={{ aspectRatio: '1 / 1' }}
        >
          {showLyrics ? (
            <div
              className="w-full h-full overflow-y-auto"
              style={{ backgroundColor: LYRICS_BLUE, padding: '32px 40px' }}
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
          ) : hasImage ? (
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

          {canToggleCard && (
            <button
              className="absolute flex items-center justify-center rounded-full transition-all duration-150 ease-out hover:bg-white/60 active:bg-white/80 active:scale-90"
              style={{ left: 10, bottom: 8, width: 38, height: 34, WebkitTapHighlightColor: 'transparent' }}
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
            className="flex items-center gap-2 transition-transform duration-150 ease-out active:scale-90 disabled:active:scale-100"
            style={{ WebkitTapHighlightColor: 'transparent' }}
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
              className="transition-transform duration-150 ease-out active:scale-90"
              style={{ WebkitTapHighlightColor: 'transparent' }}
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
              className="transition-transform duration-150 ease-out active:scale-90 disabled:active:scale-100"
              style={{ WebkitTapHighlightColor: 'transparent' }}
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
    </div>
  )
}
