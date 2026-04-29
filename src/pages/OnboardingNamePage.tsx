import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUpdateName } from '@/features/user/hooks/useUser'

export default function OnboardingNamePage() {
  const navigate = useNavigate()
  const { mutate: updateName, isPending } = useUpdateName()
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = () => {
    const trimmed = name.trim()
    if (!trimmed) {
      setError('이름을 입력해 주세요')
      return
    }
    if (trimmed.length > 10) {
      setError('이름은 10자 이하로 입력해 주세요')
      return
    }
    updateName(
      { name: trimmed },
      {
        onSuccess: () => navigate('/onboarding/friends', { replace: true }),
        onError: () => {
          setError('이 이름은 이미 사용중이야.\n다른 이름으로 해볼까?')
        },
      },
    )
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <div className="relative bg-[#faf9f5] overflow-x-hidden" style={{ minHeight: 852 }}>
      {/* Title */}
      <div className="absolute left-1/2 -translate-x-1/2 top-[285px] text-center font-andong text-[35px] leading-normal text-[#424242] whitespace-nowrap">
        <p>만나서 반가워,</p>
        <p>너의 이름은 뭐야?</p>
      </div>

      {/* Input box */}
      <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 flex h-[88px] w-[212px] items-center justify-center rounded-[10px] border border-[rgba(0,0,0,0.23)] bg-white">
        <input
          className="w-full text-center font-andong text-[35px] leading-tight text-black outline-none bg-transparent"
          value={name}
          onChange={(e) => {
            setName(e.target.value)
            setError('')
          }}
          onKeyDown={handleKeyDown}
          autoFocus
          maxLength={10}
        />
      </div>

      {/* Next button */}
      <button
        onClick={handleSubmit}
        disabled={isPending || !name.trim()}
        className="absolute left-1/2 -translate-x-1/2 top-[496px] flex h-[55px] w-[170px] items-center justify-center rounded-[6px] bg-[#91ccff] font-andong text-[30px] text-white disabled:opacity-60"
      >
        다음
      </button>

      {/* Error message */}
      {error && (
        <div className="absolute left-1/2 -translate-x-1/2 top-[600px] text-center font-nanum font-bold text-[18px] text-[#dd2929] whitespace-nowrap leading-normal">
          {error.split('\n').map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
      )}
    </div>
  )
}
