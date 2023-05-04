function createUserSession(req, user, action) {
  req.session.userid = user._id.toString();
  if (user.cart && user.cart.totalQuantity > 0) {
    req.session.cart = user.cart;
  }
  req.session.isAdmin = user.isAdmin;
  req.session.save(action); //.save method comes from express-session package
}

module.exports = {
  createUserSession: createUserSession,
};
