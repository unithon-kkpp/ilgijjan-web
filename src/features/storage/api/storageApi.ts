import { httpClient } from '@/shared/lib/httpClient'

export const storageApi = {
  upload: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return httpClient
      .post<{ url: string }>('/storage/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((res) => res.data)
  },
}
