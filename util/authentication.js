function createUserSession(req, user, action) {
  req.session.userid = user._id.toString();
  req.session.save(action); //.save method comes from express-session package
}

module.exports = {
  createUserSession: createUserSession,
};
