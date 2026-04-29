import { useEffect, useState } from 'react'
import { useSetAtom } from 'jotai'
import { currentUserAtom } from './store'
import { userApi } from '@/features/user/api/userApi'
import { tokenStorage } from '@/shared/lib/tokenStorage'
import LoadingSpinner from '@/shared/components/ui/LoadingSpinner'

export default function AuthInitializer({ children }: { children: React.ReactNode }) {
  const setCurrentUser = useSetAtom(currentUserAtom)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const token = tokenStorage.get()
    if (!token) {
      setReady(true)
      return
    }

    userApi
      .getMe()
      .then((user) => setCurrentUser(user))
      .catch(() => tokenStorage.clear())
      .finally(() => setReady(true))
  }, [setCurrentUser])

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return <>{children}</>
}
