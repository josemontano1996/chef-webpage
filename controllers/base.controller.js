const User = require('../models/user.model');
const authUtil = require('../util/authentication');

function getIndex(req, res) {
  res.render('customer/index');
}

function getAbout(req, res) {
  res.render('customer/about');
}

function getMenu(req, res) {
  res.render('customer/menu');
}

function getAuth(req, res) {
  res.render('customer/auth');
}

function getOrders(req, res) {
  res.render('customer/orders');
}

async function signup(req, res) {
  const user = new User(
    req.body.email,
    req.body.password,
    req.body.fullname,
    req.body.phone,
    req.body.street,
    req.body.postal,
    req.body.city,
    req.body.country
  );

  await user.signup();

  res.redirect('/customer/orders');
}

async function login(req, res) {
  const user = new User(req.body.email, req.body.password);

  const existingUser = await user.getUserWithSameEmail();

  if (!existingUser) {
    res.redirect('/auth');
    return;
  }

  const passwordIsCorrect = await user.comparePassword(existingUser.password);

  if (!passwordIsCorrect) {
    res.redirect('/auth');
    return;
  }

  authUtil.createUserSession(req, existingUser, function () {
    res.redirect('/menu');
  });
}

function logout(req, res) {
  authUtil.destroyUserAuthSession(req);
  res.redirect('/');
}

module.exports = {
  getIndex: getIndex,
  getAbout: getAbout,
  getMenu: getMenu,
  getAuth: getAuth,
  getOrders: getOrders,
  signup: signup,
  login: login,
  logout: logout,
};
