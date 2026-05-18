/**
 * 백엔드 일기 응답의 date 필드 포맷.
 * "2026.05.09" 또는 "2026-05-09" 양쪽 다 들어올 수 있어서 둘 다 split 으로 처리.
 *
 *   "2026.05.09" → "2026년 5월 9일"
 */
export function formatDiaryDate(dateStr: string): string {
  const [y, m, d] = dateStr.split(/[-.]/).map(Number)
  return `${y}년 ${m}월 ${d}일`
}
