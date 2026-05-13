import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { userApi } from '@/features/user/api/userApi'

type Character = 'RERE' | 'DODO' | 'MIMI'

// 각 캐릭터의 카드 행 정보
// slotHeight: 캐릭터 이미지 기준 행 높이
// cardOffset: 행 상단 기준 카드의 top 위치
// charLeft/cardLeft: 고정 픽셀 left 값
const CHARACTERS: {
  id: Character
  label: string
  color: string
  cardBg: string
  characterImg: string
  slotHeight: number
  cardOffset: number       // 행 안에서 카드 top
  cardLeft: number
  cardWidth: number
  cardHeight: number
  charLeft: number
  charWidth: number
  marginTop: number        // 이전 행과 겹침 (negative)
}[] = [
  {
    id: 'RERE',
    label: '최고의 작곡가 로우',
    color: '#0f7635',
    cardBg: '/images/card-bg-rere.svg',
    characterImg: '/images/character-rere.png',
    slotHeight: 158,
    cardOffset: 27,   // 268 - 241
    cardLeft: 52,
    cardWidth: 244,
    cardHeight: 103,
    charLeft: 256,
    charWidth: 122,
    marginTop: 0,
  },
  {
    id: 'DODO',
    label: '섬세한 뮤지션 하이',
    color: '#057fdd',
    cardBg: '/images/card-bg-dodo.svg',
    characterImg: '/images/character-dodo.png',
    slotHeight: 211,
    cardOffset: 54,   // 418 - 364
    cardLeft: 95,
    cardWidth: 244,
    cardHeight: 103,
    charLeft: 41,
    charWidth: 86,
    marginTop: -35,   // DODO 시작(364) - RERE 끝(399) = -35
  },
  {
    id: 'MIMI',
    label: '자유로운 영혼 퍼프',
    color: '#883aca',
    cardBg: '/images/card-bg-mimi.svg',
    characterImg: '/images/character-mimi.png',
    slotHeight: 136,
    cardOffset: 11,   // 569 - 558
    cardLeft: 52,
    cardWidth: 244,
    cardHeight: 103,
    charLeft: 214,
    charWidth: 163,
    marginTop: -17,   // MIMI 시작(558) - DODO 끝(575) = -17
  },
]

export default function OnboardingFriendsPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const queryClient = useQueryClient()
  const returnTo = (location.state as { returnTo?: string } | null)?.returnTo
  const [selected, setSelected] = useState<Character | null>(null)
  const [loading, setLoading] = useState(false)

  const handleNext = async () => {
    if (!selected || loading) return
    setLoading(true)
    try {
      await userApi.updateCharacter({ character: selected })
      queryClient.invalidateQueries({ queryKey: ['user', 'me'] })
      navigate(returnTo ?? '/', { replace: true })
    } catch (e) {
      console.error('캐릭터 저장 실패:', e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="w-full min-h-screen flex flex-col items-center justify-center gap-8"
      style={{ backgroundColor: '#faf9f5' }}
    >
      {/* 제목 */}
      <p
        className="text-center text-[35px] text-[#424242] leading-normal"
        style={{ fontFamily: "'AndongKaturi', sans-serif" }}
      >
        너와 함께할
        <br />
        친구를 골라줘!
      </p>

      {/* 캐릭터 카드 묶음 */}
      <div className="flex flex-col w-full">
        {CHARACTERS.map((char) => {
          const isSelected = selected === char.id
          const isOtherSelected = selected !== null && !isSelected

          return (
            <div
              key={char.id}
              className="relative w-full"
              style={{
                height: char.slotHeight,
                marginTop: char.marginTop,
                opacity: isOtherSelected ? 0.2 : 1,
                transition: 'opacity 0.2s',
              }}
            >
              {/* 카드 배경 */}
              <button
                onClick={() => setSelected(char.id)}
                className="absolute rounded-[20px] overflow-hidden"
                style={{
                  top: char.cardOffset,
                  left: char.cardLeft,
                  width: char.cardWidth,
                  height: char.cardHeight,
                  border: 'none',
                  background: 'transparent',
                  zIndex: 1,
                }}
              >
                <img src={char.cardBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
              </button>

              {/* 텍스트 레이블 */}
              <p
                className="absolute text-[23px] pointer-events-none"
                style={{
                  fontFamily: "'AndongKaturi', sans-serif",
                  color: char.color,
                  top: char.cardOffset + 37,
                  left: char.cardLeft + 35,
                  zIndex: 1,
                }}
              >
                {char.label}
              </p>

              {/* 캐릭터 이미지 */}
              <img
                src={char.characterImg}
                alt={char.label}
                className="absolute object-contain pointer-events-none"
                style={{
                  top: 0,
                  left: char.charLeft,
                  width: char.charWidth,
                  height: char.slotHeight,
                  zIndex: 2,
                }}
              />
            </div>
          )
        })}
      </div>

      {/* 다음 버튼 */}
      <button
        onClick={handleNext}
        disabled={!selected || loading}
        className="rounded-[6px] text-[30px] text-white"
        style={{
          fontFamily: "'AndongKaturi', sans-serif",
          width: 170,
          height: 55,
          backgroundColor: selected ? '#91ccff' : '#eeeeee',
          transition: 'background-color 0.2s',
        }}
      >
        다음
      </button>
    </div>
  )
}
