import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        andong: ['AnDongKaturi', 'sans-serif'],
        nanum: ['NanumSquareRound', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
