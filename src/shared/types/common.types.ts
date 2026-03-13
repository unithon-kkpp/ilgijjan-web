// 공통 API 응답 포맷
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

// 페이지네이션
export interface PageResponse<T> {
  content: T[]
  totalPages: number
  totalElements: number
  number: number // 현재 페이지
  size: number
  last: boolean
}
