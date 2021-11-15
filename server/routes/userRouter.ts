import express from 'express';
import userCtrl from '../controller/userCtrl';

const router = express.Router();

router.get('/user/:id', userCtrl.details)
router.get('/user/blog/:id', userCtrl.blogs)
router.patch('/user/details/:id', userCtrl.patch)
router.patch('/user/avatar/:id', userCtrl.avatar)

export default router;