const sessionFlash = require('../util/session-flash');

const User = require('../models/user.model');

async function getAccount(req, res, next) {
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

module.exports = {
  getAccount: getAccount,
};
