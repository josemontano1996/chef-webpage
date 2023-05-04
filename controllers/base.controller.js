const User = require('../models/user.model');
const Cart = require('../models/cart.model');

const authUtil = require('../util/authentication');
const inputValidation = require('../util/input-validation');
const sessionFlash = require('../util/session-flash');

function getIndex(req, res) {
  res.render('customer/index');
}

function getAbout(req, res) {
  res.render('customer/about');
}

function getAuth(req, res) {
  const sessionData = {
    email: '',
    confirmEmail: '',
    password: '',
    confirmPassword: '',
  };

  res.render('customer/auth/auth', { inputData: sessionData });
}

function getSignup(req, res) {
  let sessionData = sessionFlash.getSessionData(req);

  if (!sessionData) {
    sessionData = {
      email: '',
      confirmEmail: '',
      password: '',
      confirmPassword: '',
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

async function signup(req, res, next) {
  const enteredData = {
    email: req.body.email,
    confirmEmail: req.body['confirm-email'],
    password: req.body.password,
    confirmPassword: req.body['confirm-password'],
  };

  if (
    !inputValidation.signupDetailsAreValid(req.body.email, req.body.password) ||
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

  const user = new User(req.body.email, req.body.password);

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

  res.redirect('/auth');
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

async function logout(req, res, next) {
  try {
    await Cart.saveCartinDb(res);

    return req.session.destroy((err) => {
      if (err) {
        throw err;
      } else {
        res.redirect('/');
      }
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getIndex: getIndex,
  getAbout: getAbout,
  getAuth: getAuth,
  getSignup: getSignup,
  getLogin: getLogin,
  signup: signup,
  login: login,
  logout: logout,
};
