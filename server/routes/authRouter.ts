import express from 'express';
import authCtrl from '../controller/authCtrl';
import { validRegister } from '../middleware/valid';

const router = express.Router();

router.post('/login', authCtrl.login)
router.post('/register', validRegister, authCtrl.register)
router.get('/accessToken', authCtrl.accessToken)
export default router;