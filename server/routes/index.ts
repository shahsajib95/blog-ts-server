import authRouter from './authRouter'
import blogRouter from './blogRouter';
import userRouter from './userRouter'
import likeRouter from './likeRouter'

const routes = [
  authRouter,
  blogRouter,
  userRouter,
  likeRouter
]
export default routes;