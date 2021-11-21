import express from 'express'
import commentCtrl from '../controller/commentCtrl';
import { auth } from '../middleware/auth';

const router = express.Router();

router.post('/comment', auth, commentCtrl.createComment)
router.get('/comment/:id',  commentCtrl.getComment)

router.post('/replyComment', auth, commentCtrl.replyComment)

export default router;