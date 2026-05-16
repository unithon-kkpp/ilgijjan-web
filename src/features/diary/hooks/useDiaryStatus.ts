import { useQuery } from '@tanstack/react-query'
import { diaryApi } from '../api/diaryApi'

/**
 * 일기 생성 진행 상태 폴링 훅.
 *
 * - diaryId가 null이면 쿼리 비활성화
 * - status가 PENDING인 동안 2초 간격으로 재요청
 * - COMPLETED / FAILED / DELETED 가 되면 폴링 중단
 */
export function useDiaryStatus(diaryId: number | null) {
  return useQuery({
    queryKey: ['diary', 'status', diaryId],
    queryFn: () => diaryApi.getStatus(diaryId as number),
    enabled: diaryId !== null,
    refetchInterval: (query) => {
      const status = query.state.data?.status
      // 아직 데이터가 없거나 PENDING이면 계속 폴링
      if (!status || status === 'PENDING') return 2000
      return false
    },
    refetchIntervalInBackground: false,
    // 명시적으로 stale을 비활성화 — 폴링이 직접 최신 상태를 가져옴
    staleTime: 0,
    gcTime: 0,
  })
}
