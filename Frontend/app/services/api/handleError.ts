'use client'

import { AxiosError, AxiosResponse } from 'axios'
import { ApiError } from '../../types/api'
import { RequestConfig } from './Api'

export default function handleError(
  error: AxiosError,
  customConfig: RequestConfig,
  toast?: (args: { title: string; description: string }) => void,
): AxiosResponse {
  const { errorToast = true, title, description } = customConfig

  const err: ApiError = {
    message: error.response?.data?.toString() || 'Internal server error',
    code: error.response?.status || 500,
  }

  errorToast &&
    toast &&
    toast({
      title: title || 'Uh oh! Algo salió mal.',
      description: description || 'Ha habido un problema.',
    })

  throw err
}
