import { useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import confetti from 'canvas-confetti'
import { useDiary } from '@/features/diary/hooks/useDiary'
import DiaryDetail from '@/features/diary/components/DiaryDetail'

/**
 * 일기 완성 직후 진입했을 때 (loading 페이지에서 state.justCreated=true 로 navigate)
 * 좌우 양쪽에서 가벼운 파스텔 컨페티를 2회에 걸쳐 터뜨림.
 */
function fireCelebrationConfetti() {
  const colors = ['#9cd1ff', '#ffd6e0', '#fff5b8', '#caf893', '#e6c8ff']

  const burst = (originX: number) => {
    confetti({
      particleCount: 60,
      angle: originX < 0.5 ? 60 : 120,
      spread: 70,
      startVelocity: 45,
      origin: { x: originX, y: 0.7 },
      colors,
      scalar: 0.9,
      ticks: 180,
    })
  }

  burst(0.15)
  burst(0.85)

  // 살짝 늦게 가운데에서 한 번 더 — 부드러운 "연속 폭죽" 느낌
  setTimeout(() => {
    confetti({
      particleCount: 80,
      angle: 90,
      spread: 100,
      startVelocity: 35,
      origin: { x: 0.5, y: 0.65 },
      colors,
      scalar: 0.8,
      ticks: 200,
    })
  }, 250)
}

export default function DiaryDetailPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const diaryId = Number(id)

  const { data: diary, isLoading, isError } = useDiary(diaryId)

  useEffect(() => {
    if (location.state?.justCreated) {
      fireCelebrationConfetti()
      // 새로고침/뒤로가기 시 재발화 방지를 위해 state 제거
      navigate(location.pathname, { replace: true, state: null })
    }
  }, [location.state?.justCreated, location.pathname, navigate])

  if (isLoading) {
    return <div className="w-full flex-1" style={{ backgroundColor: '#FAF9F5' }} />
  }

  if (isError || !diary) {
    return (
      <div
        className="w-full flex-1 flex flex-col items-center justify-center gap-4"
        style={{ backgroundColor: '#FAF9F5' }}
      >
        <p
          className="text-[16px] text-[#424242]"
          style={{ fontFamily: "'NanumSquareRound', sans-serif", fontWeight: 700 }}
        >
          일기를 불러오지 못했어요
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 rounded-[10px] bg-[#91CCFF] text-white"
          style={{ fontFamily: "'NanumSquareRound', sans-serif", fontWeight: 700 }}
        >
          목록으로
        </button>
      </div>
    )
  }

  return <DiaryDetail diary={diary} />
}
