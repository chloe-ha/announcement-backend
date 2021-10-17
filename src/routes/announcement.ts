import express from 'express';

import announcementController from '../controllers/announcementController';

const router = express.Router();

router.get('/announcements', announcementController.getAnnouncements);
router.post('/announcement', announcementController.createAnnouncement);
router.post('/announcement/:id', announcementController.editAnnouncement);
router.delete('/announcement/:id', announcementController.deleteAnnouncement);

export default router;
