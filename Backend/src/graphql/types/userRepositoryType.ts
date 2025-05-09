import { gql } from 'apollo-server-express';

export const userRepositoryType = gql`
  type UserRepository {
    id: ID!
    repository: Repository!
    seen: Boolean!
  }
  type UserRepositories {
    user: User!
    userRepositories: [UserRepository]!
  }

  input RepositoryFilterInput {
    search: String
    onlyUnseen: Boolean
  }

  enum RepositorySortField {
    NAME
    RELEASE_DATE
  }

  enum SortDirection {
    ASC
    DESC
  }

  input RepositoryOrderInput {
    field: RepositorySortField!
    direction: SortDirection!
  }

  type Query {
    getUserRepositories(
      filter: RepositoryFilterInput
      order: RepositoryOrderInput
    ): UserRepositories!
  }

  type Mutation {
    createUserRepository(owner: String!, name: String!): UserRepository!
    deleteUserRepository(id: ID!): Boolean!
    updateUserRepositorySeen(id: ID!, seen: Boolean!): Boolean!
    syncUserRepositories: [UserRepository]!
  }
`;