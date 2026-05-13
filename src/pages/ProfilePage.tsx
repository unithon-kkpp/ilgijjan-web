import { useNavigate } from 'react-router-dom'
import { useUser } from '@/features/user/hooks/useUser'
import type { Character } from '@/features/user/types/user.types'

const CHARACTER_THEME: Record<Character, { panelBg: string; img: string; scale: number }> = {
  DODO: { panelBg: '#e4f0f8', img: '/images/character-dodo.png', scale: 1 },
  RERE: { panelBg: '#e6f5e2', img: '/images/character-rere.png', scale: 0.8 },
  MIMI: { panelBg: '#f1e5f7', img: '/images/character-mimi.png', scale: 0.8 },
}

function ChevronLeftIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <path
        d="M15 6l-6 6 6 6"
        stroke="#424242"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function PencilIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path
        d="M14.5 2.5a1.5 1.5 0 0 1 2.12 0l.88.88a1.5 1.5 0 0 1 0 2.12L6.5 16.5l-3.5.5.5-3.5L14.5 2.5z"
        stroke="#424242"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function ProfilePage() {
  const navigate = useNavigate()
  const { data: user, isLoading } = useUser()

  if (isLoading || !user) {
    return <div className="w-full min-h-screen bg-white" />
  }

  const theme = user.character ? CHARACTER_THEME[user.character] : null
  const goToCharacterEdit = () =>
    navigate('/onboarding/friends', { state: { returnTo: '/profile' }, replace: true })
  const goToNameEdit = () =>
    navigate('/onboarding/name', { state: { returnTo: '/profile' }, replace: true })

  return (
    <div className="w-full min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="h-14 flex items-center px-4">
        <button onClick={() => navigate(-1)} aria-label="뒤로가기">
          <ChevronLeftIcon />
        </button>
      </header>

      {/* Avatar */}
      <div className="flex flex-col items-center">
        <button
          onClick={goToCharacterEdit}
          className="relative"
          style={{ width: 152, height: 154 }}
          aria-label="캐릭터 변경"
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{
              backgroundColor: theme?.panelBg ?? '#f9f9f9',
              border: '1px solid #d9d9d9',
            }}
          />
          {theme && (
            <img
              src={theme.img}
              alt={user.character ?? ''}
              className="absolute object-contain"
              style={{
                top: 13,
                left: 13,
                width: 126,
                height: 127,
                transform: `scale(${theme.scale})`,
              }}
            />
          )}
          <div
            className="absolute flex items-center justify-center rounded-full bg-white"
            style={{
              right: 6,
              bottom: 6,
              width: 26,
              height: 26,
              border: '1px solid #d9d9d9',
            }}
          >
            <PencilIcon size={13} />
          </div>
        </button>

        {/* Name */}
        <button
          onClick={goToNameEdit}
          className="mt-8 w-full flex justify-center"
          aria-label="이름 변경"
        >
          <span className="relative inline-block">
            <span
              className="text-[32px] leading-none"
              style={{ fontFamily: "'AndongKaturi', sans-serif", color: '#424242' }}
            >
              {user.name ?? ''}
            </span>
            <span
              className="absolute top-1/2 -translate-y-1/2"
              style={{ left: 'calc(100% + 6px)' }}
            >
              <PencilIcon size={16} />
            </span>
          </span>
        </button>
      </div>

      {/* Settings panel */}
      <div
        className="mt-10 flex-1 w-full flex flex-col"
        style={{ backgroundColor: theme?.panelBg ?? '#f9f9f9' }}
      >
        <div className="px-12 pt-12 flex-1">
          {/* 알림 */}
          <p
            className="text-[10px] tracking-wide"
            style={{ fontFamily: "'NanumSquareRound', sans-serif", color: '#424242' }}
          >
            알림
          </p>
          <div className="mt-2 flex items-center justify-between">
            <span
              className="text-[14px]"
              style={{ fontFamily: "'NanumSquareRound', sans-serif", color: '#424242' }}
            >
              전체 알림
            </span>
            <Toggle on={user.isNotificationEnabled} />
          </div>

          {/* 로그아웃 / 계정 탈퇴 */}
          <div className="mt-32 space-y-4">
            <p
              className="text-[14px]"
              style={{ fontFamily: "'NanumSquareRound', sans-serif", color: '#424242' }}
            >
              로그아웃
            </p>
            <p
              className="text-[14px]"
              style={{ fontFamily: "'NanumSquareRound', sans-serif", color: '#424242' }}
            >
              계정 탈퇴
            </p>
          </div>
        </div>

        {/* contact */}
        <div className="flex justify-center pb-10">
          <div
            className="flex items-center justify-center rounded-full bg-white"
            style={{
              width: 99,
              height: 40,
              border: '1px solid #d9d9d9',
            }}
          >
            <span
              className="text-[14px]"
              style={{ fontFamily: "'NanumSquareRound', sans-serif", color: '#424242' }}
            >
              contact
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function Toggle({ on }: { on: boolean }) {
  return (
    <div
      className="relative rounded-full"
      style={{
        width: 40,
        height: 24,
        backgroundColor: on ? '#91ccff' : '#d9d9d9',
        transition: 'background-color 0.2s',
      }}
    >
      <div
        className="absolute rounded-full bg-white"
        style={{
          top: 2,
          left: on ? 18 : 2,
          width: 20,
          height: 20,
          boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
          transition: 'left 0.2s',
        }}
      />
    </div>
  )
}
