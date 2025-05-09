import dotenv from 'dotenv'
dotenv.config()

const secrets = {
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID || '',
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET || '',
  GITHUB_PAT: process.env.GITHUB_PAT || '',
  FRONTEND_URL: process.env.FRONTEND_URL || '',
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: parseInt(process.env.DB_PORT || '32888'),
  DB_USERNAME: process.env.DB_USERNAME || 'postgres',
  DB_PASSWORD: process.env.DB_PASSWORD || 'postgres',
  DB_DATABASE: process.env.DB_DATABASE || 'db_test',
}

export default secrets
