const session = require('express-session');
const User = require('../models/user.model');
const authUtil = require('../util/authentication');
const inputValidation = require('../util/input-validation');
const sessionFlash = require('../util/session-flash');

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
  res.render('customer/auth/auth');
}

function getSignup(req, res) {
  let sessionData = sessionFlash.getSessionData(req);

  if (!sessionData) {
    sessionData = {
      email: '',
      confirmEmail: '',
      password: '',
      confirmPassword: '',
      name: '',
      phone: '',
      street: '',
      postal: '',
      city: '',
      country: '',
    };
  }

  res.render('customer/auth/signup', { inputData: sessionData });
}

function getLogin(req, res) {
  let sessionData = sessionFlash.getSessionData(req);

  if (!sessionData) {
    sessionData = {
      email: '',
      password: '',
    };
  }
  res.render('customer/auth/login', { inputData: sessionData });
}

function getOrders(req, res) {
  res.render('customer/orders/orders');
}

async function signup(req, res, next) {
  const enteredData = {
    email: req.body.email,
    confirmEmail: req.body['confirm-email'],
    password: req.body.password,
    confirmPassword: req.body['confirm-password'],
    name: req.body.fullname,
    phone: req.body.phone,
    street: req.body.street,
    postal: req.body.postal,
    city: req.body.city,
    country: req.body.country,
  };

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
    sessionFlash.flashDataToSession(
      req,
      {
        errorMessage:
          'Data provided is invalid, please check your input data again.',
        ...enteredData,
      },
      function () {
        res.redirect('/auth/signup');
      }
    );

    return;
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
      sessionFlash.flashDataToSession(
        req,
        {
          errorMessage: 'User exists already, please try loging in.',
          ...enteredData,
        },
        function () {
          res.redirect('/auth');
        }
      );
      return;
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
    sessionFlash.flashDataToSession(
      req,
      {
        errorMessage:
          'Invalid credentials. Please check your email and password.',
        email: user.email,
        password: user.password,
      },
      function () {
        res.redirect('/auth/login');
      }
    );

    return;
  }

  let passwordIsCorrect;
  try {
    passwordIsCorrect = await user.comparePassword(existingUser.password);
  } catch (error) {
    return next(error);
  }

  if (!passwordIsCorrect) {
    sessionFlash.flashDataToSession(
      req,
      {
        errorMessage:
          'Invalid credential. Please check your email and password',
        email: user.email,
        password: user.password,
      },
      function () {
        res.redirect('/auth');
      }
    );
    return;
  }

  authUtil.createUserSession(req, existingUser, function () {
    if (req.session.isAdmin) {
      res.redirect('/admin/orders');
    } else {
      res.redirect('/menu');
    }
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
  getSignup: getSignup,
  getLogin: getLogin,
  getOrders: getOrders,
  signup: signup,
  login: login,
  logout: logout,
};
