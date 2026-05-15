import { useNavigate } from 'react-router-dom'
import { useAtom } from 'jotai'
import { diaryDraftAtom } from '@/app/store'
import StepProgress from '@/features/diary/components/StepProgress'
import MoodIcon from '@/features/diary/components/MoodIcon'
import type { Mood } from '@/features/diary/types/diary.types'

// 9개의 기분 (값 1~9). Figma 디자인의 3x3 그리드 순서대로 매핑.
const MOODS: { value: Mood; label: string }[] = [
  { value: 1, label: '미소' },
  { value: 2, label: '놀란' },
  { value: 3, label: '눈물' },
  { value: 4, label: '냠냠' },
  { value: 5, label: '속상' },
  { value: 6, label: '하트' },
  { value: 7, label: '멋진' },
  { value: 8, label: '웃는' },
  { value: 9, label: '엥' },
]

export default function DiaryNewMoodPage() {
  const navigate = useNavigate()
  const [draft, setDraft] = useAtom(diaryDraftAtom)

  const canProceed = draft.mood !== null

  const handleNext = () => {
    if (!canProceed) return
    // TODO: 폴링 API 나오면 여기서 diaryApi.create() 호출 후 로딩 화면으로 이동
    // 현재는 draft만 보관하고 홈으로 이동
    console.log('[일기 생성 draft]', draft)
    alert(
      `일기 생성 준비 완료!\n\ntype: ${draft.type}\n${
        draft.type === 'PHOTO' ? `photoUrl: ${draft.photoUrl}` : `text: ${draft.text.slice(0, 30)}...`
      }\nweather: ${draft.weather}\nmood: ${draft.mood}\n\n(API 호출은 폴링 API 나오면 연결 예정)`
    )
    navigate('/', { replace: true })
  }

  return (
    <div className="relative w-full h-full" style={{ backgroundColor: '#faf9f5' }}>
      <StepProgress current={3} />

      <h1
        className="px-[39px] pt-[60px] text-[26px]"
        style={{
          fontFamily: "'AndongKaturi', sans-serif",
          color: '#424242',
        }}
      >
        기분이 어때?
      </h1>

      <div className="px-[57px] mt-[40px] grid grid-cols-3 gap-x-[20px] gap-y-[27px]">
        {MOODS.map((m) => {
          const isSelected = draft.mood === m.value
          return (
            <button
              key={m.value}
              onClick={() => setDraft({ ...draft, mood: m.value })}
              className="rounded-full flex items-center justify-center"
              style={{
                width: 80,
                height: 80,
                opacity: draft.mood !== null && !isSelected ? 0.3 : 1,
                transition: 'opacity 0.15s, transform 0.1s',
                transform: isSelected ? 'scale(1.08)' : 'scale(1)',
                background: 'transparent',
                border: 'none',
                padding: 0,
              }}
              aria-pressed={isSelected}
              aria-label={m.label}
            >
              <MoodIcon mood={m.value} size={80} />
            </button>
          )
        })}
      </div>

      <div className="flex justify-center mt-[50px]">
        <button
          onClick={handleNext}
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
