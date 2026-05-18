import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '@/features/user/hooks/useUser'
import { useDiaries } from '@/features/diary/hooks/useDiaries'
import WeatherIcon from '@/features/diary/components/WeatherIcon'
import MoodIcon from '@/features/diary/components/MoodIcon'
import type { Character } from '@/features/user/types/user.types'
import type { DiaryListItem, Weather } from '@/features/diary/types/diary.types'

const CHARACTER_HERO: Record<
  Character,
  { bg: string; img: string; w: number; h: number; offsetY: number }
> = {
  DODO: { bg: '#e9f5ff', img: '/images/character-dodo.png', w: 90, h: 200, offsetY: 0 },
  RERE: { bg: '#e9f5ff', img: '/images/character-rere.png', w: 120, h: 230, offsetY: 30 },
  MIMI: { bg: '#e9f5ff', img: '/images/character-mimi.png', w: 120, h: 230, offsetY: 30 },
}

const WEATHER_LABEL: Record<Weather, string> = {
  SUNNY: '쨍쨍했어요',
  CLOUDY: '흐렸어요',
  RAINY: '비가 왔어요',
  SNOWY: '눈이 왔어요',
}

const APP_START_YEAR = 2026

// API 날짜는 "2026.05.09" 또는 "2026-05-09" 혼용 → 파싱 통일
function parseDateParts(dateStr: string): [number, number, number] {
  const parts = dateStr.split(/[-.]/)
  return [Number(parts[0]), Number(parts[1]), Number(parts[2])]
}

function formatDate(dateStr: string) {
  const [y, m, day] = parseDateParts(dateStr)
  return `${y}년 ${m}월 ${day}일`
}

