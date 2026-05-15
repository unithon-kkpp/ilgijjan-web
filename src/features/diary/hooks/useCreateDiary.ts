import { useMutation } from '@tanstack/react-query'
import { useSetAtom } from 'jotai'
import { diaryApi } from '../api/diaryApi'
import { diaryDraftAtom, emptyDiaryDraft } from '@/app/store'
import { queryClient } from '@/app/queryClient'
import type { CreateDiaryRequest } from '../types/diary.types'

export function useCreateDiary() {
  const resetDraft = useSetAtom(diaryDraftAtom)

  return useMutation({
    mutationFn: (body: CreateDiaryRequest) => diaryApi.create(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diaries'] })
      queryClient.invalidateQueries({ queryKey: ['user', 'me'] })
      resetDraft(emptyDiaryDraft)
    },
  })
}
