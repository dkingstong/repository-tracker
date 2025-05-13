"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDB = exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const repository_1 = require("./entities/repository");
const userRepository_1 = require("./entities/userRepository");
const user_1 = require("./entities/user");
const secrets_1 = __importDefault(require("../config/secrets"));
const path_1 = __importDefault(require("path"));
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: secrets_1.default.DB_HOST,
    port: secrets_1.default.DB_PORT,
    username: secrets_1.default.DB_USERNAME,
    password: secrets_1.default.DB_PASSWORD,
    database: secrets_1.default.DB_DATABASE,
    synchronize: true, // set to false in production
    logging: false,
    entities: [repository_1.Repository, user_1.User, userRepository_1.UserRepository],
    migrationsTableName: 'migrations',
    migrations: [path_1.default.normalize(__dirname + '/migrations/*.ts')],
    subscribers: [],
});
const initDB = async () => {
    try {
        await exports.AppDataSource.initialize(); // Initialize the DataSource
        console.log('Database connection established');
    }
    catch (err) {
        console.error('Error during Data Source initialization:', err);
        throw err;
    }
};
exports.initDB = initDB;
