export type CharacterType = 'DODO' | 'RERE' | 'MIMI'

export interface User {
  name: string | null
  character: CharacterType | null
  isNotificationEnabled: boolean
  noteCount: number
}

export interface UpdateNameRequest {
  name: string
}

export interface UpdateCharacterRequest {
  character: CharacterType
}
