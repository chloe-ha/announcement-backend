import Announcement from '../models/announcement';

const getAnnouncements = (req, res) => {
  Announcement.find()
    .then((result) => res.send(result))
    .catch((err) => console.error(err));
};

const createAnnouncement = (req, res) => {
  const { title, description, datetime } = req.body;
  new Announcement({ title, description, datetime })
    .save()
    .then(() => res.sendStatus(200))
    .catch((err) => console.error(err));
};

const editAnnouncement = (req, res) => {
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
    .catch((err) => console.error(err));
};

const deleteAnnouncement = (req, res) => {
  const announcementId = req.params.id;

  Announcement.findById(announcementId)
    .then((announcement) => announcement.remove())
    .then(() => res.sendStatus(200))
    .catch((err) => console.error(err));
};

export default {
  getAnnouncements,
  createAnnouncement,
  editAnnouncement,
  deleteAnnouncement
};
