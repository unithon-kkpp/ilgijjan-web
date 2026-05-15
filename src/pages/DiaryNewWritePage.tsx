import { useNavigate } from 'react-router-dom'
import { useAtom } from 'jotai'
import { diaryDraftAtom } from '@/app/store'
import StepProgress from '@/features/diary/components/StepProgress'

export default function DiaryNewWritePage() {
  const navigate = useNavigate()
  const [draft, setDraft] = useAtom(diaryDraftAtom)

  const canProceed = draft.text.trim().length > 0

  return (
    <div className="relative w-full h-full flex flex-col" style={{ backgroundColor: '#faf9f5' }}>
      <StepProgress current={1} />

      <h1
        className="px-[44px] pt-[60px] text-[26px]"
        style={{
          fontFamily: "'AndongKaturi', sans-serif",
          color: '#424242',
        }}
      >
        오늘 하루 어땠어?
      </h1>

      <div className="px-[40px] mt-[14px]">
        <textarea
          value={draft.text}
          onChange={(e) => setDraft({ ...draft, text: e.target.value })}
          placeholder="여기에 일기를 입력해주세요."
          className="w-full bg-[#e2efff] rounded-[10px] p-[25px] outline-none resize-none placeholder:text-[#9aa3b2]"
          style={{
            height: 397,
            fontFamily: "'NanumSquareRound', sans-serif",
            fontSize: 16,
            lineHeight: '24px',
            color: '#424242',
          }}
        />
      </div>

      <div className="flex justify-center mt-[14px]">
        <button
          onClick={() => navigate('/diary/new/weather')}
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
