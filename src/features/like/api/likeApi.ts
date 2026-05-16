import { httpClient } from '@/shared/lib/httpClient'

export const likeApi = {
  // POST /api/diaries/{diaryId}/likes — 좋아요 등록
  add: (diaryId: number) =>
    httpClient.post(`/diaries/${diaryId}/likes`).then((res) => res.data),

  // DELETE /api/diaries/{diaryId}/likes — 좋아요 취소
  remove: (diaryId: number) =>
    httpClient.delete(`/diaries/${diaryId}/likes`).then((res) => res.data),
}
