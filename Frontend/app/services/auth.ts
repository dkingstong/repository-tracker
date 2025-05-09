import Api from './api/Api'
import { UserAuthResponse } from '../types/auth'

export async function refresh(): Promise<UserAuthResponse> {
  const response = await Api.post('/user/refresh', {}, {}, undefined, { withCredentials: true })
  return response.data.data
}

export async function logout(): Promise<void> {
  await Api.post('/user/logout', {}, {}, undefined, { withCredentials: true })
}

export async function login(code: string): Promise<void> {
  await Api.post('/user/login', { code }, {}, undefined, { withCredentials: true })
}
