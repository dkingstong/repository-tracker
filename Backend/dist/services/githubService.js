"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchGitHubLatestRelease = fetchGitHubLatestRelease;
exports.getAccessToken = getAccessToken;
exports.getGithubUser = getGithubUser;
const rest_1 = require("@octokit/rest");
const secrets_1 = __importDefault(require("../config/secrets"));
const Cache_1 = require("../common/Cache");
const AppError_1 = __importDefault(require("../common/AppError"));
// TODO: Validate response from github
async function fetchGitHubLatestRelease(accessToken, owner, repo) {
    const octokit = new rest_1.Octokit({ auth: accessToken });
    const cacheKey = `github-repo:${owner}/${repo}`;
    const cached = (0, Cache_1.getCache)(cacheKey);
    console.log('Fetching GitHub repository:', { owner, repo });
    try {
        const response = await octokit.repos.getLatestRelease({
            owner,
            repo,
            // etag is used to check if the data has changed in GitHub if not, return 304 not modified, github doesn't charge for 304
            headers: cached?.etag ? { 'If-None-Match': cached.etag } : {},
        });
        // If we get 200 OK, new data is available
        if (response.status === 200) {
            const newEtag = response.headers.etag;
            if (newEtag) {
                (0, Cache_1.setCache)(cacheKey, {
                    etag: newEtag,
                    data: response.data,
                });
            }
            console.log('📦 Fetched new data for', owner, repo);
            return response.data;
        }
        throw new Error(`Unexpected status: ${response.status}`);
    }
    catch (err) {
        // If status is 304, return cached data
        if (err.status === 304 && cached) {
            console.log('🔁 Using cached data for', owner, repo);
            return cached.data;
        }
        if (err.status === 404) {
            console.log("❌ No releases found for this repository.", owner, repo);
            throw AppError_1.default.NotFound('No releases found for this repository');
        }
        console.error('❌ GitHub API error:', err.message);
        throw AppError_1.default.InternalServerError(`GitHub API error: ${err.message}`);
    }
}
async function getAccessToken(code) {
    console.log('🔑 Getting access token');
    try {
        const response = await fetch('https://github.com/login/oauth/access_token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                client_id: secrets_1.default.GITHUB_CLIENT_ID,
                client_secret: secrets_1.default.GITHUB_CLIENT_SECRET,
                code,
            }),
        });
        const data = await response.json();
        if (data.error) {
            throw new Error(data.error);
        }
        return data.access_token;
    }
    catch (error) {
        console.error('Error getting access token:', error);
        throw error;
    }
}
async function getGithubUser(accessToken) {
    const userOctokit = new rest_1.Octokit({ auth: accessToken });
    const { data } = await userOctokit.users.getAuthenticated();
    return data;
}
