import { useNavigate } from 'react-router-dom'
import { useAtom } from 'jotai'
import { diaryDraftAtom } from '@/app/store'
import StepProgress from '@/features/diary/components/StepProgress'
import WeatherIcon from '@/features/diary/components/WeatherIcon'
import type { Weather } from '@/features/diary/types/diary.types'

const WEATHERS: { id: Weather; bg: string; ring: string }[] = [
  { id: 'SUNNY', bg: 'rgba(193,255,145,0.3)', ring: '#a1c764' },
  { id: 'CLOUDY', bg: '#f8f1db', ring: '#dcb96b' },
  { id: 'RAINY', bg: '#e8e8e8', ring: '#9b9b9b' },
  { id: 'SNOWY', bg: '#d6edfa', ring: '#71bdff' },
]

export default function DiaryNewWeatherPage() {
  const navigate = useNavigate()
  const [draft, setDraft] = useAtom(diaryDraftAtom)

  const canProceed = !!draft.weather

  return (
    <div className="relative w-full flex-1" style={{ backgroundColor: '#faf9f5' }}>
      <StepProgress current={2} />

      <h1
        className="px-[39px] pt-[60px] text-[26px]"
        style={{
          fontFamily: "'AndongKaturi', sans-serif",
          color: '#424242',
        }}
      >
        오늘 날씨는 어땠어?
      </h1>

      <div className="px-[30px] mt-[40px] grid grid-cols-2 gap-x-[13px] gap-y-[16px]">
        {WEATHERS.map((w) => {
          const isSelected = draft.weather === w.id
          return (
            <button
              key={w.id}
              onClick={() => setDraft({ ...draft, weather: w.id })}
              className="rounded-[10px] flex items-center justify-center"
              style={{
                width: 160,
                height: 180,
                backgroundColor: w.bg,
                border: isSelected ? `3px solid ${w.ring}` : '3px solid transparent',
                transition: 'border-color 0.15s',
              }}
              aria-pressed={isSelected}
            >
              <WeatherIcon weather={w.id} size={110} />
            </button>
          )
        })}
      </div>

      <div className="flex justify-center mt-[40px]">
        <button
          onClick={() => navigate('/diary/new/mood')}
          disabled={!canProceed}
          className="rounded-[6px] text-white"
          style={{
            width: 170,
            height: 55,
            backgroundColor: canProceed ? '#91ccff' : '#eeeeee',
            fontFamily: "'AndongKaturi', sans-serif",
            fontSize: 30,
            transition: 'background-color 0.2s',
          }}
        >
          다음
        </button>
      </div>
    </div>
  )
}
