import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '@/features/user/hooks/useUser'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useToast } from '@/shared/hooks/useToast'
import ConfirmDialog from '@/shared/components/ui/ConfirmDialog'
import BackButton from '@/shared/components/ui/BackButton'
import type { Character } from '@/features/user/types/user.types'

const INSTAGRAM_URL = 'https://www.instagram.com/diary.jjan'
const KAKAO_CHANNEL_URL = 'https://pf.kakao.com/_FPrsX/chat'

const CHARACTER_THEME: Record<Character, { panelBg: string; img: string; scale: number }> = {
  DODO: { panelBg: '#e4f0f8', img: '/images/character-dodo.png', scale: 1 },
  RERE: { panelBg: '#e6f5e2', img: '/images/character-rere.png', scale: 0.8 },
  MIMI: { panelBg: '#f1e5f7', img: '/images/character-mimi.png', scale: 0.8 },
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
  const { logout, withdraw } = useAuth()
  const { showToast } = useToast()

  const [logoutOpen, setLogoutOpen] = useState(false)
  const [withdrawOpen, setWithdrawOpen] = useState(false)

  if (isLoading || !user) {
    return <div className="w-full flex-1 bg-white" />
  }

  const theme = user.character ? CHARACTER_THEME[user.character] : null
  // replace 안 씀 — /profile 이 history에 남아야 onboarding 페이지에서 브라우저 뒤로가기 시 설정으로 복귀함
  const goToCharacterEdit = () =>
    navigate('/onboarding/friends', { state: { returnTo: '/profile' } })
  const goToNameEdit = () =>
    navigate('/onboarding/name', { state: { returnTo: '/profile' } })

  return (
    <div className="w-full flex flex-1 flex-col bg-white relative">
      {/* Header */}
      <header className="h-14 shrink-0 flex items-center px-4">
        <BackButton
          size={28}
          strokeWidth={1.8}
          className="w-10 h-10 flex items-center justify-center rounded-full transition-colors hover:bg-black/5 active:bg-black/10"
        />
      </header>

      {/* Avatar */}
      <div className="shrink-0 flex flex-col items-center">
        <button
          onClick={goToCharacterEdit}
          className="relative group transition-opacity hover:opacity-90"
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
            className="absolute flex items-center justify-center rounded-full bg-white transition-colors group-hover:bg-[#f0f0f0]"
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
          className="mt-8 w-full flex justify-center transition-opacity hover:opacity-60"
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
        className="mt-10 flex-1 w-full flex flex-col px-12 pt-12"
        style={{ backgroundColor: theme?.panelBg ?? '#f9f9f9' }}
      >
        {/* 문의하기 */}
        <p
          className="text-[18px]"
          style={{ fontFamily: "'NanumSquareRound', sans-serif", fontWeight: 800, color: '#424242' }}
        >
          문의하기
        </p>
        <div className="mt-6 space-y-2">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="-mx-3 px-3 py-2 flex items-center rounded-lg transition-colors hover:bg-black/5 active:bg-black/10"
          >
            <span
              className="text-[16px]"
              style={{ fontFamily: "'NanumSquareRound', sans-serif", fontWeight: 700, color: '#424242' }}
            >
              Instagram
            </span>
          </a>
          <a
            href={KAKAO_CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="-mx-3 px-3 py-2 flex items-center rounded-lg transition-colors hover:bg-black/5 active:bg-black/10"
          >
            <span
              className="text-[16px]"
              style={{ fontFamily: "'NanumSquareRound', sans-serif", fontWeight: 700, color: '#424242' }}
            >
              카카오톡 채널
            </span>
          </a>
        </div>

        {/* 계정 관리 */}
        <p
          className="mt-24 text-[18px]"
          style={{ fontFamily: "'NanumSquareRound', sans-serif", fontWeight: 800, color: '#424242' }}
        >
          계정 관리
        </p>
        <div className="mt-6 space-y-2">
          <a
            onClick={() => setLogoutOpen(true)}
            className="-mx-3 px-3 py-2 flex items-center rounded-lg transition-colors hover:bg-black/5 active:bg-black/10 cursor-pointer"
          >
            <span
              className="text-[16px]"
              style={{ fontFamily: "'NanumSquareRound', sans-serif", fontWeight: 700, color: '#424242' }}
            >
              로그아웃
            </span>
          </a>
          <a
            onClick={() => setWithdrawOpen(true)}
            className="-mx-3 px-3 py-2 flex items-center rounded-lg transition-colors hover:bg-black/5 active:bg-black/10 cursor-pointer"
          >
            <span
              className="text-[16px]"
              style={{ fontFamily: "'NanumSquareRound', sans-serif", fontWeight: 700, color: '#424242' }}
            >
              계정 탈퇴
            </span>
          </a>
        </div>
      </div>

      <ConfirmDialog
        open={logoutOpen}
        message="현재 계정에서 로그아웃 하시겠어요?"
        onConfirm={() => {
          // useAuth.logout 은 내부에서 실패해도 swallow + 로컬 정리까지 진행하므로 추가 catch 불필요
          void logout()
        }}
        onClose={() => setLogoutOpen(false)}
      />
      <ConfirmDialog
        open={withdrawOpen}
        message={
          <>
            탈퇴 후 7일 동안은 유예기간이에요.
            <br />
            이 기간 안에 다시 로그인하면
            <br />
            계정이 복구됩니다.
            <br />
            <br />
            7일이 지나면 노래와 일기가
            <br />
            모두 영구 삭제돼요.
            <br />
            <br />
            그래도 탈퇴하시겠습니까?
          </>
        }
        onConfirm={() => {
          withdraw().catch((err) => {
            console.error('withdraw 실패', err)
            showToast('탈퇴 처리에 실패했어요. 잠시 후 다시 시도해주세요.', 'error')
          })
        }}
        onClose={() => setWithdrawOpen(false)}
      />
    </div>
  )
}
