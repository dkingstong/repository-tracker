"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAllRepositories = updateAllRepositories;
const repository_1 = require("../data/entities/repository");
const dataSource_1 = require("../data/dataSource");
const githubService_1 = require("./githubService");
const secrets_1 = __importDefault(require("../config/secrets"));
const userRepository_1 = require("../data/entities/userRepository");
const repositoryRepository = dataSource_1.AppDataSource.getRepository(repository_1.Repository);
const userRepositoryRepository = dataSource_1.AppDataSource.getRepository(userRepository_1.UserRepository);
/**
 * Updates information for all repositories in the database from GitHub
 */
async function updateAllRepositories() {
    try {
        console.log('Starting repository update job');
        const repositories = await repositoryRepository.find();
        console.log(`Updating ${repositories.length} repositories`);
        for (const repository of repositories) {
            try {
                await updateRepositoryInfo(repository);
            }
            catch (error) {
                console.error(`Error updating repository ${repository.owner}/${repository.name}:`, error);
                // Continue with next repository
            }
        }
        console.log('Repository update job completed');
    }
    catch (error) {
        console.error('Error in updateAllRepositories:', error);
        throw error;
    }
}
/**
 * Updates information for a single repository from GitHub
 */
async function updateRepositoryInfo(repository) {
    try {
        console.log(`Updating repository: ${repository.owner}/${repository.name}`);
        // Use the GitHub PAT from environment variables
        const accessToken = secrets_1.default.GITHUB_PAT;
        if (!accessToken) {
            throw new Error('GitHub Personal Access Token (PAT) not found in environment variables');
        }
        const releaseInfo = await (0, githubService_1.fetchGitHubLatestRelease)(accessToken, repository.owner, repository.name);
        if (releaseInfo) {
            repository.latestReleaseDescription = releaseInfo.body || '';
            repository.latestReleaseVersion = releaseInfo.tag_name;
            repository.latestReleaseDate = new Date(releaseInfo.published_at);
            const userRepositories = await userRepositoryRepository.find({
                where: {
                    repository: { id: repository.id },
                }
            });
            // batch update the user repository seen status
            const userRepositoryUpdatePromises = userRepositories.map(async (userRepository) => {
                userRepository.seen = true;
                await userRepositoryRepository.save(userRepository);
            });
            await Promise.all(userRepositoryUpdatePromises);
            await repositoryRepository.save(repository);
            console.log(`Updated repository: ${repository.owner}/${repository.name}`);
        }
        else {
            console.log(`No release info found for ${repository.owner}/${repository.name}`);
        }
    }
    catch (error) {
        console.error(`Error updating repository ${repository.owner}/${repository.name}:`, error);
        throw error;
    }
}
