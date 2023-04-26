const sessionFlash = require('../util/session-flash');
const inputValidation = require('../util/input-validation');

const User = require('../models/user.model');

async function getAccount(req, res, next) {
  let sessionData = sessionFlash.getSessionData(req);

  if (!sessionData) {
    sessionData = {
      email: '',
      name: '',
      phone: '',
      street: '',
      postal: '',
      city: '',
      country: '',
    };
  }

  try {
    const userid = res.locals.userid;
    const userData = await User.getUserWithSameId(userid);

    res.render('customer/account/account', {
      user: userData,
      inputData: sessionData,
    });
  } catch (error) {
    return next(error);
  }
}

async function updateUserData(req, res, next) {
  let userId = res.locals.userid
  
  if (
    !inputValidation.updatedUserDetailsAreValid(
      req.body.email,
      req.body.fullname,
      req.body.phone,
      req.body.street,
      req.body.postal,
      req.body.city,
      req.body.country
    )
  ) {
    return res.json({
      statusMessage: 'Some of your inputs is not valid, check them again!',
    });
  }

  const result = await User.editUser(req, userId);
  return res.json({
    statusMessage: result.statusMessage,
  });
}

module.exports = {
  getAccount: getAccount,
  updateUserData: updateUserData,
};
