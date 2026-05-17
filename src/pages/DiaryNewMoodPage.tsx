import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAtom } from 'jotai'
import axios from 'axios'
import { diaryDraftAtom } from '@/app/store'
import StepProgress from '@/features/diary/components/StepProgress'
import MoodIcon from '@/features/diary/components/MoodIcon'
import { useCreateDiary } from '@/features/diary/hooks/useCreateDiary'
import type { CreateDiaryRequest, Mood } from '@/features/diary/types/diary.types'

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
  const createDiary = useCreateDiary()
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // 토스트 자동 dismiss (3초)
  useEffect(() => {
    if (!toastMessage) return
    const timer = setTimeout(() => setToastMessage(null), 3000)
    return () => clearTimeout(timer)
  }, [toastMessage])

  const canProceed =
    draft.mood !== null &&
    draft.weather !== null &&
    draft.type !== null &&
    (draft.type === 'PHOTO' ? !!draft.photoUrl : draft.text.trim().length > 0) &&
    !createDiary.isPending

  const handleNext = async () => {
    if (!canProceed) return

    // draft를 API 요청 형식으로 매핑 (CreateDiaryRequest는 type별 discriminated union)
    const body: CreateDiaryRequest =
      draft.type === 'PHOTO'
        ? {
            type: 'PHOTO',
            photoUrl: draft.photoUrl as string,
            weather: draft.weather!,
            mood: draft.mood!,
          }
        : {
            type: 'TEXT',
            text: draft.text,
            weather: draft.weather!,
            mood: draft.mood!,
          }

    try {
      const { diaryId } = await createDiary.mutateAsync(body)
      // 생성 요청 성공 → 폴링 로딩 화면으로 이동 (replace로 뒤로가기 방지)
      navigate(`/diary/new/loading/${diaryId}`, { replace: true })
    } catch (e) {
      // 음표 부족(이미 오늘 일기 생성함) 케이스만 별도 안내, 나머지는 일반 에러
      const errorCode =
        axios.isAxiosError(e) ? (e.response?.data as { code?: string } | undefined)?.code : undefined
      if (errorCode === 'INSUFFICIENT_NOTES') {
        setToastMessage('오늘은 이미 일기를 만들었어요.\n내일 다시 와주세요!')
      } else {
        console.error('일기 생성 요청 실패:', e)
        setToastMessage('일기 생성에 실패했어요.\n다시 시도해주세요!')
      }
    }
  }

  return (
    <div className="relative w-full flex-1" style={{ backgroundColor: '#faf9f5' }}>
      {/* 토스트 (INSUFFICIENT_NOTES 등 에러 안내) */}
      {toastMessage && (
        <div
          role="alert"
          className="absolute left-4 right-4 z-30 rounded-[10px] px-4 py-3 text-center text-white text-[14px]"
          style={{
            top: 16,
            backgroundColor: 'rgba(66,66,66,0.92)',
            fontFamily: "'NanumSquareRound', sans-serif",
            fontWeight: 700,
            whiteSpace: 'pre-line',
            boxShadow: '0px 4px 12px rgba(0,0,0,0.15)',
            animation: 'jjan-toast-in 0.25s ease-out both',
          }}
        >
          {toastMessage}
        </div>
      )}
      <style>{`
        @keyframes jjan-toast-in {
          from { opacity: 0; transform: translateY(-12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

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
          {createDiary.isPending ? '...' : '다음'}
        </button>
      </div>
    </div>
  )
}
