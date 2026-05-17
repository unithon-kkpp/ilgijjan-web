import { Outlet } from 'react-router-dom'
import { useEffect, useState } from 'react'
import ToastContainer from '@/shared/components/ui/ToastContainer'

const FRAME_W = 390
const FRAME_H = 844

function getVh() {
  if (typeof window === 'undefined') return 0
  return window.innerHeight
}

function getVw() {
  if (typeof window === 'undefined') return 0
  return window.innerWidth
}

function checkTouch() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(hover: none) and (pointer: coarse)').matches
}

/**
 * 노트북/데스크톱(마우스): 안쪽은 항상 390x844 로 정확히 렌더하고
 *   transform: scale 로 시각적으로만 줄여서 뷰포트에 딱 맞춤. 콘텐츠 레이아웃은 안 깨짐.
 * 터치 디바이스(휴대폰): window.innerHeight 직접 측정해서 풀스크린.
 *   - CSS 100vh/100dvh 는 iOS Safari / KakaoTalk 인앱 브라우저 등에서 부정확한 케이스 많음
 *   - JS 로 실제 보이는 영역 측정값을 박아주는 게 가장 확실
 */
export default function MobileLayout() {
  const [vw, setVw] = useState(getVw)
  const [vh, setVh] = useState(getVh)
  const [isTouch] = useState(checkTouch)

  useEffect(() => {
    const update = () => {
      setVw(window.innerWidth)
      setVh(window.innerHeight)
    }
    window.addEventListener('resize', update)
    window.addEventListener('orientationchange', update)
    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('orientationchange', update)
    }
  }, [])

  if (isTouch) {
    return (
      <div
        className="relative w-full flex flex-col bg-white overflow-hidden"
        style={{ height: vh }}
      >
        <Outlet />
        <ToastContainer />
      </div>
    )
  }

  const scale = Math.min(1, vh / FRAME_H, vw / FRAME_W)

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
