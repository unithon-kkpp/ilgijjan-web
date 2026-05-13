export type Character = 'DODO' | 'RERE' | 'MIMI'

export interface User {
  name: string | null
  character: Character | null
  isNotificationEnabled: boolean
  noteCount: number
}

export interface UpdateNameRequest {
  name: string
}

export interface UpdateCharacterRequest {
  character: Character
}
