import { initRepositoryUpdateJob } from './repositoryUpdateJob';

/**
 * Initializes all cron jobs for the application
 */
export function initCronJobs(): void {
  console.log('Initializing cron jobs...');
  
  // Initialize repository update job
  initRepositoryUpdateJob();
  
  console.log('All cron jobs initialized');
} 