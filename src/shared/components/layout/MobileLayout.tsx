import { Outlet } from 'react-router-dom'
import { useEffect, useState } from 'react'
import ToastContainer from '@/shared/components/ui/ToastContainer'

const FRAME_W = 390
const FRAME_H = 844

function computeScale() {
  if (typeof window === 'undefined') return 1
  return Math.min(1, window.innerHeight / FRAME_H, window.innerWidth / FRAME_W)
}

function checkTouch() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(hover: none) and (pointer: coarse)').matches
}

/**
 * 노트북/데스크톱(마우스): 안쪽 콘텐츠는 항상 390x844 로 정확히 렌더하고,
 *   CSS transform: scale 로 시각적으로만 줄여서 뷰포트에 딱 맞춤.
 *   - 안쪽 레이아웃은 절대 안 깨짐 (px 가 그대로라서)
 *   - 뷰포트 작으면 그냥 작게 보이고, 한 화면에 다 들어옴
 *   - 창 크기 바뀌면 scale 만 다시 계산
 * 터치 디바이스(휴대폰): 풀스크린(100vw x 100dvh) — 폰은 이미 모바일 크기니까 스케일 안 함
 */
export default function MobileLayout() {
  const [scale, setScale] = useState(computeScale)
  const [isTouch] = useState(checkTouch)

  useEffect(() => {
    if (isTouch) return
    const onResize = () => setScale(computeScale())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [isTouch])

  if (isTouch) {
    // 모바일: 풀스크린 폭 + 최소 100dvh 높이. overflow-hidden 안 잠가서 콘텐츠가 길면 body 가 자연스럽게 스크롤됨.
    // 내부 flex-1 overflow-y-auto 영역은 데스크톱 고정 프레임에서만 활성화되고, 모바일에선 그냥 콘텐츠 사이즈로 흘러감.
    return (
      <div className="relative w-screen min-h-[100dvh] flex flex-col bg-white">
        <Outlet />
        <ToastContainer />
      </div>
    )
  }

  return (
    <div className="min-h-[100dvh] flex bg-gray-200">
      <div
        className="m-auto shrink-0 relative shadow-xl overflow-hidden"
        style={{ width: FRAME_W * scale, height: FRAME_H * scale }}
      >
        <div
          className="absolute top-0 left-0 flex flex-col bg-white overflow-hidden"
          style={{
            width: FRAME_W,
            height: FRAME_H,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
        >
          <Outlet />
          <ToastContainer />
        </div>
      </div>
    </div>
  )
}
