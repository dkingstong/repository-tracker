import { Request, Response, NextFunction } from 'express';
import { Octokit } from "@octokit/rest";
import AppError from '../common/AppError';
import { AppDataSource } from '../data/dataSource';
import { User } from '../data/entities/user';

declare global {
  namespace Express {
    interface Request {
      context: {
        user: {
          githubId: number;
          token: string;
          id: string;
        }
      };
    }
  }
}

export interface GraphQLContext {
  user: {
    githubId: number;
    token: string;
    id: string;
  }
}

export async function validateGithubToken(
  token: string,
  userId: string
): Promise<GraphQLContext> {
  if (!token || !userId) {
    throw AppError.BadRequest('Unauthorized: No token or user id provided');
  }

  try {
    const octokit = new Octokit({ auth: token });
    const githubUser = await octokit.users.getAuthenticated();
    const userEntity = AppDataSource.getRepository(User);
    const user = await userEntity.findOne({
      where: { id: userId }
    });
    if (!user) {
      throw AppError.NotFound('User not found');
    } 
    return { user: { githubId: githubUser.data.id, token, id: user.id } };
  } catch (error) {
    throw AppError.Unauthorized('Unauthorized: Invalid token');
  }
}
