import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  // hover: 변형이 (hover: hover) 미디어쿼리로 감싸짐 → 터치 디바이스(휴대폰)에서는 발동 안 함
  // 모바일에서 탭 후 hover 가 계속 남아있는(sticky hover) 문제 방지
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {
      screens: {
        // 터치 디바이스(휴대폰/태블릿) 감지용. 창 너비 대신 (hover:none)(pointer:coarse) 로 판별
        touch: { raw: '(hover: none) and (pointer: coarse)' },
      },
      // 디자인 토큰. 인라인 style 로 흩어진 색/폰트를 점진적으로 이 토큰으로 통일.
      // 새 코드는 무조건 이걸 사용 (예: text-jjan-text, bg-jjan-primary, font-katuri).
      colors: {
        jjan: {
          text: '#424242',       // 본문 텍스트 기본색 (37회 사용)
          primary: '#91CCFF',    // 메인 파랑 (버튼/액센트, 12회)
          'primary-soft': '#9cd1ff',
          'primary-dark': '#71bdff',
          bg: '#faf9f5',         // 페이지 배경 (13회)
          'bg-blue': '#eef9ff',  // 로그인/로딩 등 옅은 파랑 배경
          'bg-card': '#e9f5ff',  // 카드 배경
          disabled: '#eeeeee',
          error: '#dd2929',      // 폼 에러
          alert: '#EF6B6B',      // 알림(사이렌/위험)
          danger: '#F4806C',     // 모달 취소 버튼 등
          muted: '#959595',      // 보조 텍스트
          'muted-strong': '#7a7a7a',
          grass: '#caf893',      // 잔디 영역
          'kakao-yellow': '#fee500',
        },
      },
      fontFamily: {
        // font-nanum, font-katuri 클래스로 쓸 수 있게 함
        nanum: ["'NanumSquareRound'", 'sans-serif'],
        katuri: ["'AndongKaturi'", 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
