function checkAuthStatus(req, res, next) {
  const userid = req.session.userid; //if req.sessions.userid is true it means that user is logged in

  if (!userid) {
    return next();
  }

  res.locals.userid = userid;
  res.locals.isAuth = true;
  res.locals.isAdmin = req.session.isAdmin;

  next();
}

module.exports = checkAuthStatus;
