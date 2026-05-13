import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSetAtom } from 'jotai'
import { userApi } from '@/features/user/api/userApi'
import { currentUserAtom } from '@/app/store'

export default function DiaryListPage() {
  const navigate = useNavigate()
  const setCurrentUser = useSetAtom(currentUserAtom)

  useEffect(() => {
    userApi.getMe().then((user) => {
      setCurrentUser(user)
      if (!user.name) {
        navigate('/onboarding/name', { replace: true })
      }
    })
  }, [])

  return <div>DiaryListPage</div>
}
