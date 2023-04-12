const User = require('../models/user.model');
const Order = require('../models/order.model');

function getOrders(req, res) {
  res.render('customer/orders/orders');
}

async function checkOut(req, res, next) {
  const userid = req.session.userid;

  try {
    const userData = await User.getUserWithSameId(userid);
    res.render('customer/cart/checkout', { user: userData });
  } catch (error) {
    return next(error);
  }
}

async function placeOrder(req, res, next) {
  const cart = res.locals.cart;

  try {
    const order = new Order(
      cart,
      {
        fullname: req.body.fullname,
        phone: req.body.phone,
        street: req.body.street,
        postal: req.body.postal,
        city: req.body.city,
        country: req.body.country,
      },
      'pending',
      req.body.deliveryDate,
      req.body.pickup
    );

    await order.save();
  } catch (error) {
    return next(error);
  }

  req.session.cart = null;

  res.redirect('/orders');
}

module.exports = {
  placeOrder: placeOrder,
  checkOut: checkOut,
  getOrders: getOrders,
};
