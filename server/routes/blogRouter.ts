import express from 'express';
import blogCtrl from '../controller/blogCtrl';
import { auth } from '../middleware/auth';

const router = express.Router();

router.post('/blog/post', blogCtrl.post)
router.get('/blog/:id', blogCtrl.details)
router.get('/blog/get/:type', blogCtrl.get)
router.delete('/blog/delete/:id', auth, blogCtrl.delete)

export default router;