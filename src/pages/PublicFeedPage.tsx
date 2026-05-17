import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '@/features/user/hooks/useUser'
import { usePublicDiaries } from '@/features/diary/hooks/usePublicDiaries'
import type { Character } from '@/features/user/types/user.types'
import type { PublicDiaryItem } from '@/features/diary/types/diary.types'

// 피그마 좌표 기준 캐릭터 배치. 캐릭터마다 크기/위치가 다르므로 매핑.
// top 음수면 hero 컨테이너 위로 솟구쳐서 back button 영역까지 침범하게 됨 (DODO 의도된 동작)
const CHARACTER_PORTRAIT: Record<
  Character,
  { src: string; w: number; h: number; top: number; left: number }
> = {
  DODO: { src: '/images/feed-character-dodo.png', w: 100, h: 210, top: -10, left: 36 },
  RERE: { src: '/images/feed-character-rere.png', w: 118, h: 138, top: 56, left: 22 },
  MIMI: { src: '/images/feed-character-mimi.png', w: 145, h: 120, top: 66, left: 14 },
}

function BackChevron() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <path
        d="M15 18l-6-6 6-6"
        stroke="#424242"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function SpeechBubble() {
  // 피그마에서 따온 PNG 자산 (본체 + 좌측 하단 꼬리가 하나로 통합된 흰 도형).
  // 흰 도형이라 자체엔 그림자 없음 → drop-shadow filter로 외곽선에 그림자 적용
  return (
    <div
      className="w-full h-full relative"
      style={{ filter: 'drop-shadow(0px 0px 4px rgba(0,0,0,0.15))' }}
    >
      <img
        src="/images/feed-bubble.png"
        alt=""
        className="absolute inset-0 w-full h-full object-contain"
      />
      {/* 텍스트 — PNG 본체(상단 큰 둥근 사각형) 정중앙에 배치.
          object-contain + PNG 비율(240×141, 본체 y≈12-115) 계산상 본체 중앙은
          컨테이너의 약 45% 지점. height 90% 박스(0~90%) 안에서 flex 중앙 = 45% */}
      <div
        className="absolute inset-x-0 top-0 flex items-center justify-center"
        style={{ height: '90%' }}
      >
        <div
          className="text-center"
          style={{
            fontFamily: "'AndongKaturi', sans-serif",
            fontSize: 22,
            color: '#424242',
            lineHeight: '30px',
          }}
        >
          <p>다른 친구들의</p>
          <p>노래도 들어볼까?</p>
        </div>
      </div>
    </div>
  )
}

function PublicDiaryCard({
  item,
  onClick,
}: {
  item: PublicDiaryItem
  onClick: () => void
}) {
  return (
    <button onClick={onClick} className="group relative z-0 block w-full text-left">
      {/* hover 배경 — 카드 외곽 8px 여유로 살짝 확장. DiaryListPage 와 동일한 패턴 */}
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-x-2 -inset-y-2 -z-10 rounded-[14px] transition-colors duration-150 ease-out group-hover:bg-black/5 group-active:bg-black/10"
      />
      <div
        className="w-full aspect-square overflow-hidden rounded-[10px] bg-white"
        style={{ boxShadow: '0px 0px 6px 0px rgba(0,0,0,0.1)' }}
      >
        <img
          src={item.imageUrl}
          alt=""
          className="w-full h-full object-cover"
        />
      </div>
      <p
        className="mt-[14px] text-[18px] text-[#424242] truncate"
        style={{
          fontFamily: "'NanumSquareRound', sans-serif",
          fontWeight: 700,
          minHeight: '1.2em',
        }}
      >
        {item.introLines ?? ' '}
      </p>
      <p
        className="mt-[4px] text-[14px] text-[#6a6a6a] truncate"
        style={{ fontFamily: "'NanumSquareRound', sans-serif", fontWeight: 700 }}
      >
        {item.authorName}ㆍ{item.date}
      </p>
    </button>
  )
}

