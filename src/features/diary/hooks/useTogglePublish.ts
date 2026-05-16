import { useMutation } from '@tanstack/react-query'
import { diaryApi } from '../api/diaryApi'
import { queryClient } from '@/app/queryClient'
import type { Diary } from '../types/diary.types'

/**
 * 일기 공개/비공개 토글 훅.
 *
 * 호출 측에서 현재 isPublic 값을 `mutate({ wasPublic })`로 넘겨준다.
 * - wasPublic=true  → PATCH .../unpublish (비공개로)
 * - wasPublic=false → PATCH .../publish   (공개로)
 *
 * 클릭 즉시 캐시를 낙관적으로 갱신해서 토글 스위치와 좋아요 영역(회색/빨강)이 바로 바뀐다.
 * 실패 시 원래 값으로 롤백한다.
 */
export function useTogglePublish(diaryId: number) {
  const queryKey = ['diaries', diaryId] as const

  return useMutation({
    mutationFn: async ({ wasPublic }: { wasPublic: boolean }) => {
      if (wasPublic) {
        await diaryApi.unpublish(diaryId)
      } else {
        await diaryApi.publish(diaryId)
      }
    },
    onMutate: async ({ wasPublic }) => {
      await queryClient.cancelQueries({ queryKey })
      const prev = queryClient.getQueryData<Diary>(queryKey)
      if (prev) {
        queryClient.setQueryData<Diary>(queryKey, {
          ...prev,
          isPublic: !wasPublic,
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
