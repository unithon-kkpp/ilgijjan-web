import { httpClient } from '@/shared/lib/httpClient'
import type { Diary, CreateDiaryRequest } from '../types/diary.types'
import type { PageResponse } from '@/shared/types/common.types'

export const diaryApi = {
  getList: (page = 0) =>
    httpClient.get<PageResponse<Diary>>('/diaries', { params: { page } }).then((res) => res.data),

  getOne: (diaryId: number) =>
    httpClient.get<Diary>(`/diaries/${diaryId}`).then((res) => res.data),

  getPublic: (page = 0) =>
    httpClient.get<PageResponse<Diary>>('/diaries/public', { params: { page } }).then((res) => res.data),

  create: (body: CreateDiaryRequest) =>
    httpClient.post<Diary>('/diaries', body).then((res) => res.data),

  publish: (diaryId: number) =>
    httpClient.post(`/diaries/${diaryId}/publish`).then((res) => res.data),

  unpublish: (diaryId: number) =>
    httpClient.post(`/diaries/${diaryId}/unpublish`).then((res) => res.data),
}
