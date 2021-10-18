const isAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.sendStatus(401);
  }
  return next();
};
const isAdmin = (req, res, next) => {
  if (!req.session.user
    || (req.session.user && !req.session.user.role.write)
  ) {
    return res.sendStatus(403);
  }
  return next();
};
export default { isAuth, isAdmin };
