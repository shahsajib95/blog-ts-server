import express from 'express';
import blogCtrl from '../controller/blogCtrl';

const router = express.Router();

router.post('/blog/post', blogCtrl.post)
router.get('/blog/:id', blogCtrl.details)
router.get('/blog/get/:type', blogCtrl.get)
router.delete('/blog/delete/:id', blogCtrl.delete)

export default router;