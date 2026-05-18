import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { userApi } from '@/features/user/api/userApi'
import { getApiErrorStatus } from '@/shared/lib/apiError'

export default function OnboardingNamePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const queryClient = useQueryClient()
  const returnTo = (location.state as { returnTo?: string } | null)?.returnTo
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleNext = async () => {
    if (!name.trim() || loading) return
    setLoading(true)
    setError('')
    try {
      await userApi.updateName({ name: name.trim() })
      queryClient.invalidateQueries({ queryKey: ['user', 'me'] })
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
      <p
        className="text-center text-[35px] text-[#424242] leading-normal"
        style={{ fontFamily: "'AndongKaturi', sans-serif" }}
      >
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
            setName(e.target.value)
            setError('')
          }}
          onKeyDown={(e) => e.key === 'Enter' && handleNext()}
          placeholder="이름 입력"
          maxLength={10}
          className="w-full text-center text-[35px] text-black bg-transparent outline-none placeholder:text-gray-300"
          style={{ fontFamily: "'AndongKaturi', sans-serif" }}
        />
      </div>

      {/* 버튼 + 에러 묶음 */}
      <div className="flex flex-col items-center gap-4">
        <button
          onClick={handleNext}
          disabled={!name.trim() || loading}
          className="rounded-[6px] text-[30px] text-white"
          style={{
            fontFamily: "'AndongKaturi', sans-serif",
            width: 170,
            height: 55,
            backgroundColor: name.trim() ? '#91ccff' : '#eeeeee',
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
