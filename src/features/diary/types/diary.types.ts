export type Weather = 'SUNNY' | 'CLOUDY' | 'RAINY' | 'SNOWY' | 'WINDY'
export type Mood = 'HAPPY' | 'SOSO' | 'SAD' | 'ANGRY' | 'EXCITED'

export interface Diary {
  id: number
  imageUrl: string | null
  weather: Weather
  mood: Mood
  content: string
  audioUrl: string | null
  isPublic: boolean
  createdAt: string
}

// 일기 작성 멀티스텝 임시 저장 타입
export interface DiaryDraft {
  imageUrl: string | null
  weather: Weather | null
  mood: Mood | null
  content: string
}

export interface CreateDiaryRequest {
  imageUrl: string | null
  weather: Weather
  mood: Mood
  content: string
}
