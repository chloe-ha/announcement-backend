import dotenv from 'dotenv';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import sendgridTransport from 'nodemailer-sendgrid-transport';

import Invite from '../models/invite';
import Role from '../models/role';
import User from '../models/user';

dotenv.config();
const SEND_GRID_API_KEY = process.env.SEND_GRID_API_KEY || '';

const transporter = nodemailer.createTransport(sendgridTransport({
  auth: { api_key: SEND_GRID_API_KEY },
}));

const getUsers = (req, res) => User.find({ 'role.roleName': { $ne: 'Admin' } })
  .then((users) => {
    res.send(users);
  })
  .catch((err) => console.error(err));

const inviteUser = (req, res) => {
  const { email, role } = req.body;
  return User.findOne({ email })
    .then((user) => {
      if (user) {
        return res.status(422).send({ error: 'User already has an account' });
      }

      return crypto.randomBytes(32, (err, buff) => {
        if (err) {
          console.log(err);
          return res.sendStatus(500);
        }
        const token = buff.toString('hex');
        transporter.sendMail({
          to: email,
          from: 'c.ha@groupeonepoint.com',
          subject: 'You are invited to follow the announcements!',
          html: `
            <h1>You are invited to sign up to our new app!</h1>
            <p>Click <a href="http://localhost:3000/signup/${token}">here</a> to sign up (valid 24h)</p>
          `,
        });
        res.sendStatus(200);
        return Invite.deleteMany({ email }).then(() => new Invite({
          email, role, token, tokenExpiry: Date.now() + 24 * 3600000,
        }).save());
      });
    })
    .catch((err) => console.error(err));
};

const getTokenEmail = (req, res) => {
  const { token } = req.params;
  return Invite.findOne({ token }).then((invite) => {
    if (invite && invite.tokenExpiry > new Date()) {
      return res.status(200).send({ email: invite.email });
    }
    return res.status(422).send({ error: 'The invitation is invalid or expired' });
  });
};

const postUser = (req, res) => {
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
              .then(() => res.sendStatus(200))
              .catch((err) => console.error(err)))
            .catch((err) => console.error(err)))
          .catch((err) => console.error(err));
      }
      return res.status(422).send({ error: 'The invitation is invalid or expired' });
    })
    .catch((err) => console.error(err));
};

export default {
  getUsers, inviteUser, getTokenEmail, postUser,
};
