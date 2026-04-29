import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import { router } from './app/router'
import { queryClient } from './app/queryClient'
import AuthInitializer from './app/AuthInitializer'

const kakaoKey = import.meta.env.VITE_KAKAO_APP_KEY
if (kakaoKey && window.Kakao && !window.Kakao.isInitialized()) {
  window.Kakao.init(kakaoKey)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthInitializer>
        <RouterProvider router={router} />
      </AuthInitializer>
    </QueryClientProvider>
  </StrictMode>,
)