function ChevronDown({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M6 9l6 6 6-6" stroke="#424242" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

type PickerType = 'year' | 'month'

function FilterPill({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1 rounded-full border-2 bg-white px-3"
      style={{ borderColor: 'rgba(145,204,255,0.8)', height: 28 }}
    >
      <span
        className="text-[16px] text-[#424242]"
        style={{ fontFamily: "'NanumSquareRound', sans-serif", fontWeight: 700 }}
      >
        {label}
      </span>
      <ChevronDown size={16} />
    </button>
  )
}

function FilterPicker({
  type,
  value,
  selectedYear,
  onChange,
  onClose,
}: {
  type: PickerType
  value: number
  selectedYear: number
  onChange: (v: number) => void
  onClose: () => void
}) {
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() + 1

  // 연도: 앱 시작 연도(2026)부터 현재 연도까지
  const years = Array.from(
    { length: currentYear - APP_START_YEAR + 1 },
    (_, i) => APP_START_YEAR + i,
  )

  // 월: 선택된 연도가 올해면 현재 월까지, 이전 연도면 12월까지
  const maxMonth = selectedYear >= currentYear ? currentMonth : 12
  const months = Array.from({ length: maxMonth }, (_, i) => i + 1)

  const items = type === 'year' ? years : months

  // closing 동안 exit 애니메이션 재생 → 패널 slide 끝나면 onClose 호출해 unmount
  const [closing, setClosing] = useState(false)

  function requestClose() {
    if (!closing) setClosing(true)
  }

  function handlePanelAnimationEnd() {
    if (closing) onClose()
  }

  // ESC = 닫기
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        requestClose()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    // absolute → MobileLayout의 relative 컨테이너(390px) 기준으로 배치
    <div
      className={`absolute inset-0 z-50 flex items-end ${closing ? 'animate-fade-out' : 'animate-fade-in'}`}
      style={{ backgroundColor: 'rgba(0,0,0,0.35)' }}
      onClick={requestClose}
    >
      <div
        className={`w-full bg-white rounded-t-[24px] overflow-hidden ${closing ? 'animate-slide-down-modal' : 'animate-slide-up-modal'}`}
        onClick={(e) => e.stopPropagation()}
        onAnimationEnd={handlePanelAnimationEnd}
      >
        {/* 핸들 바 */}
        <div className="flex justify-center pt-3 pb-1">
          <div style={{ width: 48, height: 4, borderRadius: 100, backgroundColor: '#d0d0d0' }} />
        </div>
        <p
          className="text-center py-3 text-[16px] text-[#424242]"
          style={{ fontFamily: "'NanumSquareRound', sans-serif", fontWeight: 700 }}
        >
          {type === 'year' ? '연도 선택' : '월 선택'}
        </p>
        <div className="overflow-y-auto" style={{ maxHeight: '40vh', paddingBottom: 32 }}>
          {items.map((item) => (
            <button
              key={item}
              onClick={() => {
                onChange(item)
                requestClose()
              }}
              className="w-full py-[14px] text-center transition-colors duration-150 ease-out hover:bg-black/5 active:bg-black/10"
              style={{
                fontFamily: "'NanumSquareRound', sans-serif",
                fontSize: 18,
                fontWeight: value === item ? 800 : 400,
                color: value === item ? '#91ccff' : '#424242',
              }}
            >
              {type === 'month' ? `${item}월` : String(item)}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function DiaryRow({ item, onClick }: { item: DiaryListItem; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group relative z-0 flex w-full items-start gap-4 text-left"
    >
      {/* hover 배경 — 레이아웃 영향 없이 가로로 넓게 띄우려고 absolute 레이어로 분리. -z-10 으로 콘텐츠 뒤에 깔림 */}
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-x-5 -inset-y-2 -z-10 rounded-[12px] transition-colors duration-150 ease-out group-hover:bg-black/5 group-active:bg-black/10"
      />
      <div
        className="shrink-0 rounded-[10px] overflow-hidden"
        style={{ width: 128, height: 128, backgroundColor: '#e8e8e8' }}
      >
        {item.imageUrl && (
          <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
        )}
      </div>
      <div className="flex flex-col pt-3 gap-[10px]">
        <p
          className="text-[18px] text-[#424242]"
          style={{ fontFamily: "'NanumSquareRound', sans-serif", fontWeight: 700 }}
        >
          {formatDate(item.date)}
        </p>
        <div className="flex items-center gap-3">
          <WeatherIcon weather={item.weather} size={32} />
          <p
            className="text-[14px] text-[#424242]"
            style={{ fontFamily: "'NanumSquareRound', sans-serif", fontWeight: 700 }}
          >
            {WEATHER_LABEL[item.weather]}
          </p>
        </div>
        {item.introLines && (
          <div className="flex items-center gap-3">
            <MoodIcon mood={item.mood} size={32} />
            <p
              className="text-[14px] text-[#424242]"
              style={{ fontFamily: "'NanumSquareRound', sans-serif", fontWeight: 700 }}
            >
              {item.introLines}
            </p>
          </div>
        )}
      </div>
    </button>
  )
}

// PENDING(생성 중) 일기는 썸네일 없이 '생성중' 표시. 클릭하면 폴링 화면으로 이동
function PendingDiaryRow({ item, onClick }: { item: DiaryListItem; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group relative z-0 flex w-full items-start gap-4 text-left"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-x-5 -inset-y-2 -z-10 rounded-[12px] transition-colors duration-150 ease-out group-hover:bg-black/5 group-active:bg-black/10"
      />
      <div
        className="shrink-0 rounded-[10px] flex items-center justify-center"
        style={{ width: 128, height: 128, backgroundColor: '#e8e8e8' }}
      >
        <span
          className="text-[13px] text-[#7a7a7a]"
          style={{ fontFamily: "'NanumSquareRound', sans-serif", fontWeight: 700 }}
        >
          생성중...
        </span>
      </div>
      <div className="flex flex-col pt-3 gap-[10px]">
        <p
          className="text-[18px] text-[#424242]"
          style={{ fontFamily: "'NanumSquareRound', sans-serif", fontWeight: 700 }}
        >
          {formatDate(item.date)}
        </p>
        <p
          className="text-[14px] text-[#959595]"
          style={{ fontFamily: "'NanumSquareRound', sans-serif", fontWeight: 700 }}
        >
          노래를 만들고 있어요...
        </p>
      </div>
    </button>
  )
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
                  className="absolute left-0 right-0 flex flex-col items-center justify-center text-center"
                  style={{
                    top: 0,
                    height: 74,
                    fontFamily: "'AndongKaturi', sans-serif",
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
            <span
              className="text-[24px] text-[#424242]"
              style={{ fontFamily: "'AndongKaturi', sans-serif" }}
            >
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
              className="flex-1 text-left text-[17px] text-[#424242]"
              style={{ fontFamily: "'AndongKaturi', sans-serif", lineHeight: 1.3 }}
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
            <p
              className="text-center pt-16 text-[#959595] text-[14px]"
              style={{ fontFamily: "'NanumSquareRound', sans-serif" }}
            >
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
