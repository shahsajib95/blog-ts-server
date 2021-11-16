import express from 'express'
import { likeCtrl } from '../controller/likeCtrl';
import { auth } from '../middleware/auth';

const router = express.Router();

router.get('/blog/like/:id', likeCtrl.get)
router.post('/blog/like', auth, likeCtrl.post)
router.delete('/blog/like/:id/:blogId', auth, likeCtrl.unlike)

export default router;