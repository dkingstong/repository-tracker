import { Octokit } from "@octokit/rest";
import secrets from '../config/secrets'
import { getCache, setCache } from '../common/Cache';
import AppError from "../common/AppError";

// TODO: Validate response from github

export async function fetchGitHubLatestRelease(accessToken: string, owner: string, repo: string) {
  const octokit = new Octokit({ auth: accessToken });
  const cacheKey = `github-repo:${owner}/${repo}`;

  const cached = getCache(cacheKey);

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
        setCache(cacheKey, {
          etag: newEtag,
          data: response.data,
        });
      }
      console.log('📦 Fetched new data for', owner, repo);
      return response.data;
    }

    throw new Error(`Unexpected status: ${response.status}`);
  } catch (err: any) {
    // If status is 304, return cached data
    if (err.status === 304 && cached) {
      console.log('🔁 Using cached data for', owner, repo);
      return cached.data;
    }

    if (err.status === 404) {
      console.log("❌ No releases found for this repository.", owner, repo);
      throw AppError.NotFound('No releases found for this repository');
    }

    console.error('❌ GitHub API error:', err.message);
    throw AppError.InternalServerError(`GitHub API error: ${err.message}`);
  }
}

export async function getAccessToken(code: string) {
  console.log('🔑 Getting access token');

  try {
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        client_id: secrets.GITHUB_CLIENT_ID,
        client_secret: secrets.GITHUB_CLIENT_SECRET,
        code,
      }),
    });

    const data = await response.json();
    if (data.error) {
      throw new Error(data.error);
    }
    return data.access_token;
  } catch (error) {
    console.error('Error getting access token:', error);
    throw error;
  }
}

export async function getGithubUser(accessToken: string) {
  const userOctokit = new Octokit({ auth: accessToken });
  const { data } = await userOctokit.users.getAuthenticated();
  return data;
}
