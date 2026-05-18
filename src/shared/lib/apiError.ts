import axios, { type AxiosError } from 'axios'

/**
 * 백엔드 에러 응답 표준 페이로드.
 * 모든 API 의 에러 본문이 이 형태를 따른다고 가정.
 */
interface ApiErrorPayload {
  code?: string
  message?: string
}

export type ApiError = AxiosError<ApiErrorPayload>

/** axios 가 던진 에러인지 확인. 네트워크/타임아웃/HTTP 에러 모두 포함. */
export function isApiError(error: unknown): error is ApiError {
  return axios.isAxiosError(error)
}

/** HTTP status code 추출. axios 에러가 아니거나 응답 자체가 없으면 undefined. */
export function getApiErrorStatus(error: unknown): number | undefined {
  return isApiError(error) ? error.response?.status : undefined
}

/** 백엔드 응답 바디의 code 필드 추출 (예: 'INSUFFICIENT_NOTES', 'INVALID_KAKAO_TOKEN'). */
export function getApiErrorCode(error: unknown): string | undefined {
  return isApiError(error) ? error.response?.data?.code : undefined
}
