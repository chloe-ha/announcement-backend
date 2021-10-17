import express from 'express';

import authController from '../controllers/auth';

const router = express.Router();

router.get('/isAuth', authController.isAuth);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

export default router;
