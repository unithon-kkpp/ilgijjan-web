import { useNavigate } from 'react-router-dom'
import { useSetAtom } from 'jotai'
import { diaryDraftAtom, emptyDiaryDraft } from '@/app/store'
import { useUser } from '@/features/user/hooks/useUser'
import type { Character } from '@/features/user/types/user.types'

// 캐릭터별 독립 컴포넌트 — 위치·크기 각자 고정
function DodoCharacter() {
  return (
    <img
      src="/images/character-dodo.png"
      alt="dodo"
      className="absolute object-contain"
      style={{ top: -15, left: 44, width: 100, height: 'auto' }}
    />
  )
}

function RereCharacter() {
  return (
    <img
      src="/images/character-rere.png"
      alt="rere"
      className="absolute object-contain"
      style={{ top: 30, left: 44, width: 150, height: 'auto' }}
    />
  )
}

function MimiCharacter() {
  return (
    <img
      src="/images/character-mimi.png"
      alt="mimi"
      className="absolute object-contain"
      style={{ top: 10, left: 44, width: 140, height: 'auto' }}
    />
  )
}

const CHARACTER_COMPONENT: Record<Character, () => JSX.Element> = {
  DODO: DodoCharacter,
  RERE: RereCharacter,
  MIMI: MimiCharacter,
}

export default function DiaryNewEntryPage() {
  const navigate = useNavigate()
  const { data: user } = useUser()
  const setDraft = useSetAtom(diaryDraftAtom)

  const character = user?.character ?? 'DODO'
  const CharacterComponent = CHARACTER_COMPONENT[character]

  const handleSelect = (type: 'PHOTO' | 'TEXT') => {
    setDraft({ ...emptyDiaryDraft, type })
    navigate(type === 'PHOTO' ? '/diary/new/photo' : '/diary/new/write')
  }

  return (
    <div
      className="relative w-full flex-1 flex flex-col"
      style={{ backgroundColor: '#eef9ff' }}
    >
      {/* ── 상단 하늘 영역 (고정 높이) ── */}
      <div className="relative shrink-0" style={{ height: 283 }}>
        {/* 뒤로가기 버튼 */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-[20px] left-[18px] z-20 w-8 h-8 flex items-center justify-center"
          aria-label="뒤로가기"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M15 6L9 12L15 18"
              stroke="#424242"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* 구름 (오른쪽 상단) */}
        <img
          src="/images/cloud.svg"
          alt=""
          className="absolute pointer-events-none"
          style={{ top: 28, right: -10, width: 105, height: 53 }}
        />
      </div>

      {/* ── 잔디 영역 (남은 공간을 채우고, 카드는 일반 흐름으로 배치) ── */}
      <div
        className="relative flex-1 flex flex-col items-center"
        style={{
          backgroundColor: '#caf893',
          borderTopLeftRadius: '50% 60px',
          borderTopRightRadius: '50% 60px',
          paddingTop: 97,
          paddingBottom: 40,
          gap: 30,
        }}
      >
        {/* 사진 찍기 카드 */}
        <button
          onClick={() => handleSelect('PHOTO')}
          className="flex items-center justify-center shrink-0"
          style={{
            width: 317,
            height: 145,
            backgroundColor: '#a9ecfd',
            borderRadius: 10,
            boxShadow: '0px 4px 0px 0px #71bdff',
          }}
        >
          <span className="text-[44px]" aria-hidden>
            🔍
          </span>
          <div className="ml-3 text-left" style={{ color: '#424242' }}>
            <p style={{ fontFamily: "'AndongKaturi', sans-serif", fontSize: 36, lineHeight: '40px' }}>
              사진 찍기
            </p>
            <p
              style={{
                fontFamily: "'NanumSquareRound', sans-serif",
                fontSize: 17,
                fontWeight: 700,
                marginTop: 4,
              }}
            >
              일기를 카메라로 찍어보자!
            </p>
          </div>
        </button>

        {/* 새로 쓰기 카드 */}
        <button
          onClick={() => handleSelect('TEXT')}
          className="flex items-center justify-center shrink-0"
          style={{
            width: 317,
            height: 145,
            backgroundColor: '#fffbd8',
            borderRadius: 10,
            boxShadow: '0px 4px 0px 0px #d5b486',
          }}
        >
          <span className="text-[44px]" aria-hidden>
            ✏️
          </span>
          <div className="ml-3 text-left" style={{ color: '#424242' }}>
            <p style={{ fontFamily: "'AndongKaturi', sans-serif", fontSize: 36, lineHeight: '40px' }}>
              새로 쓰기
            </p>
            <p
              style={{
                fontFamily: "'NanumSquareRound', sans-serif",
                fontSize: 17,
                fontWeight: 700,
                marginTop: 4,
              }}
            >
              함께 새로운 일기를 쓰자!
            </p>
          </div>
        </button>
      </div>

      {/* ── 캐릭터 + 말풍선 (최상위 레이어, 클릭은 통과) ── */}
      <div
        className="absolute left-0 right-0 pointer-events-none z-10"
        style={{ top: 95 }}
      >
        <CharacterComponent />
        <div
          className="absolute bg-white rounded-[16px] flex items-center justify-center text-center"
          style={{
            top: 50,
            right: 18,
            width: 178,
            height: 96,
            boxShadow: '0px 0px 6px 0px rgba(0,0,0,0.1)',
            fontFamily: "'AndongKaturi', sans-serif",
            color: '#424242',
            fontSize: 20,
            lineHeight: '26px',
          }}
        >
          <span>
            오늘의 일기,
            <br />
            어떻게 시작할까?
          </span>
          {/* 말풍선 꼬리 */}
          <div
            className="absolute"
            style={{
              left: -10,
              top: 40,
              width: 0,
              height: 0,
              borderTop: '8px solid transparent',
              borderBottom: '8px solid transparent',
              borderRight: '14px solid white',
            }}
          />
        </div>
      </div>
    </div>
  )
}
