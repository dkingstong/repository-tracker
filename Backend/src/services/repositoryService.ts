import { Repository } from '../data/entities/repository';
import { AppDataSource } from '../data/dataSource';
import { fetchGitHubLatestRelease } from './githubService';
import secrets from '../config/secrets';
import { UserRepository } from '../data/entities/userRepository';

const repositoryRepository = AppDataSource.getRepository(Repository);
const userRepositoryRepository = AppDataSource.getRepository(UserRepository);

/**
 * Updates information for all repositories in the database from GitHub
 */
export async function updateAllRepositories(): Promise<void> {
  try {
    console.log('Starting repository update job');
    const repositories = await repositoryRepository.find();
    
    console.log(`Updating ${repositories.length} repositories`);
    
    for (const repository of repositories) {
      try {
        await updateRepositoryInfo(repository);
      } catch (error) {
        console.error(`Error updating repository ${repository.owner}/${repository.name}:`, error);
        // Continue with next repository
      }
    }
    
    console.log('Repository update job completed');
  } catch (error) {
    console.error('Error in updateAllRepositories:', error);
    throw error;
  }
}

/**
 * Updates information for a single repository from GitHub
 */
async function updateRepositoryInfo(repository: Repository): Promise<void> {
  try {
    console.log(`Updating repository: ${repository.owner}/${repository.name}`);
    
    // Use the GitHub PAT from environment variables
    const accessToken = secrets.GITHUB_PAT;
    
    if (!accessToken) {
      throw new Error('GitHub Personal Access Token (PAT) not found in environment variables');
    }
    
    const releaseInfo = await fetchGitHubLatestRelease(
      accessToken,
      repository.owner,
      repository.name
    );
    
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
    } else {
      console.log(`No release info found for ${repository.owner}/${repository.name}`);
    }
  } catch (error) {
    console.error(`Error updating repository ${repository.owner}/${repository.name}:`, error);
    throw error;
  }
} 