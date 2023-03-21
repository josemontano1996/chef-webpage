const User = require('../models/user.model');

function getIndex(req, res) {
  res.render('./index');
}

function getAbout(req, res) {
  res.render('./about');
}

function getMenu(req, res) {
  res.render('./menu');
}

function getAuth(req, res) {
  res.render('./auth');
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

  res.redirect('/orders');
}

function login(req, res) {
  res.render('./menu');
}

module.exports = {
  getIndex: getIndex,
  getAbout: getAbout,
  getMenu: getMenu,
  getAuth: getAuth,
  signup: signup,
};