export default function PublicFeedPage() {
  const navigate = useNavigate()
  const { data: user } = useUser()

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = usePublicDiaries(20)

  const scrollRef = useRef<HTMLDivElement>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const sentinel = sentinelRef.current
    const root = scrollRef.current
    if (!sentinel || !root || !hasNextPage) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { root, rootMargin: '200px' },
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  const items: PublicDiaryItem[] =
    data?.pages.flatMap((p) => p.diaryList) ?? []

  // 스태거 레이아웃 — 우측 컬럼이 위, 좌측 컬럼이 아래로 오프셋 (피그마 기준)
  // 인덱스 0(최신)이 우측 상단에 오도록: 짝수→우측, 홀수→좌측
  const rightCol = items.filter((_, i) => i % 2 === 0)
  const leftCol = items.filter((_, i) => i % 2 === 1)

  const portrait = user?.character
    ? CHARACTER_PORTRAIT[user.character]
    : CHARACTER_PORTRAIT.DODO

  return (
    <div
      className="w-full flex flex-1 flex-col"
      style={{ backgroundColor: '#faf9f5' }}
    >
      {/* 상단 뒤로가기 */}
      <div className="shrink-0 flex items-center px-[20px] pt-[18px] pb-[6px] relative z-10">
        <button
          onClick={() => navigate(-1)}
          className="rounded-full p-2 -m-2 transition-all duration-150 ease-out hover:bg-black/5 active:bg-black/10"
          aria-label="뒤로가기"
        >
          <BackChevron />
        </button>
      </div>

      {/* 히어로 — 캐릭터 + 말풍선. relative + overflow-visible 로
          DODO 같은 긴 캐릭터가 back button 영역까지 솟구치게 둠 */}
      <div className="shrink-0 relative" style={{ height: 160 }}>
        {/* 말풍선 — 우측 정렬. 캐릭터가 위로 올라와야 하므로 z 낮춤 */}
        <div
          className="absolute"
          style={{ right: 16, top: 18, width: 220, height: 138, zIndex: 1 }}
        >
          <SpeechBubble />
        </div>

        {/* 캐릭터 — 말풍선 앞에 와야 하므로 z 높임 */}
        <img
          src={portrait.src}
          alt=""
          className="absolute pointer-events-none object-contain"
          style={{
            left: portrait.left,
            top: portrait.top,
            width: portrait.w,
            height: portrait.h,
            zIndex: 2,
          }}
        />
      </div>

      {/* 파란 영역 — 스태거 그리드 + 무한 스크롤
          min-h-0: flex item 기본 min-height: auto 때문에 overflow-y-auto 가 작동 안 하는 문제 방지 */}
      <div
        ref={scrollRef}
        className="flex-1 min-h-0 overflow-y-auto"
        style={{ backgroundColor: '#e8f4ff' }}
      >
        {isLoading ? (
          <p
            className="text-center pt-[60px] text-[#7a9bb8] text-[14px]"
            style={{ fontFamily: "'NanumSquareRound', sans-serif", fontWeight: 700 }}
          >
            노래를 불러오고 있어요...
          </p>
        ) : isError ? (
          <p
            className="text-center pt-[60px] text-[#7a9bb8] text-[14px]"
            style={{ fontFamily: "'NanumSquareRound', sans-serif", fontWeight: 700 }}
          >
            일기를 불러오지 못했어요
          </p>
        ) : items.length === 0 ? (
          <p
            className="text-center pt-[60px] text-[#7a9bb8] text-[14px]"
            style={{ fontFamily: "'NanumSquareRound', sans-serif", fontWeight: 700 }}
          >
            아직 공개된 노래가 없어요
          </p>
        ) : (
          <>
            {/* 좌우 패딩 — 좌 24, 우 7. 우측은 스크롤바가 여백에 포함되도록 작게 */}
            <div className="grid grid-cols-2 gap-x-[22px] pt-[28px] pb-[20px]" style={{ paddingLeft: 24, paddingRight: 7 }}>
              {/* 화면 좌측 — 80px 아래로 오프셋 (홀수 인덱스) */}
              <div className="flex flex-col gap-[24px]" style={{ marginTop: 80 }}>
                {leftCol.map((item) => (
                  <PublicDiaryCard
                    key={item.id}
                    item={item}
                    onClick={() => navigate(`/diary/${item.id}`)}
                  />
                ))}
              </div>
              {/* 화면 우측 — top 0 (짝수 인덱스 / 가장 최신부터) */}
              <div className="flex flex-col gap-[24px]">
                {rightCol.map((item) => (
                  <PublicDiaryCard
                    key={item.id}
                    item={item}
                    onClick={() => navigate(`/diary/${item.id}`)}
                  />
                ))}
              </div>
            </div>
            <div ref={sentinelRef} className="h-[1px]" />
            {isFetchingNextPage && (
              <p
                className="text-center pb-[20px] text-[#7a9bb8] text-[13px]"
                style={{ fontFamily: "'NanumSquareRound', sans-serif", fontWeight: 700 }}
              >
                더 가져오는 중...
              </p>
            )}
          </>
        )}
      </div>
    </div>
  )
}
