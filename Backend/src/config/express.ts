import express from 'express'
import cookieParser from 'cookie-parser'
import routes from '../routes'
import cors from 'cors'
import AppError from '../common/AppError'
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs, resolvers } from '../graphql/index';
import { GraphQLContext, validateGithubToken } from '../middleware/authMiddleware'
import { Request } from 'express';

export async function app(): Promise<express.Application> {
  const app = express()
  const server = new ApolloServer<GraphQLContext>({ typeDefs, resolvers });

  const corsOptions = {
    credentials: true,
    origin: ['http://localhost:3000'], // Whitelist the domains you want to allow
  }
  
  app.use(cors(corsOptions))
  // Handle preflight (OPTIONS) requests explicitly if needed
  app.options('*', cors(corsOptions));  // This handles all OPTIONS requests globally
  
  app.use(express.json())
  app.use(express.urlencoded({ limit: '50mb', extended: true }))
  app.use(cookieParser())

  app.use('/', routes)

  await server.start();
  
  app.use('/graphql', expressMiddleware(server, {
    context: async ({ req }: { req: Request }) => {
      const token = req.cookies.github_token;
      const userId = req.cookies.user_id;
      const context = await validateGithubToken(token, userId);
      return context;
    }
  }));

  // Error handling
  app.use((_req, _res, next) => {
    const error = AppError.NotFound('Invalid API route')
    next(error)
  })
  return app
}
