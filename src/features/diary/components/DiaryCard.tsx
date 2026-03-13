import type { Diary } from '../types/diary.types'

interface DiaryCardProps {
  diary: Diary
  onClick?: () => void
}

export default function DiaryCard({ diary, onClick }: DiaryCardProps) {
  return <div onClick={onClick}>{diary.content}</div>
}
