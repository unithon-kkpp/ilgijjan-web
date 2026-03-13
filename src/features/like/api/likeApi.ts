import { httpClient } from '@/shared/lib/httpClient'

export const likeApi = {
  toggle: (diaryId: number) =>
    httpClient.post(`/diaries/${diaryId}/likes`).then((res) => res.data),
}
