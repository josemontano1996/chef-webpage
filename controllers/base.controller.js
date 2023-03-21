const User = require('../models/user.model');

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

function login(req, res) {
  res.render('customer/menu');
}

module.exports = {
  getIndex: getIndex,
  getAbout: getAbout,
  getMenu: getMenu,
  getAuth: getAuth,
  gerOrders: getOrders,
  signup: signup,
  login: login,
};
