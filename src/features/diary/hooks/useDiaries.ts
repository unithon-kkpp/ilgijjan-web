import { useQuery } from '@tanstack/react-query'
import { diaryApi } from '../api/diaryApi'

export function useDiaries(year: number, month: number) {
  return useQuery({
    queryKey: ['diaries', year, month],
    queryFn: () => diaryApi.getList(year, month),
  })
}
