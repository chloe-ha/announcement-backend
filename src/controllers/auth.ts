import bcrypt from 'bcryptjs';

import User from '../models/user';
import { handleError, sendErrorMessage } from '../helpers/error';

export const isAuth = (req, res) => {
  if (req.session.user) {
    return res.status(200).json({ isAuth: true, user: req.session.user });
  }
  return res.status(401).json();
};

export const login = (req, res) => {
  const { email, password } = req.body;
  const failAuth = () => sendErrorMessage(403, 'Invalid email or password', res);

  return User.findOne({ email })
    .then((user) => {
      if (user) {
        return bcrypt.compare(password, user.password)
          .then((doMatch) => {
            if (doMatch) {
              req.session.user = {
                username: user.username,
                email: user.email,
                role: {
                  roleName: user.role.roleName,
                  write: user.role.write,
                },
              };
              return req.session.save(() => res.status(200)
                .json({ isAuth: true, user: req.session.user }));
            }
            return failAuth();
          })
          .catch((err) => handleError(err, res));
      }
      return failAuth();
    })
    .catch((err) => handleError(err, res));
};

export const logout = (req, res) => req.session.destroy((err) => {
  if (err) {
    return handleError(err, res);
  }
  return res.status(200).json();
});
