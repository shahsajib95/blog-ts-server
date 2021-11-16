import express from 'express';
import userCtrl from '../controller/userCtrl';
import { auth } from '../middleware/auth';

const router = express.Router();

router.get('/user/:id', userCtrl.details)
router.get('/user/blog/:id', userCtrl.blogs)
router.patch('/user/details/:id', auth, userCtrl.patch)
router.patch('/user/avatar/:id', auth, userCtrl.avatar)

export default router;