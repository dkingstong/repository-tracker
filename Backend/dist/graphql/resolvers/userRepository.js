"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRepositoryResolvers = void 0;
const dataSource_1 = require("../../data/dataSource");
const userRepository_1 = require("../../data/entities/userRepository");
const repository_1 = require("../../data/entities/repository");
const githubService_1 = require("../../services/githubService");
const Cache_1 = require("../../common/Cache");
const AppError_1 = __importDefault(require("../../common/AppError"));
const user_1 = require("../../data/entities/user");
exports.userRepositoryResolvers = {
    Query: {
        getUserRepositories: async (_, args, context) => {
            const { id } = context.user;
            const { filter, order } = args;
            // Generate a unique cache key based on filter and order parameters
            const filterKey = filter ? JSON.stringify(filter) : '';
            const orderKey = order ? JSON.stringify(order) : '';
            const cacheKey = `user-repositories:${id}:${filterKey}:${orderKey}`;
            const userRepositories = await (0, Cache_1.getOrAddCache)(cacheKey, async () => {
                const userRepositoryEntity = dataSource_1.AppDataSource.getRepository(userRepository_1.UserRepository);
                // Build the base query
                let query = userRepositoryEntity
                    .createQueryBuilder('userRepository')
                    .leftJoinAndSelect('userRepository.repository', 'repository')
                    .where('userRepository.userId = :userId', { userId: id });
                // Apply filters if provided
                if (filter) {
                    if (filter.search) {
                        query = query.andWhere('(repository.name LIKE :search OR repository.owner LIKE :search)', { search: `%${filter.search}%` });
                    }
                    if (filter.onlyUnseen) {
                        query = query.andWhere('userRepository.seen = :seen', { seen: false });
                    }
                }
                // Apply sorting if provided
                if (order) {
                    switch (order.field) {
                        case 'NAME':
                            query = query.orderBy('repository.name', order.direction);
                            break;
                        case 'RELEASE_DATE':
                            query = query.orderBy('repository.latestReleaseDate', order.direction);
                            break;
                        default:
                            // Default sorting
                            query = query.orderBy('repository.name', 'ASC');
                    }
                }
                else {
                    // Default sorting
                    query = query.orderBy('userRepository.seen', 'DESC');
                }
                const userRepositoriesData = await query.getMany();
                // Transform the data to match the expected format
                const userRepositoriesWithRepository = userRepositoriesData.map((userRepository) => {
                    return {
                        id: userRepository.id,
                        seen: userRepository.seen,
                        repository: {
                            id: userRepository.repository.id,
                            githubRepoId: userRepository.repository.githubRepoId,
                            owner: userRepository.repository.owner,
                            name: userRepository.repository.name,
                            latestRelease: {
                                version: userRepository.repository.latestReleaseVersion,
                                description: userRepository.repository.latestReleaseDescription,
                                releaseDate: userRepository.repository.latestReleaseDate,
                            },
                        },
                    };
                });
                return userRepositoriesWithRepository;
            });
            const user = await dataSource_1.AppDataSource.getRepository(user_1.User).findOne({
                where: { id }
            });
            if (!user) {
                throw AppError_1.default.InternalServerError('User not found');
            }
            return {
                userRepositories,
                user: {
                    id: user.id,
                    githubId: user.githubId,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                }
            };
        }
    },
    Mutation: {
        createUserRepository: async (_, { owner, name }, context) => {
            const { token, id } = context.user;
            const userRepositoryEntity = dataSource_1.AppDataSource.getRepository(userRepository_1.UserRepository);
            // check if repository is already followed
            const existingUserRepository = await userRepositoryEntity.findOne({
                where: { userId: id, repository: { owner, name } }
            });
            if (existingUserRepository) {
                throw AppError_1.default.BadRequest('Repository already followed');
            }
            const data = await (0, githubService_1.fetchGitHubLatestRelease)(token, owner, name);
            const githubRepoId = data.id;
            if (!githubRepoId) {
                throw AppError_1.default.InternalServerError('Missing required fields: githubRepoId');
            }
            const repositoryEntity = dataSource_1.AppDataSource.getRepository(repository_1.Repository);
            const existingRepository = await repositoryEntity.findOne({
                where: { owner, name }
            });
            if (!existingRepository) {
                const savedRepository = await repositoryEntity.insert({
                    githubRepoId,
                    owner,
                    name,
                    latestReleaseDescription: data.body,
                    latestReleaseVersion: data.tag_name,
                    latestReleaseDate: data.published_at
                });
                const userRepositoryEntity = dataSource_1.AppDataSource.getRepository(userRepository_1.UserRepository);
                const newUserRepository = await userRepositoryEntity.insert({
                    userId: id,
                    repositoryId: savedRepository.identifiers[0].id
                });
                const newRepository = await repositoryEntity.findOne({
                    where: { id: savedRepository.identifiers[0].id }
                });
                if (!newRepository) {
                    throw AppError_1.default.InternalServerError('Repository not found');
                }
                (0, Cache_1.deleteCache)(`user-repositories:${id}*`);
                return {
                    id: newUserRepository.identifiers[0].id,
                    repository: {
                        id: savedRepository.identifiers[0].id,
                        githubRepoId: savedRepository.identifiers[0].githubRepoId,
                        owner: newRepository.owner,
                        name: newRepository.name,
                        latestRelease: {
                            version: newRepository.latestReleaseVersion,
                            description: newRepository.latestReleaseDescription,
                            releaseDate: newRepository.latestReleaseDate
                        }
                    },
                    seen: false
                };
            }
            //check if the old data is different from the new data I think comparing release version is enough
            const updateRepositoriesToUnseen = existingRepository.latestReleaseVersion !== data.tag_name;
            if (updateRepositoriesToUnseen) {
                existingRepository.latestReleaseDescription = data.body;
                existingRepository.latestReleaseVersion = data.tag_name;
                existingRepository.latestReleaseDate = data.published_at;
                await repositoryEntity.save(existingRepository);
                // this is updating all other user repositories to unseen, so that other users see there is a new release 
                await userRepositoryEntity.update({
                    repositoryId: existingRepository.id
                }, {
                    seen: false
                });
            }
            const newUserRepository = await userRepositoryEntity.insert({
                userId: id,
                repositoryId: existingRepository.id
            });
            // Clear all user repository caches for this user
            (0, Cache_1.deleteCache)(`user-repositories:${id}*`);
            return {
                id: newUserRepository.identifiers[0].id,
                repository: {
                    id: existingRepository.id,
                    githubRepoId: existingRepository.githubRepoId,
                    owner: existingRepository.owner,
                    name: existingRepository.name,
                    latestRelease: {
                        version: existingRepository.latestReleaseVersion,
                        description: existingRepository.latestReleaseDescription,
                        releaseDate: existingRepository.latestReleaseDate
                    }
                },
                seen: false
            };
        },
        updateUserRepositorySeen: async (_, { id, seen }, context) => {
            const { id: userId } = context.user;
            const userRepositoryEntity = dataSource_1.AppDataSource.getRepository(userRepository_1.UserRepository);
            await userRepositoryEntity.update({
                id
            }, {
                seen
            });
            // Clear all user repository caches for this user
            (0, Cache_1.deleteCache)(`user-repositories:${userId}*`);
            return true;
        },
        deleteUserRepository: async (_, { id }, context) => {
            const { id: userId } = context.user;
            const userRepositoryEntity = dataSource_1.AppDataSource.getRepository(userRepository_1.UserRepository);
            const userRepository = await userRepositoryEntity.findOne({
                where: { id }
            });
            if (!userRepository) {
                throw new Error('Repository not found');
            }
            await userRepositoryEntity.remove(userRepository);
            // Clear all user repository caches for this user
            (0, Cache_1.deleteCache)(`user-repositories:${userId}*`);
            return true;
        },
        syncUserRepositories: async (_, __, context) => {
            const { token, id: userId } = context.user;
            const userRepositoryEntity = dataSource_1.AppDataSource.getRepository(userRepository_1.UserRepository);
            const repositoryEntity = dataSource_1.AppDataSource.getRepository(repository_1.Repository);
            const userRepositories = await userRepositoryEntity.find({
                where: { userId },
                relations: ['repository']
            });
            // TODO: If the repository has updates, we should update the users repositories seen to false
            // TODO: Add pagination or maybe limit the parallel requests
            // TODO: rate limit the requests
            const userRepositoriesResponse = await Promise.all(userRepositories.map(async (userRepository) => {
                const data = await (0, githubService_1.fetchGitHubLatestRelease)(token, userRepository.repository.owner, userRepository.repository.name);
                if (userRepository.repository.latestReleaseVersion !== data.tag_name) {
                    userRepository.seen = false;
                }
                userRepository.repository.latestReleaseDescription = data.body;
                userRepository.repository.latestReleaseVersion = data.tag_name;
                userRepository.repository.latestReleaseDate = data.published_at;
                await repositoryEntity.save(userRepository.repository);
                await userRepositoryEntity.save(userRepository);
                return {
                    id: userRepository.id,
                    seen: userRepository.seen,
                    repository: {
                        id: userRepository.repository.id,
                        githubRepoId: userRepository.repository.githubRepoId,
                        owner: userRepository.repository.owner,
                        name: userRepository.repository.name,
                        latestRelease: {
                            version: userRepository.repository.latestReleaseVersion,
                            description: userRepository.repository.latestReleaseDescription,
                            releaseDate: userRepository.repository.latestReleaseDate
                        }
                    }
                };
            }));
            // Clear all user repository caches for this user
            (0, Cache_1.deleteCache)(`user-repositories:${userId}*`);
            return userRepositoriesResponse;
        }
    }
};
