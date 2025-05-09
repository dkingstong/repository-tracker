import { gql } from '@apollo/client';

export const GET_USER_REPOSITORIES = gql`
  query GetUserRepositories($filter: RepositoryFilterInput, $order: RepositoryOrderInput) {
    getUserRepositories(filter: $filter, order: $order) {
      user {
        id
        githubId
        email
        firstName
        lastName
      }
      userRepositories {
        id
        seen
        repository {
          id
          name
          latestRelease {
            version
            releaseDate
            description
          }
        }  
      }
    } 
  }
`; 

export const CREATE_USER_REPOSITORY = gql`
  mutation CreateUserRepository($owner: String!, $name: String!) {
    createUserRepository(owner: $owner, name: $name) {
      id
      seen
      repository {
        id
        name
        latestRelease {
          version
          releaseDate
          description
        }
      }
    }
  }
`;

export const DELETE_USER_REPOSITORY = gql`
  mutation DeleteUserRepository($id: ID!) {
    deleteUserRepository(id: $id)
  }
`;

export const UPDATE_USER_REPOSITORY_SEEN = gql`
  mutation UpdateUserRepositorySeen($id: ID!, $seen: Boolean!) {
    updateUserRepositorySeen(id: $id, seen: $seen)
  }
`;

export const SYNC_USER_REPOSITORIES = gql`
  mutation SyncUserRepositories {
    syncUserRepositories {
      id
      seen
      repository {
        id
        name
        latestRelease {
          version
          releaseDate
          description
        }
      }
    }
  }
`;

