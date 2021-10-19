import express from 'express';

import { isAuth, isAdmin } from '../middleware/access-control';
import {
  getUsers, inviteUser, getTokenEmail, postUser,
} from '../controllers/user';

const router = express.Router();

router.get('/users', isAuth, isAdmin, getUsers);
router.post('/invite-user', isAuth, isAdmin, inviteUser);
router.get('/token-email/:token', getTokenEmail);
router.post('/user/:token', postUser);

export default router;
