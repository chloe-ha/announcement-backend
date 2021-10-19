import express from 'express';

import { isAuth, isAdmin } from '../middleware/access-control';
import {
  getAnnouncements,
  createAnnouncement,
  editAnnouncement,
  deleteAnnouncement,
} from '../controllers/announcement';

const router = express.Router();

router.get('/announcements', isAuth, getAnnouncements);
router.post('/announcement', isAuth, isAdmin, createAnnouncement);
router.post('/announcement/:id', isAuth, isAdmin, editAnnouncement);
router.delete('/announcement/:id', isAuth, isAdmin, deleteAnnouncement);

export default router;
