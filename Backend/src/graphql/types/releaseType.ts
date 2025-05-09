import { gql } from 'apollo-server-express';

export const releaseType = gql`
  type Release {
    version: String!
    releaseDate: String!
    description: String!
  }
`;