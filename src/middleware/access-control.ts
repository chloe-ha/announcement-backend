export const isAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json();
  }
  return next();
};
export const isAdmin = (req, res, next) => {
  if (!req.session.user
    || (req.session.user && !req.session.user.role.write)
  ) {
    return res.status(403).json();
  }
  return next();
};
