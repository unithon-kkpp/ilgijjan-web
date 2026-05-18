import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  /** 커스텀 fallback. 없으면 DefaultFallback 사용. */
  fallback?: ReactNode
}

interface State {
  error: Error | null
}

/**
 * 자식 컴포넌트가 throw 한 에러를 잡아 fallback UI 로 대체.
 * React 의 ErrorBoundary 는 클래스 컴포넌트여야 하며 hooks 못 씀.
 *
 * 잡는 것:
 *  - 렌더 중 throw
 *  - 라이프사이클 메서드 throw
 *  - 자식의 생성자 throw
 *
 * 못 잡는 것:
 *  - 이벤트 핸들러 안 throw (onClick 등) — 거기는 직접 try/catch
 *  - 비동기 코드 (setTimeout, Promise) — 마찬가지
 *  - SSR 시점 에러
 */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error('[ErrorBoundary]', error, info)
    }
    // TODO: 추후 Sentry 같은 에러 트래커 붙이면 여기서 send.
  }

  render() {
    if (this.state.error) {
      return this.props.fallback ?? <DefaultFallback error={this.state.error} />
    }
    return this.props.children
  }
}

function DefaultFallback({ error }: { error: Error }) {
  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center gap-5 px-6"
      style={{ backgroundColor: '#faf9f5' }}
    >
      <p
        className="text-center text-[18px] text-[#424242]"
        style={{
          fontFamily: "'NanumSquareRound', sans-serif",
          fontWeight: 700,
          lineHeight: 1.5,
        }}
      >
        앗, 화면을 그리다 문제가 생겼어요.
        <br />
        다시 한 번 시도해주세요.
      </p>

      {/* dev 빌드에서만 실제 에러 메시지 노출 */}
      {import.meta.env.DEV && (
        <pre
          className="text-[11px] text-[#dd2929] whitespace-pre-wrap break-all max-w-full overflow-auto px-4 py-2 bg-white/60 rounded"
          style={{ fontFamily: 'monospace', maxHeight: 160 }}
        >
          {error.message}
          {error.stack ? `\n\n${error.stack}` : ''}
        </pre>
      )}

      <button
        onClick={() => window.location.reload()}
        className="rounded-[10px] bg-[#91CCFF] text-white"
        style={{
          fontFamily: "'AndongKaturi', sans-serif",
          fontSize: 22,
          width: 170,
          height: 52,
        }}
      >
        새로고침
      </button>
    </div>
  )
}
