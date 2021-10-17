import bcrypt from 'bcryptjs';

import User from '../models/user';

const isAuth = (req, res) => res.send({ isAuth: !!req.session.user });

const login = (req, res) => {
  const { email, password } = req.body;
  const failAuth = () => res
    .status(403)
    .send({ error: 'Invalid email or password' });

  return User.findOne({ email })
    .then((user) => {
      if (user) {
        return bcrypt.compare(password, user.password)
          .then((doMatch) => {
            if (doMatch) {
              req.session.user = user;
              return req.session.save(() => res.sendStatus(200));
            }
            return failAuth();
          })
          .catch((err) => console.error(err));
      }
      return failAuth();
    })
    .catch((err) => console.error(err));
};

const logout = (req, res) => req.session.destroy((err) => {
  if (err) {
    console.error(err);
    return res.sendStatus(500);
  }
  return res.sendStatus(200);
});

export default { isAuth, login, logout };
