import { useQuery } from '@tanstack/react-query'
import { diaryApi } from '../api/diaryApi'

export function useDiaries(page = 0) {
  return useQuery({
    queryKey: ['diaries', page],
    queryFn: () => diaryApi.getList(page),
  })
}

export function usePublicDiaries(page = 0) {
  return useQuery({
    queryKey: ['diaries', 'public', page],
    queryFn: () => diaryApi.getPublic(page),
  })
}
