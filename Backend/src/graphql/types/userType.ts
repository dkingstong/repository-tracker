import { gql } from 'apollo-server-express';

export const userType = gql`
  type User {
    id: ID!
    githubId: Int!
    email: String
    firstName: String
    lastName: String
  }
`; 