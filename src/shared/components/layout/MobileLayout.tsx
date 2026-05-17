import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import ToastContainer from '@/shared/components/ui/ToastContainer'

function checkTouch() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(hover: none) and (pointer: coarse)').matches
}

/**
 * 자연 스크롤 패턴 (인스타/트위터 모바일웹 방식)
 * - 노트북(마우스): 가운데 390px 폭 컬럼, 좌우 회색 배경, 그림자
 * - 휴대폰(터치): 100% 폭 풀스크린
 * - 페이지 높이 고정 안 함. 콘텐츠가 길면 body 가 자연스럽게 스크롤됨.
 *   transform scale, 100dvh 잠금, internal overflow-y-auto 같은 거 다 안 씀
 */
export default function MobileLayout() {
  const [isTouch] = useState(checkTouch)

  return (
    <div className="min-h-[100dvh] bg-gray-200 flex justify-center">
      <div
        className={`w-full bg-white flex flex-col min-h-[100dvh] relative ${
          isTouch ? '' : 'max-w-[390px] shadow-xl'
        }`}
      >
        <Outlet />
        <ToastContainer />
      </div>
    </div>
  )
}
