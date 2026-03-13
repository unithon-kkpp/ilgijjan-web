import { atom } from 'jotai'
import type { DiaryDraft } from '@/features/diary/types/diary.types'
import type { User } from '@/features/user/types/user.types'

// 로그인된 유저 정보 (null이면 비로그인)
export const currentUserAtom = atom<User | null>(null)

// 일기 작성 멀티스텝 임시 저장
export const diaryDraftAtom = atom<DiaryDraft>({
  imageUrl: null,
  weather: null,
  mood: null,
  content: '',
})
