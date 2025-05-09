import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import handleError from './handleError'
import { refresh } from '../auth'
import { bearer } from '../../utils/auth'
import { CONFIG, IS_SERVER } from '../../../config'
import { setAuth, auth } from '../../utils/auth'

export interface RequestConfig {
  errorToast?: boolean
  title?: string
  description?: string
}

class Api {
  private instance: AxiosInstance

  constructor() {
    this.instance = axios.create({
      baseURL: CONFIG.NEXT_PUBLIC_API_URL,
    })
    this.instance.defaults.withCredentials=true

    this.instance.interceptors.request.use((req) => {
      const token = auth.token
      if(token) {
        req.headers['Authorization'] = bearer(token)
      }
      return req
    })

    this.instance.interceptors.response.use(
      (res) => res,
      (error: AxiosError) => {
        if (IS_SERVER) throw error

        return new Promise(async (resolve, reject) => {
          try {
            const originalReq = error.config
            const isRefresh = originalReq && originalReq.url === '/user/refresh'
            const isUnauthorized = error.response && error.response.status === 401

            if (isRefresh && isUnauthorized) {
              if(window.location.pathname !== '/login') {
                window.location.href = '/login';
              }
              return reject(error)
            }

            if (!isRefresh && isUnauthorized) {
              const { token, cityId, userId } = await refresh()

              setAuth({ token, userId, cityId })

              originalReq!.headers['Authorization'] = bearer(token!)

              const originalRes = await this.instance.request(originalReq!)
              resolve(originalRes)
            }

            reject(error)
          } catch (error) {
            reject(error)
          }
        })
      },
    )
  }

  get(
    endpoint: string,
    toast: (args: { title: string; description: string }) => void,
    customConfig: RequestConfig = {},
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse> {
    return this.instance.get(endpoint, config).catch((error) => handleError(error, customConfig, toast))
  }

  post(
    endpoint: string,
    data: any,
    customConfig: RequestConfig = {},
    toast?: (args: { title: string; description: string }) => void,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse> {
    return this.instance.post(endpoint, data, config).catch((error) => handleError(error, customConfig, toast))
  }

  request(
    config: AxiosRequestConfig,
    toast: (args: { title: string; description: string }) => void,  ): Promise<AxiosResponse> {
    return this.instance.request(config).catch((error) => handleError(error, {}, toast))
  }

  server(config: AxiosRequestConfig): Promise<AxiosResponse> {
    return this.instance.request(config)
  }
}

export default new Api()
