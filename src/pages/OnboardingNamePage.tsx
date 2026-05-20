import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { userApi } from '@/features/user/api/userApi'
import type { User } from '@/features/user/types/user.types'
import { getApiErrorStatus } from '@/shared/lib/apiError'

// 한글 2점, 영문 1점 가중치로 합산. 최대 10점까지 허용. (숫자/기호/공백은 입력 단계에서 차단)
const NAME_MAX_WEIGHT = 10
// 한글 자모(조합용) + 호환 자모(독립용 ㄱㄴㄷ) + 완성형 음절(가-힣)
const HANGUL_REGEX = /[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3]/
// 이름에 허용되는 문자: 한글 + 영문 알파벳 (숫자/기호/공백 모두 차단)
const NAME_ALLOWED_REGEX = /[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3a-zA-Z]/

function sanitizeName(text: string): string {
  let out = ''
  for (const ch of text) {
    if (NAME_ALLOWED_REGEX.test(ch)) out += ch
  }
  return out
}

function calcNameWeight(text: string): number {
  let total = 0
  for (const ch of text) {
    total += HANGUL_REGEX.test(ch) ? 2 : 1
  }
  return total
}

export default function OnboardingNamePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const queryClient = useQueryClient()
  const returnTo = (location.state as { returnTo?: string } | null)?.returnTo
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const isOverLimit = calcNameWeight(name) > NAME_MAX_WEIGHT
  const canSubmit = !!name.trim() && !isOverLimit && !loading

  const handleNext = async () => {
    if (!canSubmit) return
    setLoading(true)
    setError('')
    try {
      const trimmed = name.trim()
      await userApi.updateName({ name: trimmed })
      queryClient.setQueryData<User>(['user', 'me'], (old) =>
        old ? { ...old, name: trimmed } : old,
      )
      navigate(returnTo ?? '/onboarding/friends', { replace: true })
    } catch (e) {
      // 409 = 이름 중복. 그 외는 일반 에러 메시지.
      if (getApiErrorStatus(e) === 409) {
        setError('이 이름은 이미 사용 중이에요.\n다른 이름으로 해볼까요?')
      } else {
        setError('오류가 발생했어요. 다시 시도해주세요!')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center gap-10"
      style={{ backgroundColor: '#faf9f5' }}
    >
      {/* 제목 */}
      <p className="font-katuri text-center text-[35px] text-[#424242] leading-normal">
        만나서 반가워,
        <br />
        너의 이름은 뭐야?
      </p>

      {/* 입력창 */}
      <div
        className="flex items-center justify-center"
        style={{
          width: 212,
          height: 88,
          backgroundColor: 'white',
          border: '1px solid rgba(0,0,0,0.23)',
          borderRadius: 10,
        }}
      >
        <input
          type="text"
          value={name}
          onChange={(e) => {
            const raw = e.target.value
            // 한글/영문만 통과시키고 숫자/기호/공백은 입력 단계에서 제거
            const next = sanitizeName(raw)
            setName(next)
            if (raw !== next) {
              setError('한글과 영문만 입력할 수 있어요.')
            } else if (calcNameWeight(next) > NAME_MAX_WEIGHT) {
              setError('이름이 너무 길어요.')
            } else {
              setError('')
            }
          }}
          onKeyDown={(e) => e.key === 'Enter' && handleNext()}
          placeholder="이름 입력"
          maxLength={20}
          className="font-katuri w-full text-center text-[35px] text-black bg-transparent outline-none placeholder:text-gray-300"
        />
      </div>

      {/* 버튼 + 에러 묶음 */}
      <div className="flex flex-col items-center gap-4">
        <button
          onClick={handleNext}
          disabled={!canSubmit}
          className="rounded-[6px] text-[30px] text-white"
          style={{
            fontFamily: "'AndongKaturi', sans-serif",
            width: 170,
            height: 55,
            backgroundColor: canSubmit ? '#91ccff' : '#eeeeee',
            transition: 'background-color 0.2s',
          }}
        >
          다음
        </button>

        <p
          className="text-center text-[18px] text-[#dd2929] whitespace-pre-line"
          style={{
            fontFamily: "'NanumSquareRound', sans-serif",
            minHeight: 48,
          }}
        >
          {error}
        </p>
      </div>
    </div>
  )
}
