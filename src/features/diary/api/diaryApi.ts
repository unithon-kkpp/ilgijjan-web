import { httpClient } from '@/shared/lib/httpClient'
import type {
  Diary,
  CreateDiaryRequest,
  CreateDiaryResponse,
  DiaryListItem,
  DiaryStatusResponse,
} from '../types/diary.types'

export const diaryApi = {
  getList: (year: number, month: number) =>
    httpClient
      .get<{ diaryList: DiaryListItem[] }>('/diaries', { params: { year, month } })
      .then((res) => res.data),

  getOne: (diaryId: number) =>
    httpClient.get<Diary>(`/diaries/${diaryId}`).then((res) => res.data),

  // 일기 생성 진행 상태 폴링 조회 (PENDING / COMPLETED / FAILED / DELETED)
  getStatus: (diaryId: number) =>
    httpClient
      .get<DiaryStatusResponse>(`/diaries/${diaryId}/status`)
      .then((res) => res.data),

  create: (body: CreateDiaryRequest) =>
    httpClient.post<CreateDiaryResponse>('/diaries', body).then((res) => res.data),

  publish: (diaryId: number) =>
    httpClient.patch(`/diaries/${diaryId}/publish`).then((res) => res.data),

  unpublish: (diaryId: number) =>
    httpClient.patch(`/diaries/${diaryId}/unpublish`).then((res) => res.data),

  // DELETE /api/diaries/{diaryId} — 일기 삭제 (본인 일기만)
  remove: (diaryId: number) =>
    httpClient.delete(`/diaries/${diaryId}`).then((res) => res.data),
}
