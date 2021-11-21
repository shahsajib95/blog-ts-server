import authRouter from './authRouter'
import blogRouter from './blogRouter';
import userRouter from './userRouter'
import likeRouter from './likeRouter'
import commentRouter from './commentRouter'

const routes = [
  authRouter,
  blogRouter,
  userRouter,
  likeRouter,
  commentRouter
]
export default routes;