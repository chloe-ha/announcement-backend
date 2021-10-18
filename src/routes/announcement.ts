import express from 'express';

import accessControl from '../middleware/access-control';
import announcementController from '../controllers/announcement';

const router = express.Router();

router.get('/announcements',
  accessControl.isAuth,
  announcementController.getAnnouncements);
router.post('/announcement',
  accessControl.isAuth,
  accessControl.isAdmin,
  announcementController.createAnnouncement);
router.post('/announcement/:id',
  accessControl.isAuth,
  accessControl.isAdmin,
  announcementController.editAnnouncement);
router.delete('/announcement/:id',
  accessControl.isAuth,
  accessControl.isAdmin,
  announcementController.deleteAnnouncement);

export default router;
