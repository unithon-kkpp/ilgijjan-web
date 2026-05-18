import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '@/features/user/hooks/useUser'
import { useDiaries } from '@/features/diary/hooks/useDiaries'
import { DiaryRow, PendingDiaryRow } from '@/features/diary/components/DiaryRow'
import {
  FilterPill,
  FilterPicker,
  type PickerType,
} from '@/features/diary/components/FilterPicker'
import type { Character } from '@/features/user/types/user.types'
import type { DiaryListItem } from '@/features/diary/types/diary.types'

const CHARACTER_HERO: Record<
  Character,
  { bg: string; img: string; w: number; h: number; offsetY: number }
> = {
  DODO: { bg: '#e9f5ff', img: '/images/character-dodo.png', w: 90, h: 200, offsetY: 0 },
  RERE: { bg: '#e9f5ff', img: '/images/character-rere.png', w: 120, h: 230, offsetY: 30 },
  MIMI: { bg: '#e9f5ff', img: '/images/character-mimi.png', w: 120, h: 230, offsetY: 30 },
}

export default function DiaryListPage() {
  const navigate = useNavigate()
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() + 1

  const [year, setYear] = useState(currentYear)
  const [month, setMonth] = useState(currentMonth)
  const [pickerOpen, setPickerOpen] = useState<PickerType | null>(null)

  const { data: user, isLoading: userLoading } = useUser()
  const { data: diaryData } = useDiaries(year, month)

  // 이름 미설정 유저는 온보딩으로 강제 이동. 렌더 함수 본문에서 navigate 호출하면
  // React 가 "render 중 부수효과" 경고를 내므로 useEffect 안에서 실행.
  const needsOnboarding = !userLoading && user !== undefined && !user.name
  useEffect(() => {
    if (needsOnboarding) navigate('/onboarding/name', { replace: true })
  }, [needsOnboarding, navigate])
  if (needsOnboarding) return null

  // FAILED / DELETED 는 목록에서 숨김. COMPLETED는 정상 표시, PENDING은 '생성중' 카드로 표시
  const diaries: DiaryListItem[] = (diaryData?.diaryList ?? []).filter(
    (d) => d.status === 'COMPLETED' || d.status === 'PENDING',
  )
  const canCreateSong = (user?.noteCount ?? 0) > 0
  const hero = user?.character
    ? CHARACTER_HERO[user.character]
    : { bg: '#e9f5ff', img: '', w: 90, h: 200, offsetY: 0 }
  const speechLines = canCreateSong
    ? [`${user?.name ?? ''}아, 안녕`, '오늘은 어땠어?']
    : ['오늘 너의 이야기,', '정말 잘 들었어!']

  function handleYearChange(newYear: number) {
    setYear(newYear)
    // 선택한 연도가 올해이고 현재 월 선택이 현재 월보다 크면 현재 월로 리셋
    const maxMonth = newYear >= currentYear ? currentMonth : 12
    if (month > maxMonth) setMonth(maxMonth)
  }

  function handleMonthChange(newMonth: number) {
    setMonth(newMonth)
  }

  // userLoading 만 가드 — diariesLoading 까지 가드하면 월 변경 시 페이지 전체가
  // 빈 div 로 대체되며 FilterPicker 가 강제 unmount → 닫힘 애니메이션이 끝나기 전
  // 데이터 도착으로 페이지 재mount → picker 가 다시 올라오는 것처럼 보이는 버그가 생김.
  // 월 전환 중 일기 데이터는 useDiaries 의 placeholderData(keepPreviousData) 가 이전 값을 유지함
  if (userLoading) {
    return <div className="w-full flex-1" style={{ backgroundColor: '#faf9f5' }} />
  }

  return (
    <>
      <div className="w-full flex flex-1 flex-col overflow-hidden" style={{ backgroundColor: '#faf9f5' }}>
        {/* 상단 설정 아이콘 */}
        <div className="shrink-0 flex items-center px-[24px] pt-[20px] pb-1">
          <button
            className="rounded-full p-2 -m-2 transition-all duration-150 ease-out hover:bg-black/5 active:bg-black/10"
            onClick={() => navigate('/profile')}
            aria-label="설정"
          >
            <img src="/images/icon-settings.svg" alt="" style={{ width: 32, height: 32 }} />
          </button>
        </div>

        {/* 히어로 섹션 */}
        <div className="shrink-0 mx-[25px] relative" style={{ paddingTop: 40 }}>
          {/* 파란 카드 */}
          <div
            className="rounded-[10px] relative overflow-hidden"
            style={{ height: 163, backgroundColor: hero.bg }}
          >
            {/* 웨이브 장식 왼쪽 */}
            <img
              src="/images/deco-wave.svg" alt=""
              className="absolute"
              style={{ left: 9, top: 17, width: 77, height: 39 }}
            />
            {/* 웨이브 장식 오른쪽(흐리게) */}
            <img
              src="/images/deco-wave.svg" alt=""
              className="absolute"
              style={{ right: 9, top: 51, width: 77, height: 39, opacity: 0.5 }}
            />

            {/* 말풍선: 카드 우측 절반 영역 안에 중앙 배치, 텍스트는 말풍선 본체(상단) 중앙에 정렬 */}
            <div
              className="absolute flex items-center justify-center"
              style={{ right: 0, top: 0, width: '50%', height: '100%' }}
            >
              <div className="relative" style={{ width: 140, height: 90 }}>
                <img
                  src="/images/speech-bubble.svg"
                  alt=""
                  className="absolute inset-0 w-full h-full"
                />
                {/* 말풍선 본체(SVG의 y=0~63 영역, 렌더링 시 약 74px)에 텍스트 중앙 배치 */}
                <div
                  className="font-katuri absolute left-0 right-0 flex flex-col items-center justify-center text-center"
                  style={{
                    top: 0,
                    height: 74,
                    fontSize: 16,
                    color: '#444',
                    lineHeight: 1.35,
                  }}
                >
                  <p style={{ whiteSpace: 'nowrap' }}>{speechLines[0]}</p>
                  <p style={{ whiteSpace: 'nowrap' }}>{speechLines[1]}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 캐릭터: 히어로 좌측 절반에 배치. offsetY만큼 아래로 내려 카드 위 오버플로우 줄임 */}
          {hero.img && (
            <div
              className="absolute pointer-events-none flex items-end justify-center"
              style={{
                top: hero.offsetY,
                left: 0,
                width: '50%',
                height: 40 + 163, // paddingTop + card height
              }}
            >
              <img
                src={hero.img}
                alt=""
                style={{
                  width: hero.w,
                  height: hero.h,
                  objectFit: 'contain',
                  transform: 'rotate(6.54deg)',
                  transformOrigin: 'center bottom',
                }}
              />
            </div>
          )}

          {/* CTA 버튼 */}
          <button
            onClick={() => canCreateSong && navigate('/diary/new')}
            disabled={!canCreateSong}
            className="w-full rounded-[10px] flex items-center justify-center gap-2 mt-2"
            style={{
              height: 50,
              background: canCreateSong
                ? 'linear-gradient(95.6deg, #9cd1ff 24.3%, #d1eaff 51.2%, #7ec3ff 84.5%)'
                : '#d3d3d3',
            }}
          >
            <img src="/images/icon-music.svg" alt="" style={{ width: 24, height: 24 }} />
            <span className="font-katuri text-[24px] text-[#424242]">
              {canCreateSong ? '오늘의 노래 만들기' : '내일 다시 만들 수 있어요'}
            </span>
          </button>
        </div>

        {/* 공개 피드 배너 */}
        <button
          onClick={() => navigate('/feed')}
          className="shrink-0 mx-[25px] mt-[10px] relative rounded-[10px] overflow-hidden"
          style={{ height: 63 }}
        >
          <img src="/images/banner-bg.svg" alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 flex items-center px-4 gap-2">
            <div
              className="font-katuri flex-1 text-left text-[17px] text-[#424242]"
              style={{ lineHeight: 1.3 }}
            >
              <p>다른 친구들</p>
              <p>노래도 들어볼까?</p>
            </div>
            <img
              src="/images/banner-worm.png"
              alt=""
              style={{ width: 44, height: 60, objectFit: 'contain', transform: 'rotate(4.75deg)' }}
            />
            <img src="/images/icon-arrow-right.svg" alt="" style={{ width: 28, height: 28 }} />
          </div>
        </button>

        {/* 연도 / 월 필터 */}
        <div className="shrink-0 flex items-center gap-[10px] px-[25px] mt-[30px]">
          <FilterPill label={String(year)} onClick={() => setPickerOpen('year')} />
          <FilterPill label={`${month}월`} onClick={() => setPickerOpen('month')} />
        </div>

        {/* 일기 목록 — pt-2 는 첫 row hover 배경이 위로 8px 뻗을 때 overflow에 잘리지 않게 하려는 여유
            min-h-0: flex item 기본 min-height: auto 때문에 overflow-y-auto 가 작동 안 하는 문제 방지 */}
        <div
          className="flex-1 min-h-0 overflow-y-auto mt-4 pt-2 pb-8"
          style={{ paddingLeft: 37, paddingRight: 37 }}
        >
          {diaries.length === 0 ? (
            <p className="font-nanum text-center pt-16 text-[#959595] text-[14px]">
              이 달의 일기가 없어요
            </p>
          ) : (
            <div className="flex flex-col gap-8">
              {diaries.map((item) =>
                item.status === 'PENDING' ? (
                  <PendingDiaryRow
                    key={item.id}
                    item={item}
                    onClick={() => navigate(`/diary/new/loading/${item.id}`)}
                  />
                ) : (
                  <DiaryRow
                    key={item.id}
                    item={item}
                    onClick={() => navigate(`/diary/${item.id}`)}
                  />
                ),
              )}
            </div>
          )}
        </div>
      </div>

      {/* 연도/월 picker 바텀시트 — absolute로 모바일 프레임(390px) 내에 배치 */}
      {pickerOpen && (
        <FilterPicker
          type={pickerOpen}
          value={pickerOpen === 'year' ? year : month}
          selectedYear={year}
          onChange={(v) => {
            if (pickerOpen === 'year') handleYearChange(v)
            else handleMonthChange(v)
          }}
          onClose={() => setPickerOpen(null)}
        />
      )}
    </>
  )
}
