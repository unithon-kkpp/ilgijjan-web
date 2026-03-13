import { httpClient } from '@/shared/lib/httpClient'
import type { User, UpdateNameRequest, UpdateCharacterRequest } from '../types/user.types'

export const userApi = {
  getMe: () =>
    httpClient.get<User>('/users/me').then((res) => res.data),

  updateName: (body: UpdateNameRequest) =>
    httpClient.patch('/users/me/name', body).then((res) => res.data),

  updateCharacter: (body: UpdateCharacterRequest) =>
    httpClient.patch('/users/me/character', body).then((res) => res.data),

  updateNotification: (enabled: boolean) =>
    httpClient.patch('/users/me/notification', { enabled }).then((res) => res.data),
}
