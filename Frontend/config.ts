const NODE_ENV = process.env.NODE_ENV || 'dev'
const NEXT_PUBLIC_APP_ENV = process.env.NEXT_PUBLIC_APP_ENV || 'dev'
export const DEV = NODE_ENV !== 'production'
export const IS_SERVER = typeof window === 'undefined'

const PROD_CONFIG = {
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_API_KEY: process.env.NEXT_PUBLIC_API_KEY,
}

const STAGING_CONFIG = {
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_API_KEY: process.env.NEXT_PUBLIC_API_KEY,
}

const DEV_CONFIG = {
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  NEXT_PUBLIC_API_KEY: process.env.NEXT_PUBLIC_API_KEY || '02560534-89ce-4093-be19-36862ca03496',
}

export const CONFIG = NODE_ENV === 'production' ? (NEXT_PUBLIC_APP_ENV === 'staging' ? STAGING_CONFIG : PROD_CONFIG) : DEV_CONFIG
