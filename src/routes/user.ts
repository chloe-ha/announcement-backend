import express from 'express';

import accessControl from '../middleware/access-control';
import userController from '../controllers/user';

const router = express.Router();

router.get('/users',
  accessControl.isAuth,
  accessControl.isAdmin,
  userController.getUsers);
router.post('/invite-user',
  accessControl.isAuth,
  accessControl.isAdmin,
  userController.inviteUser);
router.get('/token-email/:token', userController.getTokenEmail);
router.post('/user/:token', userController.postUser);

export default router;
