import { httpClient } from '@/shared/lib/httpClient'
import type {
  Diary,
  CreateDiaryRequest,
  CreateDiaryResponse,
  DiaryListItem,
} from '../types/diary.types'

export const diaryApi = {
  getList: (year: number, month: number) =>
    httpClient
      .get<{ diaryList: DiaryListItem[] }>('/diaries', { params: { year, month } })
      .then((res) => res.data),

  getOne: (diaryId: number) =>
    httpClient.get<Diary>(`/diaries/${diaryId}`).then((res) => res.data),

  create: (body: CreateDiaryRequest) =>
    httpClient.post<CreateDiaryResponse>('/diaries', body).then((res) => res.data),

  publish: (diaryId: number) =>
    httpClient.post(`/diaries/${diaryId}/publish`).then((res) => res.data),

  unpublish: (diaryId: number) =>
    httpClient.post(`/diaries/${diaryId}/unpublish`).then((res) => res.data),
}
