import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import type { DiaryDraft } from '@/features/diary/types/diary.types'
import type { User } from '@/features/user/types/user.types'

// 로그인된 유저 정보 — localStorage에 영속 저장해 새로고침·페이지 이동 후에도 유지
export const currentUserAtom = atomWithStorage<User | null>('currentUser', null)

export const emptyDiaryDraft: DiaryDraft = {
  type: null,
  text: '',
  photoUrl: null,
  weather: null,
  mood: null,
}

// 일기 작성 멀티스텝 임시 저장
export const diaryDraftAtom = atom<DiaryDraft>(emptyDiaryDraft)

export type ToastType = 'success' | 'error' | 'info'

export interface ToastItem {
  id: number
  message: string
  type: ToastType
}

// 전역 토스트 큐 — 페이지를 이동해도 살아남아야 하므로 atom 으로 관리
export const toastsAtom = atom<ToastItem[]>([])
