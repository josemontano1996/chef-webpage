const User = require('../models/user.model');
const authUtil = require('../util/authentication');
const inputValidation = require('../util/input-validation');

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

async function signup(req, res, next) {
  if (
    !inputValidation.userDetailsAreValid(
      req.body.email,
      req.body.password,
      req.body.fullname,
      req.body.phone,
      req.body.street,
      req.body.postal,
      req.body.city,
      req.body.country
    ) ||
    !inputValidation.emailsPasswordsMatch(
      req.body.email,
      req.body['confirm-email'],
      req.body.password,
      req.body['confirm-password']
    )
  ) {
    return alert('Invalid data, please check if your data is correct');
  }

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

  try {
    const userExistsAlready = await user.userExistsAlready();
    if (userExistsAlready) {
      return alert('User already exists');
    }

    await user.signup();
  } catch (error) {
    return next(error);
  }

  res.redirect('/customer/orders');
}

async function login(req, res, next) {
  const user = new User(req.body.email, req.body.password);

  let existingUser;
  try {
    existingUser = await user.getUserWithSameEmail();
  } catch (error) {
    return next(error);
  }

  if (!existingUser) {
    res.redirect('/auth');
    return;
  }

  let passwordIsCorrect;
  try {
    passwordIsCorrect = await user.comparePassword(existingUser.password);
  } catch (error) {
    return next(error);
  }

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
