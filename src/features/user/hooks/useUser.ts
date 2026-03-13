import { useQuery } from '@tanstack/react-query'
import { userApi } from '../api/userApi'

export function useUser() {
  return useQuery({
    queryKey: ['user', 'me'],
    queryFn: userApi.getMe,
  })
}
