import { app } from './config/express'
import dotenv from 'dotenv'
import { initDB } from './data/dataSource'
import { initCronJobs } from './cron'
dotenv.config()

const port = Number(process.env.PORT ?? 8080)
console.log('Starting server...')

process.on('uncaughtException', (err: Error): void => {
  console.error('Uncaught Exception:', err)
  process.exit(1)
})

process.on('unhandledRejection', (reason: any): void => {
  console.error('Unhandled Rejection:', reason)
  process.exit(1)
})

async function main() {
  try {
    await initDB()
    
    // Initialize cron jobs after database is connected
    initCronJobs()
    
    const expressApp = await app()
    expressApp.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`)
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

main()
