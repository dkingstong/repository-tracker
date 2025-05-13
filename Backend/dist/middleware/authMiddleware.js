"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateGithubToken = validateGithubToken;
const rest_1 = require("@octokit/rest");
const AppError_1 = __importDefault(require("../common/AppError"));
const dataSource_1 = require("../data/dataSource");
const user_1 = require("../data/entities/user");
async function validateGithubToken(token, userId) {
    if (!token || !userId) {
        throw AppError_1.default.BadRequest('Unauthorized: No token or user id provided');
    }
    try {
        const octokit = new rest_1.Octokit({ auth: token });
        const githubUser = await octokit.users.getAuthenticated();
        const userEntity = dataSource_1.AppDataSource.getRepository(user_1.User);
        const user = await userEntity.findOne({
            where: { id: userId }
        });
        if (!user) {
            throw AppError_1.default.NotFound('User not found');
        }
        return { user: { githubId: githubUser.data.id, token, id: user.id } };
    }
    catch (error) {
        throw AppError_1.default.Unauthorized('Unauthorized: Invalid token');
    }
}
