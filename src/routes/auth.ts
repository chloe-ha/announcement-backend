import express from 'express';

import { isAuth, login, logout } from '../controllers/auth';

const router = express.Router();

router.get('/isAuth', isAuth);
router.post('/login', login);
router.post('/logout', logout);

export default router;
