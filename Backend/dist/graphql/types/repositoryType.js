"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.repositoryType = void 0;
const apollo_server_express_1 = require("apollo-server-express");
exports.repositoryType = (0, apollo_server_express_1.gql) `
  type Repository {
    id: ID!
    githubRepoId: Int!
    owner: String!
    name: String!
    latestRelease: Release!
  }
`;
