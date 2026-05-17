import { useInfiniteQuery } from '@tanstack/react-query'
import { diaryApi } from '../api/diaryApi'

/**
 * 공개 일기 목록 무한 스크롤 훅.
 *
 * - 첫 페이지: lastId 없이 요청 (최신순)
 * - 이후 페이지: 직전 응답의 lastId를 커서로 사용
 * - hasNext === false 면 더 가져올 페이지 없음
 */
export function usePublicDiaries(pageSize = 20) {
  return useInfiniteQuery({
    queryKey: ['diaries', 'public', pageSize],
    queryFn: ({ pageParam }) => diaryApi.getPublicList(pageParam, pageSize),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (last) =>
      last.hasNext && last.lastId !== null ? last.lastId : undefined,
  })
}
