import { httpClient } from '@/shared/lib/httpClient'

// 서버 응답: { fileUrl: string }
interface UploadResponse {
  fileUrl: string
}

export const storageApi = {
  upload: (file: File): Promise<{ url: string }> => {
    const formData = new FormData()
    formData.append('file', file)
    // httpClient 기본 헤더가 application/json 이라, 이대로 두면 axios가
    // FormData를 JSON으로 직렬화해버림. Content-Type을 undefined로 덮어써야
    // 브라우저가 'multipart/form-data; boundary=...' 를 자동으로 붙여줌.
    return httpClient
      .post<UploadResponse>('/storage/upload', formData, {
        headers: { 'Content-Type': undefined },
      })
      .then((res) => ({ url: res.data.fileUrl }))
  },
}
