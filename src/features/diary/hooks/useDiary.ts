import { useQuery } from '@tanstack/react-query'
import { diaryApi } from '../api/diaryApi'

export function useDiary(diaryId: number) {
  return useQuery({
    queryKey: ['diaries', diaryId],
    queryFn: () => diaryApi.getOne(diaryId),
    enabled: Number.isFinite(diaryId),
  })
}
