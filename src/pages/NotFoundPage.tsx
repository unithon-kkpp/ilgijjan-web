import { useNavigate } from 'react-router-dom'

/**
 * 라우터에 없는 경로(오타 URL 등)로 들어왔을 때 보여주는 화면.
 * router.tsx 의 catch-all 라우트({ path: '*' })에 연결돼 있고,
 * MobileLayout 안쪽(Outlet)에 렌더되므로 모바일 프레임 + ErrorBoundary 의 보호를 받는다.
 */
export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center gap-6 px-6 bg-jjan-bg">
      <img
        src="/images/banner-worm.webp"
        alt=""
        style={{ width: 90, height: 122, objectFit: 'contain', transform: 'rotate(-6deg)' }}
      />

      <div className="font-nanum text-center text-jjan-text" style={{ lineHeight: 1.5 }}>
        <p className="text-[20px] font-bold">앗, 길을 잃었어요</p>
        <p className="text-[15px] text-jjan-muted mt-2">
          여기엔 아무것도 없어요.
          <br />
          홈으로 다시 가볼까요?
        </p>
      </div>

      <button
        onClick={() => navigate('/', { replace: true })}
        className="font-katuri rounded-[10px] bg-jjan-primary text-white"
        style={{ fontSize: 22, width: 170, height: 52 }}
      >
        홈으로 가기
      </button>
    </div>
  )
}
