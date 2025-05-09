import { UserAuthResponse } from '../types/auth'

export const auth: UserAuthResponse = {
  token: null,
  userId: null,
  cityId: null,
}

export function setAuth({ token, userId, cityId }: UserAuthResponse): void {
  auth.token = token
  auth.userId = userId
  auth.cityId = cityId
}

export function bearer(token: string): string {
  return `Bearer ${token}`
}
