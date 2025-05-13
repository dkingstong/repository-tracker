"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.releaseType = void 0;
const apollo_server_express_1 = require("apollo-server-express");
exports.releaseType = (0, apollo_server_express_1.gql) `
  type Release {
    version: String!
    releaseDate: String!
    description: String!
  }
`;
