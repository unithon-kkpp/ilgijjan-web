import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useSetAtom } from 'jotai'
import { userApi } from '../api/userApi'
import { currentUserAtom } from '@/app/store'

export function useUser() {
  return useQuery({
    queryKey: ['user', 'me'],
    queryFn: userApi.getMe,
  })
}

export function useUpdateName() {
  const setCurrentUser = useSetAtom(currentUserAtom)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: userApi.updateName,
    onSuccess: (_, variables) => {
      setCurrentUser((prev) => (prev ? { ...prev, name: variables.name } : null))
      queryClient.invalidateQueries({ queryKey: ['user', 'me'] })
    },
  })
}

export function useUpdateCharacter() {
  const setCurrentUser = useSetAtom(currentUserAtom)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: userApi.updateCharacter,
    onSuccess: (_, variables) => {
      setCurrentUser((prev) => (prev ? { ...prev, character: variables.character } : null))
      queryClient.invalidateQueries({ queryKey: ['user', 'me'] })
    },
  })
}
