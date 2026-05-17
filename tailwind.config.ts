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
    },
  },
  plugins: [],
}

export default config
