"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userType = void 0;
const apollo_server_express_1 = require("apollo-server-express");
exports.userType = (0, apollo_server_express_1.gql) `
  type User {
    id: ID!
    githubId: Int!
    email: String
    firstName: String
    lastName: String
  }
`;
