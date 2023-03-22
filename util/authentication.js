function createUserSession(req, user, action) {
  req.session.userid = user._id.toString();
  req.session.save(action); //.save method comes from express-session package
}

function destroyUserAuthSession(req) {
  req.session.userid = null;
  req.session.save();
}

module.exports = {
  createUserSession: createUserSession,
  destroyUserAuthSession: destroyUserAuthSession,
};
