import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { createStore, Provider } from 'jotai'
import './index.css'
import { router } from './app/router'
import { queryClient } from './app/queryClient'
import { tokenStorage } from './shared/lib/tokenStorage'
import { userApi } from './features/user/api/userApi'
import { currentUserAtom } from './app/store'

const jotaiStore = createStore()

async function initAuth() {
  const token = tokenStorage.get()
  if (token) {
    try {
      const user = await userApi.getMe()
      jotaiStore.set(currentUserAtom, user)
    } catch {
      tokenStorage.remove()
    }
  }
}

function initKakao() {
  const kakaoKey = import.meta.env.VITE_KAKAO_JS_KEY
  if (window.Kakao && kakaoKey && !window.Kakao.isInitialized()) {
    window.Kakao.init(kakaoKey)
  }
}

initAuth().then(() => {
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
})
