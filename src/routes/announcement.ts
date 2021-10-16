import express from 'express';

import Announcement from '../models/announcement';

const router = express.Router();

router.get('/announcements', (req, res) => {
  Announcement.find()
    .then((result) => res.send(result))
    .catch((err) => console.log(err));
});

router.post('/announcement', (req, res) => {
  const { title, description, datetime } = req.body;
  new Announcement({ title, description, datetime })
    .save()
    .then(() => res.sendStatus(200))
    .catch((err) => console.log(err));
});

router.post('/announcement/:id', (req, res) => {
  const announcementId = req.params.id;
  const { title, description, datetime } = req.body;
  Announcement.findById(announcementId)
    .then((announcement) => {
      announcement.title = title;
      announcement.description = description;
      announcement.datetime = datetime;
      return announcement.save();
    })
    .then(() => res.sendStatus(200))
    .catch((err) => console.log(err));
});

router.delete('/announcement/:id', (req, res) => {
  const announcementId = req.params.id;

  Announcement.findById(announcementId)
    .then((announcement) => announcement.remove())
    .then(() => res.sendStatus(200))
    .catch((err) => console.log(err));
});

export default router;
