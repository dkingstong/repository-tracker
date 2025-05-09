import { Octokit } from '@octokit/core';

// GitHub OAuth Configuration
export const GITHUB_CLIENT_ID = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID || '';
export const GITHUB_REDIRECT_URI = process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URI || 'http://localhost:8080/auth/callback';

// Initialize Octokit
export const octokit = new Octokit();

// GitHub OAuth URLs
export const GITHUB_OAUTH_URL = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${GITHUB_REDIRECT_URI}&scope=user,repo`;