import express from 'express';

import userController from '../controllers/user';

const router = express.Router();

router.get('/users', userController.getUsers);
router.post('/invite-user', userController.inviteUser);
router.get('/token-email/:token', userController.getTokenEmail);
router.post('/user/:token', userController.postUser);

export default router;
