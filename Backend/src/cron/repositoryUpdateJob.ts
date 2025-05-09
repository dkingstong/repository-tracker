import cron from 'node-cron';
import { updateAllRepositories } from '../services/repositoryService';

/**
 * Initializes cron job to update repository information hourly
 */
export function initRepositoryUpdateJob(): void {
  // Schedule job to run every hour
  cron.schedule('0 * * * *', async () => {
    console.log(`[${new Date().toISOString()}] Running scheduled repository update job`);
    try {
      await updateAllRepositories();
      console.log(`[${new Date().toISOString()}] Scheduled repository update completed successfully`);
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Error in scheduled repository update:`, error);
    }
  });

  console.log('Repository update cron job initialized (runs hourly)');
} 