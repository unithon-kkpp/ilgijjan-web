import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUpdateCharacter } from '@/features/user/hooks/useUser'
import type { CharacterType } from '@/features/user/types/user.types'

const CHARACTERS: {
  type: CharacterType
  label: string
  color: string
  cardBg: string
  charImg: string
  charSide: 'left' | 'right'
  cardLeft: number
  cardTop: number
  charLeft: number
  charTop: number
  charWidth: number
  charHeight: number
  textLeft: number
}[] = [
  {
    type: 'RERE',
    label: '최고의 작곡가 로우',
    color: '#0f7635',
    cardBg: '/characters/rere-card.svg',
    charImg: '/characters/rere.png',
    charSide: 'right',
    cardLeft: 52,
    cardTop: 268,
    charLeft: 256,
    charTop: 241,
    charWidth: 122,
    charHeight: 158,
    textLeft: 35,
  },
  {
    type: 'DODO',
    label: '섬세한 뮤지션 하이',
    color: '#057fdd',
    cardBg: '',
    charImg: '/characters/dodo.png',
    charSide: 'left',
    cardLeft: 95,
    cardTop: 418,
    charLeft: 41,
    charTop: 364,
    charWidth: 86,
    charHeight: 211,
    textLeft: 37,
  },
  {
    type: 'MIMI',
    label: '자유로운 영혼 퍼프',
    color: '#883aca',
    cardBg: '/characters/mimi-card.svg',
    charImg: '/characters/mimi.png',
    charSide: 'right',
    cardLeft: 52,
    cardTop: 569,
    charLeft: 214,
    charTop: 558,
    charWidth: 163,
    charHeight: 136,
    textLeft: 22,
  },
]

export default function OnboardingFriendsPage() {
  const navigate = useNavigate()
  const { mutate: updateCharacter, isPending } = useUpdateCharacter()
  const [selected, setSelected] = useState<CharacterType | null>(null)

  const handleConfirm = () => {
    if (!selected) return
    updateCharacter(
      { character: selected },
      { onSuccess: () => navigate('/', { replace: true }) },
    )
  }

  return (
    <div className="relative bg-[#faf9f5] overflow-x-hidden" style={{ minHeight: 852 }}>
      {/* Title */}
      <div
        className="absolute text-center font-andong text-[35px] leading-normal text-[#424242] whitespace-nowrap"
        style={{ left: '50%', transform: 'translateX(-50%)', top: 143 }}
      >
        <p>너와 함께할</p>
        <p>친구를 골라줘!</p>
      </div>

      {/* Character options */}
      {CHARACTERS.map((char) => {
        const isSelected = selected === char.type
        const isFaded = selected !== null && !isSelected

        return (
          <button
            key={char.type}
            onClick={() => setSelected(char.type)}
            className="absolute"
            style={{
              left: Math.min(char.cardLeft, char.charLeft),
              top: Math.min(char.cardTop, char.charTop),
              width:
                Math.max(char.cardLeft + 244, char.charLeft + char.charWidth) -
                Math.min(char.cardLeft, char.charLeft),
              height:
                Math.max(char.cardTop + 103, char.charTop + char.charHeight) -
                Math.min(char.cardTop, char.charTop),
              opacity: isFaded ? 0.2 : 1,
              transition: 'opacity 0.2s',
            }}
          >
            {/* Card background */}
            <div
              className="absolute rounded-[20px]"
              style={{
                left: char.cardLeft - Math.min(char.cardLeft, char.charLeft),
                top: char.cardTop - Math.min(char.cardTop, char.charTop),
                width: 244,
                height: 103,
                backgroundColor: !char.cardBg && isSelected ? 'rgba(207,231,251,0.4)' : !char.cardBg ? 'rgba(207,231,251,0.15)' : undefined,
                border: !char.cardBg && isSelected ? '2px solid #91ccff' : !char.cardBg ? '2px solid rgba(145,204,255,0.4)' : undefined,
              }}
            >
              {char.cardBg && (
                <img
                  src={char.cardBg}
                  alt=""
                  className="absolute inset-0 w-full h-full"
                  style={{ borderRadius: 20 }}
                />
              )}
              {/* Selected border overlay for SVG cards */}
              {char.cardBg && isSelected && (
                <div className="absolute inset-0 rounded-[20px] border-2 border-[#91ccff]" />
              )}
              {/* Label text */}
              <span
                className="absolute font-andong text-[23px] leading-normal"
                style={{
                  left: char.textLeft,
                  top: 37,
                  color: char.color,
                }}
              >
                {char.label}
              </span>
            </div>

            {/* Character image */}
            <img
              src={char.charImg}
              alt={char.label}
              className="absolute object-contain pointer-events-none"
              style={{
                left: char.charLeft - Math.min(char.cardLeft, char.charLeft),
                top: char.charTop - Math.min(char.cardTop, char.charTop),
                width: char.charWidth,
                height: char.charHeight,
              }}
            />
          </button>
        )
      })}

      {/* Next button */}
      <button
        onClick={handleConfirm}
        disabled={!selected || isPending}
        className="absolute left-1/2 -translate-x-1/2 flex h-[55px] w-[170px] items-center justify-center rounded-[6px] font-andong text-[30px] text-white transition-colors"
        style={{
          top: 721,
          backgroundColor: selected ? '#91ccff' : '#eeeeee',
        }}
      >
        다음
      </button>
    </div>
  )
}
