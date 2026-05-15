export type Weather = 'SUNNY' | 'CLOUDY' | 'RAINY' | 'SNOWY'
export type Mood = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
export type DiaryType = 'TEXT' | 'PHOTO'
export type DiaryStatus = 'PENDING' | 'COMPLETED'

export interface Diary {
  diaryId: number
  type: DiaryType
  isOwner: boolean
  text: string | null
  photoUrl: string | null
  date: string
  weather: Weather
  mood: Mood
  imageUrl: string | null
  musicUrl: string | null
  lyrics: string | null
  isPublic: boolean
  likeCount: number
  isLiked: boolean
}

export interface DiaryListItem {
  id: number
  status: DiaryStatus
  date: string
  imageUrl: string | null
  weather: Weather
  mood: Mood
  introLines: string | null
}

// 일기 작성 멀티스텝 임시 저장 타입
export interface DiaryDraft {
  type: DiaryType | null
  text: string
  photoUrl: string | null
  weather: Weather | null
  mood: Mood | null
}

export type CreateDiaryRequest =
  | { type: 'TEXT'; text: string; weather: Weather; mood: Mood }
  | { type: 'PHOTO'; photoUrl: string; weather: Weather; mood: Mood }

export interface CreateDiaryResponse {
  diaryId: number
}
