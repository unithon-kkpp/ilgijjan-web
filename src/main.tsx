import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { createStore, Provider } from 'jotai'
import './index.css'
import { router } from './app/router'
import { queryClient } from './app/queryClient'

const jotaiStore = createStore()

function initKakao() {
  const kakaoKey = import.meta.env.VITE_KAKAO_JS_KEY
  if (window.Kakao && kakaoKey && !window.Kakao.isInitialized()) {
    window.Kakao.init(kakaoKey)
  }
}

initKakao()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={jotaiStore}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </Provider>
  </StrictMode>,
)
