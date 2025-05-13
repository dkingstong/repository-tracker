"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initCronJobs = initCronJobs;
const repositoryUpdateJob_1 = require("./repositoryUpdateJob");
/**
 * Initializes all cron jobs for the application
 */
function initCronJobs() {
    console.log('Initializing cron jobs...');
    // Initialize repository update job
    (0, repositoryUpdateJob_1.initRepositoryUpdateJob)();
    console.log('All cron jobs initialized');
}
