"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const githubService_1 = require("../services/githubService");
const user_1 = require("../data/entities/user");
const dataSource_1 = require("../data/dataSource");
const router = (0, express_1.Router)();
router.get('/callback', (0, express_async_handler_1.default)(async (req, res) => {
    try {
        const code = req.query.code;
        if (!code) {
            throw new Error('No code provided');
        }
        // Get access token
        const accessToken = await (0, githubService_1.getAccessToken)(code);
        if (!accessToken) {
            throw new Error('Failed to get access token');
        }
        // Get user data
        const userData = await (0, githubService_1.getGithubUser)(accessToken);
        const userEntity = dataSource_1.AppDataSource.getRepository(user_1.User);
        let user = null;
        //store user in db if not exists
        const existingUser = await userEntity.findOne({
            where: {
                githubId: userData.id
            }
        });
        if (!existingUser) {
            //store data in db
            user = await userEntity.save({
                githubId: userData.id,
                email: userData.email ?? '',
                firstName: userData.name ?? '',
                lastName: userData.name ?? '',
            });
        }
        else {
            user = existingUser;
        }
        // Store the token and user data
        res.cookie('github_token', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            domain: 'localhost'
        });
        res.cookie('user_id', user.id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            domain: 'localhost'
        });
        // Redirect to home page or dashboard
        res.redirect(process.env.FRONTEND_URL + '/tracker');
    }
    catch (error) {
        console.error('Authentication error:', error);
        res.redirect(process.env.FRONTEND_URL + '/auth/error');
    }
}));
exports.default = router;
