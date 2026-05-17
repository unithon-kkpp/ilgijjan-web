import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useUser } from '@/features/user/hooks/useUser'
import { useDiaryStatus } from '@/features/diary/hooks/useDiaryStatus'
import { queryClient } from '@/app/queryClient'
import type { Character } from '@/features/user/types/user.types'

// Figma 노드 기준 캐릭터별 크기/세로 위치.
// - left: 말풍선 오른쪽 여백(15px)과 동일하게 통일
// - top: 말풍선과 세로로 안 겹치게 Figma 기준값에서 +40px씩 아래로 이동
const CHARACTER_LOADING: Record<
  Character,
  { img: string; w: number; h: number; top: number; left: number }
> = {
  DODO: { img: '/images/character-dodo.png', w: 135, h: 360, top: 286, left: 15 },
  RERE: { img: '/images/character-rere.png', w: 168, h: 218, top: 357, left: 15 },
  MIMI: { img: '/images/character-mimi.png', w: 212, h: 176, top: 360, left: 15 },
}

const ERROR_REDIRECT_DELAY_MS = 5000

export default function DiaryNewLoadingPage() {
  const { id } = useParams<{ id: string }>()
  const diaryId = id ? Number(id) : null
  const navigate = useNavigate()
  const { data: user } = useUser()
  const { data: statusData } = useDiaryStatus(diaryId)

  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // 상태 변화에 따라 분기
  useEffect(() => {
    const status = statusData?.status
    if (!status || status === 'PENDING' || diaryId === null) return

    if (status === 'COMPLETED') {
      // 단건 조회 페이지에서 컨페티를 1회 터뜨릴 수 있도록 플래그 전달
      navigate(`/diary/${diaryId}`, { replace: true, state: { justCreated: true } })
      return
    }

    if (status === 'FAILED' || status === 'DELETED') {
      // 백엔드가 음표(noteCount)를 환불해주므로, 홈에서 최신 값이 보이도록 user 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['user', 'me'] })
      setErrorMessage('일기 생성에 실패했어요.\n잠시 후 홈으로 이동할게요.')
      const timer = setTimeout(() => navigate('/', { replace: true }), ERROR_REDIRECT_DELAY_MS)
      return () => clearTimeout(timer)
    }
  }, [statusData?.status, diaryId, navigate])

  const character = user?.character ?? 'DODO'
  const charCfg = CHARACTER_LOADING[character]

  return (
    <div className="relative w-full flex-1 overflow-hidden" style={{ backgroundColor: '#eef9ff' }}>
      {/* 캐릭터 점프 애니메이션 keyframes */}
      <style>{`
        @keyframes jjan-jump {
          0%, 100% { transform: translateY(0); }
          45% { transform: translateY(-22px); }
          50% { transform: translateY(-24px); }
          55% { transform: translateY(-22px); }
        }
        .jjan-jump { animation: jjan-jump 1.4s ease-in-out infinite; }

        @keyframes jjan-error-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .jjan-error-fade-in { animation: jjan-error-fade-in 0.35s ease-out both; }
        @keyframes jjan-error-pop {
          from { opacity: 0; transform: scale(0.9); }
          to   { opacity: 1; transform: scale(1); }
        }
        .jjan-error-pop { animation: jjan-error-pop 0.35s ease-out both; }
      `}</style>

      {/* 구름 장식 (deco-wave SVG 재사용) */}
      <img
        src="/images/deco-wave.svg"
        alt=""
        className="absolute pointer-events-none"
        style={{ left: -55, top: 129, width: 182, height: 92, transform: 'rotate(5.34deg)' }}
      />
      <img
        src="/images/deco-wave.svg"
        alt=""
        className="absolute pointer-events-none"
        style={{ left: 308, top: 93, width: 105, height: 53 }}
      />
      <img
        src="/images/deco-wave.svg"
        alt=""
        className="absolute pointer-events-none"
        style={{ left: 249, top: 496, width: 182, height: 92, transform: 'rotate(5.34deg)', opacity: 0.5 }}
      />
      <img
        src="/images/deco-wave.svg"
        alt=""
        className="absolute pointer-events-none"
        style={{ left: -22, top: 669, width: 105, height: 53 }}
      />

      {/* 말풍선 (Figma 에셋 — 꼬리 포함 PNG). 캐릭터보다 먼저 렌더링해 뒤로 깔리게 함
          top: Figma 290 → 250 (40px 위로 올려 캐릭터와 세로 겹침 줄임) */}
      <div
        className="absolute"
        style={{ left: 144, top: 250, width: 231, height: 136 }}
      >
        <img
          src="/images/speech-bubble-side.png"
          alt=""
          className="absolute inset-0 w-full h-full"
          style={{ filter: 'drop-shadow(0px 0px 6px rgba(0,0,0,0.1))' }}
        />
        {/* 텍스트는 말풍선 본체 중앙에 맞춤
            paddingBottom: 꼬리 영역 일부 제외(살짝 위로 보정)
            paddingRight: 본체가 좌측에 살짝 치우쳐 있어 우측 패딩으로 텍스트 중앙을 왼쪽으로 이동 */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center text-center"
          style={{
            paddingBottom: 16,
            paddingRight: 14,
            fontFamily: "'AndongKaturi', sans-serif",
            color: '#424242',
            fontSize: 18,
            lineHeight: 1.35,
          }}
        >
          <p style={{ whiteSpace: 'nowrap' }}>야호~ 너무 신난다!</p>
          <p style={{ whiteSpace: 'nowrap' }}>같이 눈사람 만들래?</p>
        </div>
      </div>

      {/* 캐릭터 (점프 애니메이션). 말풍선 다음에 렌더링 → 자연스럽게 캐릭터가 앞으로 */}
      <div
        className="absolute pointer-events-none jjan-jump"
        style={{ left: charCfg.left, top: charCfg.top, width: charCfg.w, height: charCfg.h }}
      >
        <img src={charCfg.img} alt="" className="w-full h-full object-contain" />
      </div>

      {/* 하단 안내 문구 */}
      <p
        className="absolute left-0 right-0 text-center"
        style={{
          top: 623,
          fontFamily: "'AndongKaturi', sans-serif",
          fontSize: 17,
          lineHeight: '20px',
          color: 'rgba(0,0,0,0.5)',
        }}
      >
        조금만 기다려줘,
        <br />
        멋진 노래가 곧 완성될 거야!
      </p>

      {/* FAILED 시 전체 화면 어둡게 + 중앙에 큰 에러 안내 */}
      {errorMessage && (
        <div
          className="absolute inset-0 z-30 flex items-center justify-center px-6 jjan-error-fade-in"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
          role="alert"
        >
          <p
            className="jjan-error-pop text-center text-white"
            style={{
              fontFamily: "'AndongKaturi', sans-serif",
              fontSize: 26,
              lineHeight: 1.4,
              whiteSpace: 'pre-line',
              textShadow: '0px 2px 8px rgba(0,0,0,0.3)',
            }}
          >
            {errorMessage}
          </p>
        </div>
      )}
    </div>
  )
}
