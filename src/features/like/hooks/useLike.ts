import { useMutation } from '@tanstack/react-query'
import { likeApi } from '../api/likeApi'
import { queryClient } from '@/app/queryClient'
import type { Diary } from '@/features/diary/types/diary.types'

/**
 * 좋아요 토글 훅.
 *
 * 호출 측에서 현재 isLiked 값을 `mutate({ wasLiked })`로 넘겨준다.
 * - wasLiked=true  → DELETE (좋아요 취소)
 * - wasLiked=false → POST   (좋아요 등록)
 *
 * 클릭 즉시 캐시를 낙관적으로 갱신하고, 실패 시 원래 값으로 롤백한다.
 */
export function useLike(diaryId: number) {
  const queryKey = ['diaries', diaryId] as const

  return useMutation({
    mutationFn: async ({ wasLiked }: { wasLiked: boolean }) => {
      if (wasLiked) {
        await likeApi.remove(diaryId)
      } else {
        await likeApi.add(diaryId)
      }
    },
    onMutate: async ({ wasLiked }) => {
      // 진행 중인 refetch는 멈춰서 낙관적 값이 덮어써지지 않게 한다
      await queryClient.cancelQueries({ queryKey })
      const prev = queryClient.getQueryData<Diary>(queryKey)
      if (prev) {
        queryClient.setQueryData<Diary>(queryKey, {
          ...prev,
          isLiked: !wasLiked,
          likeCount: wasLiked
            ? Math.max(0, prev.likeCount - 1)
            : prev.likeCount + 1,
        })
      }
      return { prev }
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(queryKey, ctx.prev)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey })
    },
  })
}
