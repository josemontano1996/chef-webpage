function createUserSession(req, user, action) {
  req.session.userid = user._id.toString();
  req.session.isAdmin = user.isAdmin;
  req.session.save(action); //.save method comes from express-session package
}

function destroyUserAuthSession(req) {
  req.session.userid = null;
  req.session.isAdmin = null;
}

module.exports = {
  createUserSession: createUserSession,
  destroyUserAuthSession: destroyUserAuthSession,
};
