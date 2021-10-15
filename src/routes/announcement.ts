import express from 'express';

import Announcement from '../models/announcement';

const router = express.Router();

router.get('/announcements', (req, res, next) => {
  Announcement.find()
    .then(result => res.send(result))
    .catch(err => console.log(err));
});

router.post('/announcement', (req, res, next) => {
  const { title, description, datetime } = req.body;
  new Announcement({ title, description, datetime })
    .save()
    .then(() => res.sendStatus(200))
    .catch(err => console.log(err));
});

export default router;