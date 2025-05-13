"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = exports.typeDefs = void 0;
const merge_1 = require("@graphql-tools/merge");
const userType_1 = require("./types/userType");
const repositoryType_1 = require("./types/repositoryType");
const userRepositoryType_1 = require("./types/userRepositoryType");
const releaseType_1 = require("./types/releaseType");
const userRepository_1 = require("./resolvers/userRepository");
exports.typeDefs = (0, merge_1.mergeTypeDefs)([
    userType_1.userType,
    repositoryType_1.repositoryType,
    userRepositoryType_1.userRepositoryType,
    releaseType_1.releaseType,
]);
exports.resolvers = (0, merge_1.mergeResolvers)([
    userRepository_1.userRepositoryResolvers,
]);
