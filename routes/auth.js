import express from 'express';
import authController from '../controllers/auth.js';

const router = express.Router();

router.post('/login', authController.login);
router.post('/googlelogin', authController.googlelogin);
router.post('/signup', authController.signup);

export default router;
