import { useMutation } from '@tanstack/react-query'
import { likeApi } from '../api/likeApi'
import { queryClient } from '@/app/queryClient'

export function useLike(diaryId: number) {
  return useMutation({
    mutationFn: () => likeApi.toggle(diaryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diaries', diaryId] })
    },
  })
}
