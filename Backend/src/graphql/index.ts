import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';
import { userType } from './types/userType';
import { repositoryType } from './types/repositoryType';
import { userRepositoryType } from './types/userRepositoryType';
import { releaseType } from './types/releaseType';
import { userRepositoryResolvers } from './resolvers/userRepository';

export const typeDefs = mergeTypeDefs([
  userType,
  repositoryType,
  userRepositoryType,
  releaseType,
]);

export const resolvers = mergeResolvers([
  userRepositoryResolvers,
]); 