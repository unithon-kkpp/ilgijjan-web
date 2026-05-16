import { useMutation } from '@tanstack/react-query'
import { diaryApi } from '../api/diaryApi'
import { queryClient } from '@/app/queryClient'

/**
 * 일기 삭제 훅.
 *
 * 성공 시 단건 캐시는 제거하고 목록 캐시는 invalidate 해서 다시 가져오게 한다.
 * 페이지 이동은 호출 측에서 mutate(undefined, { onSuccess }) 로 처리.
 */
export function useDeleteDiary(diaryId: number) {
  return useMutation({
    mutationFn: () => diaryApi.remove(diaryId),
    onSuccess: () => {
      // 삭제된 일기의 단건 캐시 제거 — 뒤로가기 등으로 잠시 노출되는 걸 막음
      queryClient.removeQueries({ queryKey: ['diaries', diaryId] })
      // 일기 목록(연/월별) 캐시 무효화 — 목록 화면 진입 시 새 데이터 fetch
      queryClient.invalidateQueries({ queryKey: ['diaries'] })
    },
  })
}
