import { Request, Response, Router } from 'express'
import expressAsyncHandler from 'express-async-handler'
import { getAccessToken, getGithubUser } from '../services/githubService'
import { User } from '../data/entities/user'
import { AppDataSource } from '../data/dataSource'
const router = Router()

router.get(
  '/callback',
  expressAsyncHandler(async (req: Request, res: Response) => {
    try {
      const code = req.query.code
      if (!code) {
        throw new Error('No code provided')
      }

      // Get access token
      const accessToken = await getAccessToken(code as string)
      if (!accessToken) {
        throw new Error('Failed to get access token')
      }

      // Get user data
      const userData = await getGithubUser(accessToken)
      const userEntity = AppDataSource.getRepository(User);
      //store data in db

      const user = await userEntity.save({
        githubId: userData.id,
        email: userData.email || '',
        firstName: userData.name || '',
        lastName: userData.name || '',
      });
      
      // Store the token and user data
      res.cookie('github_token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        domain: 'localhost'
      })
      res.cookie('user_id', user.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        domain: 'localhost'
      })
      // Redirect to home page or dashboard
      res.redirect(process.env.FRONTEND_URL + '/tracker')
    } catch (error) {
      console.error('Authentication error:', error)
      res.redirect(process.env.FRONTEND_URL + '/auth/error')
    }
  }),
)



export default router
