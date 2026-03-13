import type { Diary } from '../types/diary.types'

interface DiaryDetailProps {
  diary: Diary
}

export default function DiaryDetail({ diary }: DiaryDetailProps) {
  return <div>{diary.content}</div>
}
