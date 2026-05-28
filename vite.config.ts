import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// 개발 서버 전용: 앱(SPA) 경로 요청을 app.html 로 넘겨준다.
// 운영(Vercel)에서는 vercel.json 의 rewrite 가 같은 역할을 한다.
// '/' 는 정적 랜딩(index.html)이라 건드리지 않는다.
function appShellFallback(): Plugin {
  return {
    name: 'app-shell-fallback',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        const accept = req.headers.accept ?? ''
        const url = (req.url ?? '/').split('?')[0]
        // 브라우저 '페이지 이동'(HTML 요청)이고, 루트/api/app.html 이 아니면 앱 셸로 넘김.
        // 모듈·이미지 등 리소스 요청은 accept 가 text/html 이 아니라 그대로 통과한다.
        if (
          accept.includes('text/html') &&
          url !== '/' &&
          url !== '/index.html' &&
          !url.startsWith('/api') &&
          !url.startsWith('/app.html')
        ) {
          req.url = '/app.html'
        }
        next()
      })
    },
  }
}

export default defineConfig({
  // 랜딩(index.html)과 앱(app.html) 두 개의 진입점을 가진 멀티페이지 빌드
  appType: 'mpa',
  plugins: [react(), appShellFallback()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    rollupOptions: {
      input: {
        landing: resolve(__dirname, 'index.html'), // 정적 마케팅 랜딩
        app: resolve(__dirname, 'app.html'), // 기존 React SPA
      },
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://ilgijjan.store',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
