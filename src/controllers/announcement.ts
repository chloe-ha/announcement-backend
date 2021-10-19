import Announcement from '../models/announcement';
import Role from '../models/role';
import User from '../models/user';
import { sendEmail } from '../helpers/email';
import { handleError, sendErrorMessage } from '../helpers/error';

export const getAnnouncements = (req, res) => {
  const currentRole = req.session.user.role.roleName;
  return Announcement.find()
    .populate('role')
    // TODO: understand how this works
    // .select('title description datetime role_roleName')
    .then((result) => result
      .map((r) => ({
        _id: r._id,
        title: r.title,
        description: r.description,
        datetime: r.datetime,
        roleName: r.role.roleName,
      }))
      .filter((r) => {
        if (currentRole === 'Staff' && r.roleName === 'Staff') return true;
        if (currentRole === 'Manager') return true;
        if (currentRole === 'Admin') return true;
        return false;
      }))
    .then((result) => res.status(200).json(result))
    .catch((err) => handleError(err, res));
};

export const createAnnouncement = (req, res) => {
  const {
    title, description, datetime, roleName,
  } = req.body;
  return Role.find({ roleName })
    .then((role) => {
      if (!role.length) {
        return sendErrorMessage(422, 'Role not found', res);
      }
      return new Announcement({
        title, description, datetime, role: role[0]._id,
      })
        .save()
        .then(() => {
          if (roleName === 'Staff') return User.find({ 'role.roleName': { $in: ['Staff', 'Manager'] } });
          if (roleName === 'Manager') return User.find({ 'role.roleName': { $eq: 'Manager' } });
          return [];
        })
        .then((usersToNotify) => {
          const toEmails = usersToNotify.map((u) => u.email);
          sendEmail(
            toEmails,
            'A new announcement is available',
            (clientUrl) => `
              <h1>A new announcement has been published</h1>
              <p>Go check out the latest news <a href="${clientUrl}">now</a></p>
            `,
          );
          return res.status(200).json();
        });
    })
    .catch((err) => handleError(err, res));
};

export const editAnnouncement = (req, res) => {
  const announcementId = req.params.id;
  const {
    title, description, datetime, roleName,
  } = req.body;
  return Role.find({ roleName })
    .then((role) => {
      if (!role.length) {
        return sendErrorMessage(422, 'Role not found', res);
      }
      return Announcement.findById(announcementId)
        .then((announcement) => {
          announcement.title = title;
          announcement.description = description;
          announcement.datetime = datetime;
          announcement.role = role[0]._id;
          return announcement.save();
        })
        .then(() => res.status(200).json());
    })
    .catch((err) => handleError(err, res));
};

export const deleteAnnouncement = (req, res) => {
  const announcementId = req.params.id;

  Announcement.findById(announcementId)
    .then((announcement) => announcement.remove())
    .then(() => res.status(200).json())
    .catch((err) => handleError(err, res));
};
