"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initRepositoryUpdateJob = initRepositoryUpdateJob;
const node_cron_1 = __importDefault(require("node-cron"));
const repositoryService_1 = require("../services/repositoryService");
/**
 * Initializes cron job to update repository information hourly
 */
function initRepositoryUpdateJob() {
    // Schedule job to run every hour
    node_cron_1.default.schedule('0 * * * *', async () => {
        console.log(`[${new Date().toISOString()}] Running scheduled repository update job`);
        try {
            await (0, repositoryService_1.updateAllRepositories)();
            console.log(`[${new Date().toISOString()}] Scheduled repository update completed successfully`);
        }
        catch (error) {
            console.error(`[${new Date().toISOString()}] Error in scheduled repository update:`, error);
        }
    });
    console.log('Repository update cron job initialized (runs hourly)');
}
