export interface User {
  id: number
  name: string
  character: string
  notificationEnabled: boolean
}

export interface UpdateNameRequest {
  name: string
}

export interface UpdateCharacterRequest {
  character: string
}
