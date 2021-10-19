import crypto from 'crypto';
import bcrypt from 'bcryptjs';

import Invite from '../models/invite';
import Role from '../models/role';
import User from '../models/user';
import { sendEmail } from '../helpers/email';
import { handleError, sendErrorMessage } from '../helpers/error';

export const getUsers = (req, res) => User.find({ 'role.roleName': { $ne: 'Admin' } })
  .then((users) => {
    res.send(users);
  })
  .catch((err) => handleError(err, res));

export const inviteUser = (req, res) => {
  const { email, role } = req.body;
  return User.findOne({ email })
    .then((user) => {
      if (user) {
        return sendErrorMessage(422, 'User already has an account', res);
      }

      return crypto.randomBytes(32, (err, buff) => {
        if (err) {
          return handleError(err, res);
        }
        const token = buff.toString('hex');
        sendEmail(
          email,
          'You are invited to follow the announcements!',
          (clientUrl) => `
            <h1>You are invited to sign up to our new app!</h1>
            <p>Click <a href="${clientUrl}/signup/${token}">here</a> to sign up (valid 24h)</p>
          `,
        );
        res.status(200).json();
        return Invite.deleteMany({ email }).then(() => new Invite({
          email, role, token, tokenExpiry: Date.now() + 24 * 3600000,
        }).save());
      });
    })
    .catch((err) => handleError(err, res));
};

export const getTokenEmail = (req, res) => {
  const { token } = req.params;
  return Invite.findOne({ token }).then((invite) => {
    if (invite && invite.tokenExpiry > new Date()) {
      return res.status(200).json({ email: invite.email });
    }
    return sendErrorMessage(422, 'The invitation is invalid or expired', res);
  });
};

export const postUser = (req, res) => {
  const { token } = req.params;
  const { username, password } = req.body;

  return Invite.findOne({ token })
    .then((invite) => {
      if (invite && invite.tokenExpiry > new Date()) {
        const { email, role } = invite;
        return bcrypt.hash(password, 12)
          .then((encryptedPassword) => Role.find({ roleName: role })
            .then((currentRole) => new User({
              username, email, password: encryptedPassword, role: currentRole[0],
            }).save()
              .then(() => invite.remove())
              .then(() => res.status(200).json())
              .catch((err) => console.error(err)))
            .catch((err) => console.error(err)))
          .catch((err) => console.error(err));
      }
      return sendErrorMessage(422, 'The invitation is invalid or expired', res);
    })
    .catch((err) => handleError(err, res));
};
