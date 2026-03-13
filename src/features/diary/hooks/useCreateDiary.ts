import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useSetAtom } from 'jotai'
import { diaryApi } from '../api/diaryApi'
import { diaryDraftAtom } from '@/app/store'
import { queryClient } from '@/app/queryClient'
import type { CreateDiaryRequest } from '../types/diary.types'

export function useCreateDiary() {
  const navigate = useNavigate()
  const resetDraft = useSetAtom(diaryDraftAtom)

  return useMutation({
    mutationFn: (body: CreateDiaryRequest) => diaryApi.create(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diaries'] })
      resetDraft({ imageUrl: null, weather: null, mood: null, content: '' })
      navigate('/', { replace: true })
    },
  })
}
