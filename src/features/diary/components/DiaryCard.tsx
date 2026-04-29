import type { Diary, Weather } from '../types/diary.types'

const WEATHER_LABEL: Record<Weather, string> = {
  SUNNY: '쨍쨍했어요',
  CLOUDY: '흐렸어요',
  RAINY: '비가 왔어요',
  SNOWY: '눈이 왔어요',
  WINDY: '바람이 불었어요',
}

const WEATHER_ICON: Record<Weather, string> = {
  SUNNY: '☀️',
  CLOUDY: '☁️',
  RAINY: '🌧️',
  SNOWY: '❄️',
  WINDY: '💨',
}

function formatDate(createdAt: string) {
  const d = new Date(createdAt)
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`
}

interface DiaryCardProps {
  diary: Diary
  onClick?: () => void
}

export default function DiaryCard({ diary, onClick }: DiaryCardProps) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-start gap-4 text-left"
    >
      {/* Thumbnail with play button */}
      <div className="relative h-[128px] w-[128px] flex-shrink-0 rounded-[10px] overflow-hidden bg-gray-100">
        {diary.imageUrl ? (
          <img
            src={diary.imageUrl}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gray-200" />
        )}
        {diary.audioUrl && (
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src="/icons/play.svg"
              alt="play"
              className="h-6 w-6"
              style={{ transform: 'rotate(90deg)', filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.3))' }}
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1 pt-2">
        <p className="font-nanum font-bold text-[18px] text-[#424242]">
          {formatDate(diary.createdAt)}
        </p>
        <div className="flex items-center gap-1">
          <span className="text-[22px] leading-none">{WEATHER_ICON[diary.weather]}</span>
          <span className="font-nanum font-bold text-[14px] text-[#424242]">
            {WEATHER_LABEL[diary.weather]}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <img src="/characters/dodo-mood.png" alt="" className="h-8 w-8 object-cover" />
          <span className="font-nanum font-bold text-[14px] text-[#424242] line-clamp-1 max-w-[140px]">
            {diary.content}
          </span>
        </div>
      </div>
    </button>
  )
}
