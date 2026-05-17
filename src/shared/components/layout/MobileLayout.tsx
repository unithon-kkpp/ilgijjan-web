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
 *   - 창 크기 바뀌면 scale 만 다시 계산
 * 터치 디바이스(휴대폰): 100vw + min-h-[100dvh], overflow 잠금 해제.
 *   - 콘텐츠가 viewport 보다 길면 body 가 자연스럽게 스크롤됨
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
    // 모바일: 390:844 비율 유지. 높이 = 100vw * 844/390 (전화기 폭에 맞춰 비율 계산).
    //  - 폰 viewport 가 이 높이보다 짧으면 body 스크롤
    //  - height 가 명시(픽셀 계산값)라서 자식 flex-1 + overflow-y-auto 내부 스크롤 정상 작동
    return (
      <div
        className="relative w-screen flex flex-col bg-white"
        style={{ height: 'calc(100vw * 844 / 390)' }}
      >
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
