import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAtomValue } from 'jotai'
import { currentUserAtom } from '@/app/store'
import { useDiaries } from '@/features/diary/hooks/useDiaries'
import DiaryCard from '@/features/diary/components/DiaryCard'
import LoadingSpinner from '@/shared/components/ui/LoadingSpinner'
import type { CharacterType } from '@/features/user/types/user.types'

const CHARACTER_IMAGE: Record<CharacterType, string> = {
  RERE: '/characters/rere.png',
  DODO: '/characters/dodo.png',
  MIMI: '/characters/mimi.png',
}

export default function DiaryListPage() {
  const navigate = useNavigate()
  const user = useAtomValue(currentUserAtom)
  const { data, isLoading } = useDiaries()

  const charImg =
    user?.character && CHARACTER_IMAGE[user.character]
      ? CHARACTER_IMAGE[user.character]
      : '/characters/mimi.png'

  const now = new Date()
  const [year] = useState(now.getFullYear())
  const [month] = useState(now.getMonth() + 1)

  return (
    <div className="min-h-screen bg-[#faf9f5] overflow-x-hidden">
      {/* Profile icon */}
      <div className="pt-[66px] pl-[32px]">
        <img src="/profile.svg" alt="profile" className="h-[22px] w-[22px]" />
      </div>

      {/* Character card */}
      <div className="mx-auto mt-2 w-[344px]">
        <div className="relative h-[163px] w-full rounded-[10px] bg-[#e9f5ff] overflow-visible">
          {/* Wave decorations */}
          <img
            src="/icons/wave.svg"
            alt=""
            className="absolute h-[39px] w-[77px]"
            style={{ left: 34, top: 17 }}
          />
          <img
            src="/icons/wave.svg"
            alt=""
            className="absolute h-[39px] w-[77px] opacity-50"
            style={{ right: -20, bottom: 20 }}
          />

          {/* Character image */}
          <div
            className="absolute overflow-visible"
            style={{ left: 72, bottom: 20, width: 81, height: 208 }}
          >
            <img
              src={charImg}
              alt="character"
              className="w-full h-full object-contain pointer-events-none"
              style={{ transform: 'rotate(6.54deg)', transformOrigin: 'bottom center' }}
            />
          </div>

          {/* Speech bubble */}
          <div
            className="absolute font-andong text-[18px] leading-normal text-[#444]"
            style={{ right: 20, top: 30 }}
          >
            <p>오늘 너의 이야기,</p>
            <p>정말 잘 들었어!</p>
          </div>
        </div>

        {/* Audio strip */}
        <div className="mx-auto mt-0 flex h-[42px] w-[326px] items-center rounded-[10px] bg-[#d3d3d3] px-4 gap-2">
          <span className="text-[16px]">♪</span>
          <span className="font-andong text-[18px] text-[#424242]">내일 다시 만들 수 있어요</span>
        </div>
      </div>

      {/* Green banner */}
      <div className="relative mx-auto mt-4 h-[63px] w-[344px] cursor-pointer" onClick={() => navigate('/feed')}>
        <img src="/icons/banner.svg" alt="" className="absolute inset-0 w-full h-full" />
        <div className="relative flex h-full items-center pl-4">
          <div className="font-andong text-[18px] text-[#424242] leading-[22px]">
            <p>다른 친구들</p>
            <p>노래도 들어볼까?</p>
          </div>
        </div>
        {/* Character in banner */}
        <div
          className="absolute overflow-visible"
          style={{ right: 50, top: -4, width: 49, height: 67 }}
        >
          <img
            src="/characters/rere-small.png"
            alt=""
            className="w-full h-full object-contain pointer-events-none"
            style={{ transform: 'rotate(4.75deg)' }}
          />
        </div>
        {/* Arrow */}
        <img
          src="/icons/chevron-down.svg"
          alt=""
          className="absolute right-[14px] top-[15px] h-[32px] w-[32px]"
        />
      </div>

      {/* Year / Month filter */}
      <div className="mx-auto mt-4 flex gap-3 w-[344px]">
        <div className="flex items-center gap-1 h-[28px] px-4 rounded-full border-2 border-[rgba(145,204,255,0.8)] bg-white">
          <span className="font-nanum font-bold text-[16px] text-[#424242]">{year}</span>
          <img
            src="/icons/arrow-right.svg"
            alt=""
            className="h-[20px] w-[20px]"
            style={{ transform: 'rotate(90deg)' }}
          />
        </div>
        <div className="flex items-center gap-1 h-[28px] px-4 rounded-full border-2 border-[rgba(145,204,255,0.8)] bg-white">
          <span className="font-nanum font-bold text-[16px] text-[#424242]">{month}월</span>
          <img
            src="/icons/arrow-right.svg"
            alt=""
            className="h-[20px] w-[20px]"
            style={{ transform: 'rotate(90deg)' }}
          />
        </div>
      </div>

      {/* Diary list */}
      <div className="mx-auto mt-4 w-[344px] pb-8">
        {isLoading ? (
          <div className="flex justify-center py-16">
            <LoadingSpinner />
          </div>
        ) : !data?.content.length ? (
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <p className="font-andong text-[24px] text-[#424242]">내일 다시 만들 수 있어요</p>
          </div>
        ) : (
          <div className="flex flex-col">
            {data.content.map((diary, idx) => (
              <div key={diary.id} className="relative">
                {/* Vertical timeline line */}
                {idx < data.content.length - 1 && (
                  <div
                    className="absolute bg-[#d3d3d3] rounded-full"
                    style={{ left: 127, top: 128, width: 5, height: 40, zIndex: 0 }}
                  />
                )}
                <div className="relative z-10 mb-10">
                  <DiaryCard
                    diary={diary}
                    onClick={() => navigate(`/diary/${diary.id}`)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
