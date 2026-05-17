import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { diaryApi } from '../api/diaryApi'

export function useDiaries(year: number, month: number) {
  return useQuery({
    queryKey: ['diaries', year, month],
    queryFn: () => diaryApi.getList(year, month),
    // 월 전환 중 이전 데이터를 유지 — 빈 화면으로 깜빡이며 picker 가 강제 unmount 되는 문제 방지
    placeholderData: keepPreviousData,
  })
}
