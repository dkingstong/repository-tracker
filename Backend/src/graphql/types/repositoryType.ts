import { gql } from 'apollo-server-express';

export const repositoryType = gql`
  type Repository {
    id: ID!
    githubRepoId: Int!
    owner: String!
    name: String!
    latestRelease: Release!
  }
`; 