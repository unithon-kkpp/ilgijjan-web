import { useEffect, useRef, useState } from 'react'
import { PlayTriangle, PauseIcon } from './icons'

const MUSIC_GREEN = '#4CB14C'

interface CustomMusicPlayerProps {
  src: string
}

/**
 * 진행바 + 큰 재생/일시정지 버튼 구성의 자체 audio 플레이어.
 *
 * - 진행바: 클릭으로 시크, thumb 드래그로 시크.
 * - 드래그 중에는 audio 의 timeupdate 를 무시하고 사용자의 thumb 위치만 보여준 뒤,
 *   드래그가 끝나는 순간 audio.currentTime 을 실제로 반영.
 */
export default function CustomMusicPlayer({ src }: CustomMusicPlayerProps) {
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
