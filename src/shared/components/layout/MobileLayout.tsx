import { Outlet } from 'react-router-dom'
import { Suspense, useEffect, useState } from 'react'
import ToastContainer from '@/shared/components/ui/ToastContainer'
import ErrorBoundary from '@/shared/components/ErrorBoundary'

/** lazy 로드된 페이지의 청크를 받는 짧은 순간 보여줄 스피너 */
function PageLoader() {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-yellow-400" />
    </div>
  )
}

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
 * 모든 환경 통일: 안쪽 콘텐츠는 항상 390x844 px 로 정확히 렌더하고,
 * CSS transform: scale 로 시각적으로만 줄여서 viewport 에 맞춤.
 * - 데스크톱: 회색 배경 + 그림자 (모바일 프리뷰 룩)
 * - 모바일(터치): 그림자 없음. 폰 비율이 9:19.5(=390:844) 와 다르면 회색 바 생김
 * - 어떤 환경에서도 body 스크롤 없이 한 화면에 다 들어옴
 */
export default function MobileLayout() {
  const [scale, setScale] = useState(computeScale)
  const [isTouch] = useState(checkTouch)

  useEffect(() => {
    const onResize = () => setScale(computeScale())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <div className="min-h-[100dvh] flex bg-gray-200">
      <div
        className={`m-auto shrink-0 relative overflow-hidden ${isTouch ? '' : 'shadow-xl'}`}
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
          {/* 페이지에서 throw 된 에러를 잡아 fallback UI 표시. Toast 는 가드 밖에 두어
              fallback 상태에서도 토스트가 떠 있다면 계속 보이게 함. */}
          <ErrorBoundary>
            <Suspense fallback={<PageLoader />}>
              <Outlet />
            </Suspense>
          </ErrorBoundary>
          <ToastContainer />
        </div>
      </div>
    </div>
  )
}
