"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("./config/express");
const dotenv_1 = __importDefault(require("dotenv"));
const dataSource_1 = require("./data/dataSource");
const cron_1 = require("./cron");
dotenv_1.default.config();
const port = Number(process.env.PORT ?? 8080);
console.log('Starting server...');
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});
process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Rejection:', reason);
    process.exit(1);
});
async function main() {
    try {
        await (0, dataSource_1.initDB)();
        // Initialize cron jobs after database is connected
        (0, cron_1.initCronJobs)();
        const expressApp = await (0, express_1.app)();
        expressApp.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}
main();
