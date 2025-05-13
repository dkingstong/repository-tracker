"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = app;
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const routes_1 = __importDefault(require("../routes"));
const cors_1 = __importDefault(require("cors"));
const AppError_1 = __importDefault(require("../common/AppError"));
const server_1 = require("@apollo/server");
const express4_1 = require("@apollo/server/express4");
const index_1 = require("../graphql/index");
const authMiddleware_1 = require("../middleware/authMiddleware");
async function app() {
    const app = (0, express_1.default)();
    const server = new server_1.ApolloServer({ typeDefs: index_1.typeDefs, resolvers: index_1.resolvers });
    const corsOptions = {
        credentials: true,
        origin: ['http://localhost:3000'], // Whitelist the domains you want to allow
    };
    app.use((0, cors_1.default)(corsOptions));
    // Handle preflight (OPTIONS) requests explicitly if needed
    app.options('*', (0, cors_1.default)(corsOptions)); // This handles all OPTIONS requests globally
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ limit: '50mb', extended: true }));
    app.use((0, cookie_parser_1.default)());
    app.use('/', routes_1.default);
    await server.start();
    app.use('/graphql', (0, express4_1.expressMiddleware)(server, {
        context: async ({ req }) => {
            const token = req.cookies.github_token;
            const userId = req.cookies.user_id;
            const context = await (0, authMiddleware_1.validateGithubToken)(token, userId);
            return context;
        }
    }));
    // Error handling
    app.use((_req, _res, next) => {
        const error = AppError_1.default.NotFound('Invalid API route');
        next(error);
    });
    return app;
}
