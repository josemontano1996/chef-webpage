const User = require('../models/user.model');

async function checkOut(req, res) {
  const userid = req.session.userid;

  const userData = await User.getUserWithSameId(userid);
  console.log(userData);

  res.render('customer/cart/checkout', { user: userData });
}

function makeOrder(req, res) {
  const cart = res.locals.cart;
}

module.exports = {
  makeOrder: makeOrder,
  checkOut: checkOut,
};
