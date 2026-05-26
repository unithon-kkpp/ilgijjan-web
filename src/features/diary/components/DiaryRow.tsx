import { formatDiaryDate } from '../lib/date'
import WeatherIcon from './WeatherIcon'
import MoodIcon from './MoodIcon'
import type { DiaryListItem, Weather } from '../types/diary.types'

const WEATHER_LABEL: Record<Weather, string> = {
  SUNNY: '쨍쨍했어요',
  CLOUDY: '흐렸어요',
  RAINY: '비가 왔어요',
  SNOWY: '눈이 왔어요',
}

interface DiaryRowProps {
  item: DiaryListItem
  onClick: () => void
}

/**
 * COMPLETED 상태 일기 한 줄. 썸네일 + 날짜 + 날씨 + intro 텍스트.
 *
 * hover 배경:
 *  레이아웃 영향 없이 가로로 넓게 띄우려고 absolute 레이어로 분리.
 *  `-z-10` 으로 콘텐츠 뒤에 깔리고, parent `relative z-0` 로 stacking context 생성.
 */
export function DiaryRow({ item, onClick }: DiaryRowProps) {
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
        className="shrink-0 rounded-[10px] overflow-hidden"
        style={{ width: 128, height: 128, backgroundColor: '#e8e8e8' }}
      >
        {item.imageUrl && (
          <img src={item.imageUrl} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" />
        )}
      </div>
      <div className="flex flex-col pt-3 gap-[10px]">
        <p className="font-nanum text-[18px] text-jjan-text" style={{ fontWeight: 700 }}>
          {formatDiaryDate(item.date)}
        </p>
        <div className="flex items-center gap-3">
          <WeatherIcon weather={item.weather} size={32} />
          <p className="font-nanum text-[14px] text-jjan-text" style={{ fontWeight: 700 }}>
            {WEATHER_LABEL[item.weather]}
          </p>
        </div>
        {item.introLines && (
          <div className="flex items-center gap-3">
            <MoodIcon mood={item.mood} size={32} />
            <p className="font-nanum text-[14px] text-jjan-text" style={{ fontWeight: 700 }}>
              {item.introLines}
            </p>
          </div>
        )}
      </div>
    </button>
  )
}

/**
 * PENDING(생성 중) 상태 일기. 썸네일 자리에 "생성중..." 표시.
 * 클릭하면 폴링 화면(/diary/new/loading/:id)으로 이동.
 */
export function PendingDiaryRow({ item, onClick }: DiaryRowProps) {
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
        <span className="font-nanum text-[13px] text-[#7a7a7a]" style={{ fontWeight: 700 }}>
          생성중...
        </span>
      </div>
      <div className="flex flex-col pt-3 gap-[10px]">
        <p className="font-nanum text-[18px] text-jjan-text" style={{ fontWeight: 700 }}>
          {formatDiaryDate(item.date)}
        </p>
        <p className="font-nanum text-[14px] text-[#959595]" style={{ fontWeight: 700 }}>
          노래를 만들고 있어요...
        </p>
      </div>
    </button>
  )
}
